"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Trophy,
  Lightbulb,
  Lock,
} from "lucide-react";
import Link from "next/link";

type AssessmentResult = {
  id: string;
  overall_score: number;
  level: string;
  dimension_scores: Record<string, number>;
  created_at: string;
};

type UserProfile = {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  industry: string;
  plan: string;
};

const INDUSTRY_BENCHMARKS = {
  Tech: { avg: 3.8, top10: 4.5 },
  Financeiro: { avg: 3.2, top10: 4.2 },
  Retail: { avg: 2.5, top10: 3.8 },
  Saúde: { avg: 2.1, top10: 3.5 },
  Manufatura: { avg: 2.3, top10: 3.6 },
  Outro: { avg: 2.8, top10: 4.0 },
};

export default function HomeExecutivaPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [lastAssessment, setLastAssessment] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.push("/login");
        return;
      }

      // Carregar dados do usuário
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (userData) {
        setUser(userData as UserProfile);
      }

      // Carregar último assessment
      const { data: results } = await supabase
        .from("assessment_results")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (results && results.length > 0) {
        setLastAssessment(results[0] as AssessmentResult);
      }

      setIsLoading(false);
    };

    load();
  }, [router]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Inexistente":
        return "bg-red-50 text-red-900 border-red-200";
      case "Inicial":
        return "bg-orange-50 text-orange-900 border-orange-200";
      case "Intermediário":
        return "bg-yellow-50 text-yellow-900 border-yellow-200";
      case "Avançado":
        return "bg-blue-50 text-blue-900 border-blue-200";
      case "Otimizado":
        return "bg-green-50 text-green-900 border-green-200";
      default:
        return "bg-gray-50 text-gray-900 border-gray-200";
    }
  };

  const userIndustry = (user?.industry || "Tech") as keyof typeof INDUSTRY_BENCHMARKS;
  const benchmark = INDUSTRY_BENCHMARKS[userIndustry];
  const currentScore = lastAssessment?.overall_score || 0;
  const scoreGap = benchmark.avg - currentScore;
  const isGoldPlan = user?.plan === "gold";

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between fixed h-screen">
        <div>
          <div className="p-6 font-bold text-lg text-gray-900 flex items-center gap-2">
            <div className="h-8 w-8 bg-brand-primary text-white rounded flex items-center justify-center font-bold">
              DM
            </div>
            DataMaturity
          </div>

          <nav className="space-y-2 px-4">
            <button className="w-full text-left block p-3 rounded-lg bg-gray-100 font-medium text-gray-900 hover:bg-gray-200 transition-colors flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Home
            </button>
            <Link href="/diagnostico">
              <button className="w-full text-left block p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                Diagnóstico Atual
              </button>
            </Link>
            <Link href="/assessment">
              <button className="w-full text-left block p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                Novo diagnóstico
              </button>
            </Link>
            <Link href="/historico">
              <button className="w-full text-left block p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                Histórico
              </button>
            </Link>
            <Link href="/configuracoes">
              <button className="w-full text-left block p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                Configurações
              </button>
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 text-sm">
          <div className="font-medium text-gray-900">{user?.name || "Usuário"}</div>
          <div className="text-gray-500 text-xs">{user?.email}</div>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 ml-64 p-10">
        <div className="space-y-8">
          {/* HEADER */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Home Executiva</h1>
            <p className="text-lg text-gray-600 mt-2">
              Visão estratégica da maturidade de dados da sua empresa
            </p>
          </div>

          {/* SCORE ATUAL */}
          {lastAssessment && (
            <div className="bg-gradient-to-r from-brand-primary to-purple-600 rounded-2xl p-8 text-white">
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-purple-100 text-sm mb-2">Score Atual</p>
                  <p className="text-5xl font-bold">{lastAssessment.overall_score}</p>
                  <p className="text-purple-100 text-sm mt-2">{lastAssessment.level}</p>
                </div>
                <div>
                  <p className="text-purple-100 text-sm mb-2">Tendência</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    <p className="text-3xl font-bold">+0.2</p>
                  </div>
                  <p className="text-purple-100 text-sm mt-2">vs. último diagnóstico</p>
                </div>
                <div>
                  <p className="text-purple-100 text-sm mb-2">Data</p>
                  <p className="text-2xl font-bold">
                    {new Date(lastAssessment.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* BENCHMARKING */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Benchmarking de Mercado</h2>

            <div className="space-y-6">
              {/* Sua Empresa */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    Sua Empresa ({userIndustry})
                  </span>
                  <span className="text-sm font-bold text-brand-primary">{currentScore}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-brand-primary h-2 rounded-full"
                    style={{ width: `${(currentScore / benchmark.top10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Média da Indústria */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    Média da Indústria ({userIndustry})
                  </span>
                  <span className="text-sm font-bold text-orange-600">{benchmark.avg}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${(benchmark.avg / benchmark.top10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Top 10% */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    Top 10% da Indústria ({userIndustry})
                  </span>
                  <span className="text-sm font-bold text-green-600">{benchmark.top10}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(benchmark.top10 / benchmark.top10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Insight */}
              {scoreGap > 0 && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-900">
                    <strong>Gap identificado:</strong> Você está {scoreGap.toFixed(1)} pontos
                    abaixo da média da indústria. Fechar esse gap pode gerar impacto
                    significativo em eficiência operacional.
                  </p>
                </div>
              )}

              {/* Comparativo Completo (Gold) */}
              {isGoldPlan && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <h3 className="text-lg font-bold text-gray-900">
                      Comparativo Completo (Plano Gold)
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(INDUSTRY_BENCHMARKS).map(([industry, data]) => (
                      <div key={industry}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-700">Média - {industry}</span>
                          <span className="text-sm font-bold text-gray-900">{data.avg}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-400 h-1.5 rounded-full"
                            style={{ width: `${(data.avg / benchmark.top10) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA para upgrade (Bronze/Silver) */}
              {!isGoldPlan && (
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                  <Lock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-2">
                      Desbloqueie o comparativo completo com o plano Gold
                    </p>
                    <p className="text-sm text-blue-800 mb-3">
                      Veja como sua empresa se compara com TODOS os segmentos de mercado e
                      identifique oportunidades de melhoria.
                    </p>
                    <Link href="/planos">
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-800 underline">
                        Upgrade para Gold →
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* QUICK WINS */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Quick Wins (30 dias)</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Focar nas áreas de melhoria identificadas</p>
                  <p className="text-sm text-gray-600">
                    Priorize as 3 dimensões com menor score para ganho rápido de 0.5 pontos
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Criar um roadmap de 12 meses</p>
                  <p className="text-sm text-gray-600">
                    Alinhado com os objetivos de negócio para escalar iniciativas de dados
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Reavaliar em 6 meses</p>
                  <p className="text-sm text-gray-600">
                    Medir progresso e ajustar estratégia com base nos resultados
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PLANOS */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Planos e Recursos</h2>

            <div className="grid grid-cols-3 gap-6">
              {/* Bronze */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Bronze</h3>
                <p className="text-sm text-gray-600 mb-4">R$ 99/mês</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    1 diagnóstico/ano
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Relatório básico
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Benchmarking seu segmento
                  </li>
                </ul>
              </div>

              {/* Silver */}
              <div className="border-2 border-brand-primary rounded-lg p-6 bg-purple-50">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Silver</h3>
                <p className="text-sm text-gray-600 mb-4">R$ 299/mês</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    4 diagnósticos/ano
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Relatório detalhado
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Recomendações priorizadas
                  </li>
                </ul>
              </div>

              {/* Gold */}
              <div className="border border-yellow-400 rounded-lg p-6 bg-yellow-50">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Gold</h3>
                <p className="text-sm text-gray-600 mb-4">R$ 999/mês</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Ilimitado
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Relatório executivo + técnico
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Comparativo completo
                  </li>
                </ul>
              </div>
            </div>

            <Link href="/planos">
              <button className="mt-6 w-full py-3 bg-brand-primary text-white rounded-lg font-medium hover:opacity-90 transition-all">
                Ver todos os planos →
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
