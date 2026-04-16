"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/layout/sidebar";
import AuthenticatedLayout from "@/components/auth/AuthenticatedLayout";
import { ROADMAP_ACTIONS, DIMENSION_BENCHMARKS, INDUSTRY_BENCHMARKS } from "@/lib/benchmarks";
import { ROADMAP_METADATA, getEsforcoStyle, getPrazoStyle, getTipoStyle } from "@/lib/roadmap-metadata";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Target,
  TrendingUp,
  Zap,
  Lock,
  BarChart3,
  BookOpen,
  Users,
  Shield,
  Award,
} from "lucide-react";

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

const DIMENSION_ICONS: Record<string, any> = {
  "Estratégia & Governança": Shield,
  "Arquitetura & Engenharia": Zap,
  "Gestão de Dados": BookOpen,
  "Qualidade de Dados": CheckCircle2,
  "Analytics & Valor": BarChart3,
  "Cultura & Literacy": Users,
  "IA & Advanced Analytics": TrendingUp,
};

const LEVEL_LABELS: Record<number, string> = {
  1: "Inexistente",
  2: "Inicial",
  3: "Estruturado",
  4: "Gerenciado",
  5: "Otimizado",
};

function getScoreColor(score: number) {
  if (score < 1.5) return "text-red-600";
  if (score < 2.5) return "text-orange-600";
  if (score < 3.5) return "text-amber-600";
  if (score < 4.5) return "text-blue-600";
  return "text-emerald-600";
}

function getScoreBg(score: number) {
  if (score < 1.5) return "bg-red-50 border-red-200";
  if (score < 2.5) return "bg-orange-50 border-orange-200";
  if (score < 3.5) return "bg-amber-50 border-amber-200";
  if (score < 4.5) return "bg-blue-50 border-blue-200";
  return "bg-emerald-50 border-emerald-200";
}

function getProgressColor(score: number) {
  if (score < 1.5) return "bg-red-500";
  if (score < 2.5) return "bg-orange-500";
  if (score < 3.5) return "bg-amber-500";
  if (score < 4.5) return "bg-blue-500";
  return "bg-emerald-500";
}

export default function RoadmapPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [lastAssessment, setLastAssessment] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const load = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) { router.push("/login"); return; }

      const { data: userData } = await supabase.from("users").select("*").eq("id", authData.user.id).single();
      if (userData) setUser(userData as UserProfile);

      const { data: results } = await supabase
        .from("assessment_results")
        .select("*")
        .eq("user_id", authData.user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (results && results.length > 0) setLastAssessment(results[0] as AssessmentResult);
      setIsLoading(false);
    };
    load();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          <p className="mt-4 text-gray-600">Carregando roadmap...</p>
        </div>
      </div>
    );
  }

  const industry = (user?.industry || "Tech") as keyof typeof INDUSTRY_BENCHMARKS;
  const hasPaidPlan = user?.plan === "gold" || user?.plan === "silver" || user?.plan === "bronze";

  // Ordenar dimensões por score (menor primeiro = maior prioridade)
  const sortedDimensions = lastAssessment
    ? Object.entries(lastAssessment.dimension_scores).sort(([, a], [, b]) => a - b)
    : [];

  return (
    <AuthenticatedLayout>
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user || undefined} activePage="roadmap" />
      <main className="flex-1 ml-64 p-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* HEADER */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Roadmap de Maturidade</h1>
            <p className="text-gray-500 mt-2">
              Plano de ação personalizado baseado no seu diagnóstico mais recente
            </p>
          </div>

          {!lastAssessment ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum diagnóstico encontrado</h3>
              <p className="text-gray-500 mb-6">Faça seu primeiro diagnóstico para receber um roadmap personalizado.</p>
              <Link href="/assessment">
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                  Fazer Diagnóstico Agora
                </button>
              </Link>
            </div>
          ) : (
            <>
              {/* RESUMO DO SCORE */}
              <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-200 text-sm font-medium mb-1">Score Atual</p>
                    <p className="text-5xl font-bold">{lastAssessment.overall_score}</p>
                    <p className="text-indigo-200 mt-1">{lastAssessment.level} · {industry}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-200 text-sm font-medium mb-1">Média do Setor</p>
                    <p className="text-3xl font-bold">{INDUSTRY_BENCHMARKS[industry].avg}</p>
                    <p className="text-indigo-200 text-sm mt-1">
                      {lastAssessment.overall_score >= INDUSTRY_BENCHMARKS[industry].avg
                        ? "✅ Acima da média"
                        : `⚠️ ${(INDUSTRY_BENCHMARKS[industry].avg - lastAssessment.overall_score).toFixed(1)} pts abaixo da média`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-200 text-sm font-medium mb-1">Meta Top 10%</p>
                    <p className="text-3xl font-bold">{INDUSTRY_BENCHMARKS[industry].top10}</p>
                    <p className="text-indigo-200 text-sm mt-1">
                      {(INDUSTRY_BENCHMARKS[industry].top10 - lastAssessment.overall_score).toFixed(1)} pts para o topo
                    </p>
                  </div>
                </div>
              </div>

              {/* PRIORIDADES */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-amber-600" />
                  <h2 className="text-lg font-bold text-amber-900">Dimensões Prioritárias</h2>
                </div>
                <p className="text-amber-800 text-sm mb-4">
                  Foque nas dimensões abaixo para o maior impacto no seu score geral. Ordenadas por prioridade (menor score = maior impacto potencial).
                </p>
                <div className="flex flex-wrap gap-2">
                  {sortedDimensions.slice(0, 3).map(([name, score]) => (
                    <span key={name} className="inline-flex items-center gap-1.5 bg-amber-100 border border-amber-300 text-amber-900 text-sm font-medium px-3 py-1.5 rounded-full">
                      <span className="font-bold">{score}</span>
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              {/* DIMENSÕES COM AÇÕES */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Plano de Ação por Dimensão</h2>
                {sortedDimensions.map(([dimensionName, score], index) => {
                  const Icon = DIMENSION_ICONS[dimensionName] || Target;
                  const currentLevel = Math.floor(score);
                  const actions = ROADMAP_ACTIONS[dimensionName]?.[currentLevel] || [];
                  const benchmarkAvg = DIMENSION_BENCHMARKS[dimensionName]?.[industry] || 0;
                  const isExpanded = expandedDimension === dimensionName;
                  const isLocked = !hasPaidPlan;

                  return (
                    <div key={dimensionName} className={`bg-white rounded-2xl border-2 transition-all ${getScoreBg(score)}`}>
                      <button
                        className="w-full p-6 flex items-center gap-4 text-left"
                        onClick={() => !isLocked && setExpandedDimension(isExpanded ? null : dimensionName)}
                      >
                        {/* Prioridade */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          index < 3 ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-600"
                        }`}>
                          {index + 1}
                        </div>

                        {/* Ícone */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          score < 2.5 ? "bg-red-100" : score < 3.5 ? "bg-amber-100" : "bg-emerald-100"
                        }`}>
                          <Icon className={`w-5 h-5 ${getScoreColor(score)}`} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900">{dimensionName}</h3>
                            {isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full">
                              <div
                                className={`h-2 rounded-full ${getProgressColor(score)}`}
                                style={{ width: `${(score / 5) * 100}%` }}
                              />
                            </div>
                            <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}/5</span>
                            <span className="text-xs text-gray-500">Setor: {benchmarkAvg}</span>
                          </div>
                        </div>

                        {/* Nível e expand */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getScoreBg(score)} ${getScoreColor(score)}`}>
                            {LEVEL_LABELS[currentLevel] || "Inexistente"}
                          </span>
                          {isLocked ? (
                            <Lock className="w-4 h-4 text-gray-400" />
                          ) : isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {/* Ações expandidas */}
                      {isExpanded && !isLocked && (
                        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                          <p className="text-sm text-gray-600 mb-4">
                            <strong>Objetivo:</strong> Evoluir do nível <strong>{LEVEL_LABELS[currentLevel]}</strong> para <strong>{LEVEL_LABELS[Math.min(currentLevel + 1, 5)]}</strong>
                          </p>
                          <div className="space-y-3">
                            {actions.map((action, i) => {
                              const meta = ROADMAP_METADATA[action];
                              const esforcoStyle = meta ? getEsforcoStyle(meta.esforco) : null;
                              const prazoStyle   = meta ? getPrazoStyle(meta.prazo)     : null;
                              const tipoStyle    = meta ? getTipoStyle(meta.tipo)       : null;
                              return (
                                <div key={i} className="p-4 bg-white rounded-xl border border-gray-100 space-y-2.5">
                                  <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                      {i + 1}
                                    </div>
                                    <p className="text-sm text-gray-800 font-medium leading-snug">{action}</p>
                                  </div>
                                  {meta && (
                                    <div className="flex flex-wrap gap-1.5 pl-9">
                                      {/* Tipo */}
                                      {tipoStyle && (
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${tipoStyle.bg} ${tipoStyle.text} ${tipoStyle.border}`}>
                                          {meta.tipo}
                                        </span>
                                      )}
                                      {/* Esforço */}
                                      {esforcoStyle && (
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${esforcoStyle.bg} ${esforcoStyle.text} ${esforcoStyle.border}`}>
                                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${esforcoStyle.dot}`} />
                                          Esforço {meta.esforco}
                                        </span>
                                      )}
                                      {/* Prazo */}
                                      {prazoStyle && (
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${prazoStyle.bg} ${prazoStyle.text} ${prazoStyle.border}`}>
                                          ⏱ {meta.prazo}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                            <Award className="w-3.5 h-3.5" />
                            <span>Completar estas ações pode aumentar seu score em até +1.0 nesta dimensão</span>
                          </div>
                        </div>
                      )}

                      {/* Lock overlay */}
                      {isLocked && (
                        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">Desbloqueie com uma licença anual</p>
                              <p className="text-xs text-gray-500 mt-0.5">Acesse o plano de ação completo para todas as 7 dimensões com Bronze, Silver ou Gold</p>
                            </div>
                            <Link href="/planos" className="ml-auto">
                              <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 whitespace-nowrap">
                                Ver planos →
                              </button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* CTA NOVO DIAGNÓSTICO */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-indigo-900">Pronto para evoluir?</h3>
                  <p className="text-sm text-indigo-700 mt-1">
                    Após implementar as ações, faça um novo diagnóstico para medir seu progresso.
                  </p>
                </div>
                <Link href="/assessment">
                  <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition text-sm whitespace-nowrap">
                    Novo Diagnóstico
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
      </AuthenticatedLayout>
  );
}
