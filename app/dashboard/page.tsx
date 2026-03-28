"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/layout/sidebar";
import {
  TrendingUp, TrendingDown, Minus, ArrowRight, Target, Zap,
  BarChart3, AlertTriangle, CheckCircle2, Clock, ChevronRight, Activity,
} from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

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

const INDUSTRY_BENCHMARKS: Record<string, { avg: number; top10: number }> = {
  Tech: { avg: 3.8, top10: 4.5 },
  Financeiro: { avg: 3.2, top10: 4.2 },
  Retail: { avg: 2.5, top10: 3.8 },
  Saúde: { avg: 2.1, top10: 3.5 },
  Manufatura: { avg: 2.3, top10: 3.6 },
  Outro: { avg: 2.8, top10: 4.0 },
};

const DIMENSIONS = [
  "Estratégia & Governança",
  "Arquitetura & Engenharia",
  "Gestão de Dados",
  "Qualidade de Dados",
  "Analytics & Valor",
  "Cultura & Literacy",
  "IA & Advanced Analytics",
];

const DIMENSION_ICONS: Record<string, string> = {
  "Estratégia & Governança": "🎯",
  "Arquitetura & Engenharia": "⚙️",
  "Gestão de Dados": "🗄️",
  "Qualidade de Dados": "✅",
  "Analytics & Valor": "📊",
  "Cultura & Literacy": "🧠",
  "IA & Advanced Analytics": "🤖",
};

const getDimensionColor = (score: number) => {
  if (score >= 4) return { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", bar: "bg-emerald-500" };
  if (score >= 3) return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", bar: "bg-blue-500" };
  if (score >= 2) return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", bar: "bg-amber-500" };
  return { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", bar: "bg-red-500" };
};

const getDimensionStatus = (score: number) => {
  if (score >= 4) return "Avançado";
  if (score >= 3) return "Intermediário";
  if (score >= 2) return "Inicial";
  return "Crítico";
};

const SparklineTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-md px-2 py-1 text-xs font-semibold text-indigo-700">
        {payload[0].value}/5
      </div>
    );
  }
  return null;
};

export default function CockpitPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [lastAssessment, setLastAssessment] = useState<AssessmentResult | null>(null);
  const [allAssessments, setAllAssessments] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const load = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) { router.push("/auth/login"); return; }
      const { data: userData } = await supabase.from("users").select("*").eq("id", authData.user.id).single();
      if (userData) setUser(userData as UserProfile);
      const { data: results } = await supabase
        .from("assessment_results").select("*").eq("user_id", authData.user.id)
        .order("created_at", { ascending: false }).limit(10);
      if (results && results.length > 0) {
        setLastAssessment(results[0] as AssessmentResult);
        setAllAssessments(results as AssessmentResult[]);
      }
      setIsLoading(false);
    };
    load();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
          <p className="mt-3 text-gray-500 text-sm">Carregando cockpit...</p>
        </div>
      </div>
    );
  }

  const userIndustry = (user?.industry || "Tech") as keyof typeof INDUSTRY_BENCHMARKS;
  const benchmark = INDUSTRY_BENCHMARKS[userIndustry] || INDUSTRY_BENCHMARKS["Outro"];
  const currentScore = lastAssessment?.overall_score ?? 0;
  const prevScore = allAssessments[1]?.overall_score ?? null;
  const scoreDelta = prevScore !== null ? +(currentScore - prevScore).toFixed(1) : null;
  const scoreGap = +(benchmark.avg - currentScore).toFixed(1);
  const isGold = user?.plan === "gold";

  const sparkData = [...allAssessments].reverse().map((a, i) => ({ i, score: a.overall_score }));

  const dimensionScores = lastAssessment?.dimension_scores || {};
  const sortedDimensions = DIMENSIONS.map((d) => ({ name: d, score: dimensionScores[d] ?? 0 }))
    .sort((a, b) => a.score - b.score);

  const criticalDimensions = sortedDimensions.filter((d) => d.score < 2);
  const topPriority = sortedDimensions[0];

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  const firstName = user?.name?.split(" ")[0] || "Executivo";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user || undefined} activePage="home" />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* HEADER PERSONALIZADO */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{getGreeting()}, {firstName} 👋</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {user?.company ? `${user.company} · ` : ""}{userIndustry} · Plano{" "}
                <span className="font-semibold capitalize text-indigo-600">{user?.plan || "Starter"}</span>
              </p>
            </div>
            <Link href="/assessment">
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm">
                <Zap className="h-4 w-4" /> Novo Diagnóstico
              </button>
            </Link>
          </div>

          {/* KPI ROW */}
          {lastAssessment ? (
            <div className="grid grid-cols-4 gap-4">
              {/* Score */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white shadow-md">
                <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">Score de Maturidade</p>
                <p className="text-5xl font-bold">{currentScore}</p>
                <p className="text-sm font-medium mt-1 opacity-90">{lastAssessment.level}</p>
                <div className="mt-3 w-full bg-white/20 rounded-full h-1.5">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: `${(currentScore / 5) * 100}%` }} />
                </div>
                <p className="text-xs opacity-70 mt-1">{currentScore}/5.0</p>
              </div>

              {/* Tendência */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tendência</p>
                {scoreDelta !== null ? (
                  <div className={`flex items-center gap-1 ${scoreDelta > 0 ? "text-emerald-600" : scoreDelta < 0 ? "text-red-500" : "text-gray-500"}`}>
                    {scoreDelta > 0 ? <TrendingUp className="h-6 w-6" /> : scoreDelta < 0 ? <TrendingDown className="h-6 w-6" /> : <Minus className="h-6 w-6" />}
                    <span className="text-3xl font-bold">{scoreDelta > 0 ? "+" : ""}{scoreDelta}</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-gray-400">—</p>
                )}
                <p className="text-xs text-gray-400 mt-1">vs. diagnóstico anterior</p>
                {sparkData.length > 1 && (
                  <div className="mt-3 h-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparkData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                        <defs>
                          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Tooltip content={<SparklineTooltip />} />
                        <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fill="url(#sparkGrad)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Gap vs Mercado */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Gap vs. Mercado</p>
                <div className={`flex items-center gap-1 ${scoreGap > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                  {scoreGap > 0 ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                  <span className="text-3xl font-bold">{scoreGap > 0 ? "-" : "+"}{Math.abs(scoreGap)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">vs. média {userIndustry} ({benchmark.avg})</p>
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Você</span><span className="font-semibold text-indigo-600">{currentScore}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(currentScore / 5) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Média setor</span><span className="font-semibold text-orange-500">{benchmark.avg}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: `${(benchmark.avg / 5) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Último Diagnóstico */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Último Diagnóstico</p>
                <p className="text-xl font-bold text-gray-900">
                  {new Date(lastAssessment.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                  <p className="text-xs text-gray-400">
                    {Math.floor((Date.now() - new Date(lastAssessment.created_at).getTime()) / (1000 * 60 * 60 * 24))} dias atrás
                  </p>
                </div>
                <div className="mt-3 p-2 bg-indigo-50 rounded-lg">
                  <p className="text-xs text-indigo-700 font-medium">💡 Recomendado: reavalie em 90 dias</p>
                </div>
                <Link href="/assessment">
                  <button className="mt-3 w-full text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 py-1.5 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all">
                    Iniciar novo <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            /* ESTADO VAZIO */
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum diagnóstico realizado ainda</h3>
              <p className="text-gray-500 text-sm mb-6">
                Faça seu primeiro diagnóstico para ver o cockpit completo com insights e benchmarking.
              </p>
              <Link href="/assessment">
                <button className="bg-indigo-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all">
                  Iniciar Diagnóstico Gratuito →
                </button>
              </Link>
            </div>
          )}

          {lastAssessment && (
            <div className="grid grid-cols-3 gap-6">
              {/* SCORECARD POR DIMENSÃO */}
              <div className="col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-base font-bold text-gray-900">Scorecard por Dimensão</h2>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Crítico</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Inicial</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />Interm.</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Avançado</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {sortedDimensions.map((dim) => {
                    const colors = getDimensionColor(dim.score);
                    const pct = (dim.score / 5) * 100;
                    return (
                      <div key={dim.name} className={`flex items-center gap-4 p-3 rounded-xl border ${colors.bg} ${colors.border}`}>
                        <span className="text-xl w-7 text-center flex-shrink-0">{DIMENSION_ICONS[dim.name]}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-sm font-semibold text-gray-800 truncate">{dim.name}</span>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                                {getDimensionStatus(dim.score)}
                              </span>
                              <span className={`text-sm font-bold ${colors.text}`}>{dim.score}/5</span>
                            </div>
                          </div>
                          <div className="w-full bg-white/70 rounded-full h-1.5">
                            <div className={`${colors.bar} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COLUNA DIREITA */}
              <div className="space-y-4">

                {/* PRIORIDADE #1 */}
                {topPriority && (
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="h-4 w-4 text-red-600" />
                      <h3 className="text-sm font-bold text-red-800">Prioridade #1</h3>
                    </div>
                    <p className="text-base font-bold text-gray-900 mb-1">{topPriority.name}</p>
                    <p className="text-xs text-gray-600 mb-3">
                      Score atual de <strong className="text-red-600">{topPriority.score}/5</strong> — dimensão mais crítica do diagnóstico.
                    </p>
                    <div className="bg-white rounded-lg p-3 border border-red-100 mb-3">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Ação recomendada:</p>
                      <p className="text-xs text-gray-600">
                        {topPriority.score < 1.5
                          ? "Estruture uma política básica e defina responsáveis por esta área."
                          : topPriority.score < 2.5
                          ? "Formalize processos existentes e capacite a equipe."
                          : "Automatize e monitore com KPIs definidos."}
                      </p>
                    </div>
                    <Link href="/roadmap">
                      <button className="w-full text-xs font-semibold text-red-700 hover:text-red-900 flex items-center justify-center gap-1 py-2 border border-red-200 rounded-lg hover:bg-red-100 transition-all">
                        Ver Roadmap Completo <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  </div>
                )}

                {/* ÁREAS CRÍTICAS */}
                {criticalDimensions.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <h3 className="text-sm font-bold text-gray-900">Áreas Críticas</h3>
                      <span className="ml-auto bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        {criticalDimensions.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {criticalDimensions.map((d) => (
                        <div key={d.name} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                          <span className="text-xs text-gray-700 font-medium">{DIMENSION_ICONS[d.name]} {d.name}</span>
                          <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{d.score}/5</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* BENCHMARK COMPACTO */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-4 w-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-gray-900">Benchmark {userIndustry}</h3>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: "Sua empresa", value: currentScore, color: "bg-indigo-500", textColor: "text-indigo-600" },
                      { label: "Média do setor", value: benchmark.avg, color: "bg-orange-400", textColor: "text-orange-500" },
                      { label: "Top 10%", value: benchmark.top10, color: "bg-emerald-500", textColor: "text-emerald-600" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">{item.label}</span>
                          <span className={`font-bold ${item.textColor}`}>{item.value}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className={`${item.color} h-2 rounded-full`} style={{ width: `${(item.value / 5) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {!isGold && (
                    <Link href="/planos">
                      <p className="text-xs text-indigo-600 font-medium mt-3 flex items-center gap-1 hover:underline cursor-pointer">
                        Ver comparativo completo (Gold) <ChevronRight className="h-3 w-3" />
                      </p>
                    </Link>
                  )}
                </div>

                {/* QUICK WINS */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-gray-900">Quick Wins (30 dias)</h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      "Mapear responsáveis por dados em cada área",
                      "Criar glossário básico de dados da empresa",
                      "Definir 3 KPIs de qualidade de dados",
                    ].map((win, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-5 h-5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-xs text-gray-700">{win}</p>
                      </div>
                    ))}
                  </div>
                  <Link href="/roadmap">
                    <button className="mt-3 w-full text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center justify-center gap-1 py-2 border border-amber-200 rounded-lg hover:bg-amber-50 transition-all">
                      Ver Roadmap Completo <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
