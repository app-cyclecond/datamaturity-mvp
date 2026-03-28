"use client";
import { Sidebar } from "@/components/layout/sidebar";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Home,
  BarChart3,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  industry: string;
  plan: string;
};

type AssessmentResult = {
  id: string;
  overall_score: number;
  level: string;
  dimension_scores: Record<string, number>;
  created_at: string;
};

export default function DiagnosticoPage() {
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

      const { data: results } = await supabase
        .from("assessment_results")
        .select("*")
        .eq("user_id", authData.user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (results && results.length > 0) {
        setLastAssessment(results[0] as AssessmentResult);
      }

      setIsLoading(false);
    };

    load();
  }, [router]);

  const name = user?.name || "Usuário";

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

  const getLevelDescription = (level: string) => {
    const descriptions: Record<string, string> = {
      Inexistente: "A prática não existe ou ocorre de forma totalmente informal.",
      Inicial: "A prática existe de forma pontual, com forte dependência de esforços manuais.",
      Intermediário: "A prática está definida e documentada, com processos estabelecidos.",
      Avançado: "A prática é monitorada, mensurada e executada de forma consistente.",
      Otimizado: "A prática é continuamente aprimorada e integrada à estratégia do negócio.",
    };
    return descriptions[level] || "";
  };

  const getTopStrengths = (scores: Record<string, number>) => {
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, score]) => ({ name, score }));
  };

  const getTopWeaknesses = (scores: Record<string, number>) => {
    return Object.entries(scores)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 3)
      .map(([name, score]) => ({ name, score }));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar user={user || undefined} activePage="diagnostico" />

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-10">
        {!lastAssessment ? (
          <div className="max-w-3xl mx-auto text-center mt-20">
            {/* HEADER */}
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Bem-vindo, {name}
            </h1>
            <p className="text-lg text-gray-600 mb-12">
              Veja como sua empresa está em Dados & AI
            </p>

            {/* CARD PRINCIPAL */}
            <div className="bg-white border border-gray-200 rounded-2xl p-12 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Descubra em 10 minutos onde sua organização está — e receba um relatório pronto para apresentar ao board.
              </h2>

              <Button
                onClick={() => router.push("/assessment")}
                className="mt-6 px-8 py-6 text-lg bg-indigo-600 text-white hover:opacity-90 transition-all"
              >
                Iniciar diagnóstico
              </Button>

              <p className="text-sm text-gray-500 mt-6">
                Gratuito · Sem cartão de crédito · Resultado imediato
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* BOTÃO VOLTAR */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>

            {/* HEADER */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Executivo
              </h1>
              <p className="text-gray-600 mt-1">
                Diagnóstico de {new Date(lastAssessment.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>

            {/* SCORE GERAL */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-indigo-400">
                <p className="text-indigo-100 text-sm font-medium mb-2">Score Geral</p>
                <div className="text-6xl font-black text-white mb-3">
                  {lastAssessment.overall_score}
                </div>
                <div
                  className={`inline-block px-4 py-2 rounded-lg border text-sm font-bold bg-white/20 backdrop-blur-sm ${
                    getLevelColor(
                      lastAssessment.level
                    )
                  }`}
                >
                  {lastAssessment.level}
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-emerald-200">
                <p className="text-emerald-700 text-sm font-bold mb-3 flex items-center gap-2">
                  <span className="text-lg">💡</span> O que significa?
                </p>
                <p className="text-emerald-900 text-sm leading-relaxed font-medium">
                  {getLevelDescription(lastAssessment.level)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-amber-200">
                <p className="text-amber-700 text-sm font-bold mb-3 flex items-center gap-2">
                  <span className="text-lg">📊</span> Dimensões Avaliadas
                </p>
                <div className="text-5xl font-black text-amber-600 mb-2">
                  {Object.keys(lastAssessment.dimension_scores).length}
                </div>
                <p className="text-amber-700 text-sm font-semibold">áreas de maturidade</p>
              </div>
            </div>

            {/* FORÇAS E FRAQUEZAS */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* FORÇAS */}
              <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-2xl border-2 border-emerald-300 p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-emerald-500 p-3 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-emerald-900">Áreas de Força</h3>
                </div>
                <div className="space-y-3">
                  {getTopStrengths(lastAssessment.dimension_scores).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/60 rounded-lg hover:bg-white transition-colors">
                      <span className="text-emerald-900 font-semibold">{item.name}</span>
                      <div className="flex items-center gap-2 bg-emerald-100 px-3 py-1 rounded-lg">
                        <span className="font-black text-emerald-600 text-lg">{item.score}</span>
                        <ArrowUp className="h-5 w-5 text-emerald-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FRAQUEZAS */}
              <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 rounded-2xl border-2 border-orange-300 p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-500 p-3 rounded-xl">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-orange-900">Áreas de Melhoria</h3>
                </div>
                <div className="space-y-3">
                  {getTopWeaknesses(lastAssessment.dimension_scores).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/60 rounded-lg hover:bg-white transition-colors">
                      <span className="text-orange-900 font-semibold">{item.name}</span>
                      <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-lg">
                        <span className="font-black text-orange-600 text-lg">{item.score}</span>
                        <ArrowDown className="h-5 w-5 text-orange-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RECOMENDAÇÕES */}
            <div className="bg-gradient-to-r from-indigo-600/10 to-purple-500/10 rounded-2xl border border-indigo-600/20 p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Lightbulb className="h-6 w-6 text-indigo-600 mt-1" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Próximos Passos Recomendados</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-1">1.</span>
                      <span>Acesse o <strong>Roadmap de Maturidade</strong> para ver ações concretas priorizadas por dimensão.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-1">2.</span>
                      <span>Explore a <strong>Biblioteca</strong> para aprofundar nas áreas com menor score.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold mt-1">3.</span>
                      <span>Refaça o diagnóstico em 90 dias para medir seu progresso.</span>
                    </li>
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      onClick={() => router.push("/resultado/" + lastAssessment.id)}
                      className="bg-indigo-600 text-white hover:opacity-90 flex items-center gap-2"
                    >
                      Ver Relatório Completo
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => router.push("/roadmap")}
                      variant="outline"
                      className="flex items-center gap-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600/10"
                    >
                      Ver Roadmap
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => router.push("/biblioteca")}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      Explorar Biblioteca
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* TODOS OS SCORES */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Scores por Dimensão</h3>
              <div className="space-y-4">
                {Object.entries(lastAssessment.dimension_scores).map(([name, score], i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">{name}</span>
                      <span className="font-bold text-gray-900">{score}/5</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${(score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
