"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Trophy,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

type AssessmentResult = {
  id: string;
  overall_score: number;
  level: string;
  dimension_scores: Record<string, number>;
  created_at: string;
};

const INDUSTRY_BENCHMARKS = {
  Tech: { avg: 3.8, top10: 4.5 },
  Financeiro: { avg: 3.2, top10: 4.2 },
  Retail: { avg: 2.5, top10: 3.8 },
  Saúde: { avg: 2.1, top10: 3.5 },
  Manufatura: { avg: 2.3, top10: 3.6 },
};

export default function HomeExecutivaPage() {
  const router = useRouter();
  const [lastAssessment, setLastAssessment] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState<keyof typeof INDUSTRY_BENCHMARKS>("Tech");

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }

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

  const benchmark = INDUSTRY_BENCHMARKS[selectedIndustry];
  const currentScore = lastAssessment?.overall_score || 0;
  const scoreGap = benchmark.avg - currentScore;
  const positionPercentage = (currentScore / benchmark.top10) * 100;

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
          <div className="font-medium text-gray-900">Usuário</div>
          <div className="text-gray-500 text-xs">Logado</div>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 ml-64 p-10">
        <div className="space-y-8">
          {/* HEADER */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Home Executiva</h1>
            <p className="text-gray-600 mt-1">Visão estratégica da maturidade de dados da sua empresa</p>
          </div>

          {!lastAssessment ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum diagnóstico realizado</h3>
              <p className="text-gray-600 mb-6">Comece fazendo seu primeiro diagnóstico para ver insights aqui.</p>
              <Button
                onClick={() => router.push("/assessment")}
                className="bg-brand-primary text-white hover:opacity-90"
              >
                Iniciar Diagnóstico
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* SCORE ATUAL */}
              <div className="bg-gradient-to-r from-brand-primary to-purple-600 text-white rounded-2xl p-8 shadow-lg">
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <p className="text-purple-100 text-sm font-medium mb-2">Score Atual</p>
                    <div className="text-5xl font-bold mb-2">{lastAssessment.overall_score}</div>
                    <div className={`inline-block px-3 py-1 rounded-lg border text-xs font-semibold bg-white/20 border-white/30 text-white`}>
                      {lastAssessment.level}
                    </div>
                  </div>
                  <div>
                    <p className="text-purple-100 text-sm font-medium mb-2">Tendência</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-6 w-6" />
                      <span className="text-2xl font-bold">+0.2</span>
                    </div>
                    <p className="text-purple-100 text-xs mt-2">vs. último diagnóstico</p>
                  </div>
                  <div>
                    <p className="text-purple-100 text-sm font-medium mb-2">Data</p>
                    <div className="text-lg font-semibold">
                      {new Date(lastAssessment.created_at).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                </div>
              </div>

              {/* BENCHMARKING */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Benchmarking de Mercado</h2>
                
                <div className="mb-6">
                  <p className="text-gray-600 text-sm font-medium mb-3">Selecione sua indústria:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(INDUSTRY_BENCHMARKS).map((industry) => (
                      <button
                        key={industry}
                        onClick={() => setSelectedIndustry(industry as keyof typeof INDUSTRY_BENCHMARKS)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedIndustry === industry
                            ? "bg-brand-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>

                {/* COMPARATIVO */}
                <div className="space-y-6">
                  {/* Sua Empresa */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-900">Sua Empresa</span>
                      <span className="font-bold text-brand-primary">{currentScore}</span>
                    </div>
                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-primary rounded-full"
                        style={{ width: `${Math.min(positionPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Média da Indústria */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-900">Média da Indústria ({selectedIndustry})</span>
                      <span className="font-bold text-orange-600">{benchmark.avg}</span>
                    </div>
                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${(benchmark.avg / benchmark.top10) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Top 10% */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-900">Top 10% da Indústria</span>
                      <span className="font-bold text-green-600">{benchmark.top10}</span>
                    </div>
                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                </div>

                {/* INSIGHT */}
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-orange-900 text-sm">
                    <strong>Gap identificado:</strong> Você está {scoreGap.toFixed(1)} pontos abaixo da média da indústria. 
                    Fechar esse gap pode gerar impacto significativo em eficiência operacional.
                  </p>
                </div>
              </div>

              {/* QUICK WINS */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="h-6 w-6 text-brand-primary" />
                  <h2 className="text-2xl font-bold text-gray-900">Quick Wins (30 dias)</h2>
                </div>
                
                <div className="space-y-4">
                  {[
                    {
                      title: "Implementar Catálogo de Dados",
                      impact: "+0.3",
                      effort: "Médio",
                      description: "Documentar e catalogar todos os dados críticos da empresa"
                    },
                    {
                      title: "Criar Governança Básica",
                      impact: "+0.25",
                      effort: "Médio",
                      description: "Definir papéis, responsabilidades e políticas de dados"
                    },
                    {
                      title: "Treinar Equipe em Data Literacy",
                      impact: "+0.2",
                      effort: "Baixo",
                      description: "Workshop com equipe sobre importância e uso de dados"
                    },
                  ].map((win, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900">{win.title}</h4>
                          <p className="text-gray-600 text-sm mt-1">{win.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{win.impact}</div>
                          <div className="text-xs text-gray-500">{win.effort}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ROADMAP */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="h-6 w-6 text-brand-primary" />
                  <h2 className="text-2xl font-bold text-gray-900">Roadmap de Maturidade</h2>
                </div>

                <div className="space-y-6">
                  {[
                    { phase: "Hoje", score: currentScore, level: lastAssessment.level, timeline: "Atual" },
                    { phase: "30 dias", score: currentScore + 0.75, level: "Inicial", timeline: "Quick Wins" },
                    { phase: "6 meses", score: 2.5, level: "Intermediário", timeline: "Estruturação" },
                    { phase: "12 meses", score: 3.5, level: "Avançado", timeline: "Otimização" },
                  ].map((milestone, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-gray-900">{milestone.phase}</h4>
                          <span className="text-sm text-gray-500">{milestone.timeline}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-brand-primary">{milestone.score}</span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">{milestone.level}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEÇÃO DE VALOR - PLANOS */}
              <div className="bg-gradient-to-r from-brand-primary/10 to-purple-500/10 rounded-2xl border border-brand-primary/20 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Maximize o Valor com DataMaturity</h2>
                <p className="text-gray-600 mb-6">Escolha o plano ideal para sua empresa e acelere sua jornada de maturidade</p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {[
                    { name: "Bronze", price: "R$ 99", features: "1 diagnóstico/ano, Relatório básico" },
                    { name: "Silver", price: "R$ 299", features: "4 diagnósticos/ano, Relatório detalhado, Suporte chat" },
                    { name: "Gold", price: "R$ 999", features: "Ilimitado, Roadmap customizado, Dedicated manager" },
                  ].map((plan, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-1">{plan.name}</h3>
                      <div className="text-2xl font-bold text-brand-primary mb-2">{plan.price}</div>
                      <p className="text-xs text-gray-600">{plan.features}</p>
                    </div>
                  ))}
                </div>

                <Button asChild className="bg-brand-primary text-white hover:opacity-90">
                  <Link href="/planos">
                    Ver Todos os Planos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* CTA FINAL */}
              <div className="flex gap-4">
                <Button
                  onClick={() => router.push("/assessment")}
                  className="flex-1 bg-brand-primary text-white hover:opacity-90 py-6 text-lg"
                >
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Fazer Novo Diagnóstico
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 py-6 text-lg"
                >
                  <Link href="/dashboard">
                    Ver Dashboard Completo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
