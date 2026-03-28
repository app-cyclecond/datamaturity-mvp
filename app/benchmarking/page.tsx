"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/layout/sidebar";
import {
  BarChart3, TrendingUp, TrendingDown, Minus, Lock, ChevronRight,
  Info, Award, Target, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Cell,
} from "recharts";

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

const INDUSTRY_BENCHMARKS: Record<string, {
  avg: number;
  top10: number;
  top25: number;
  bottom25: number;
  dimensions: Record<string, number>;
  companies: number;
  description: string;
}> = {
  Tech: {
    avg: 3.8, top10: 4.5, top25: 4.1, bottom25: 3.0,
    companies: 847,
    description: "Empresas de tecnologia, SaaS, startups e scale-ups",
    dimensions: {
      "Estratégia & Governança": 3.9,
      "Arquitetura & Engenharia": 4.2,
      "Gestão de Dados": 3.7,
      "Qualidade de Dados": 3.6,
      "Analytics & Valor": 4.0,
      "Cultura & Literacy": 3.8,
      "IA & Advanced Analytics": 3.9,
    },
  },
  Financeiro: {
    avg: 3.2, top10: 4.2, top25: 3.7, bottom25: 2.5,
    companies: 623,
    description: "Bancos, fintechs, seguradoras e gestoras de investimento",
    dimensions: {
      "Estratégia & Governança": 3.8,
      "Arquitetura & Engenharia": 3.3,
      "Gestão de Dados": 3.5,
      "Qualidade de Dados": 3.4,
      "Analytics & Valor": 3.1,
      "Cultura & Literacy": 2.7,
      "IA & Advanced Analytics": 2.8,
    },
  },
  Retail: {
    avg: 2.5, top10: 3.8, top25: 3.1, bottom25: 1.8,
    companies: 412,
    description: "Varejo físico, e-commerce e marketplaces",
    dimensions: {
      "Estratégia & Governança": 2.4,
      "Arquitetura & Engenharia": 2.6,
      "Gestão de Dados": 2.3,
      "Qualidade de Dados": 2.5,
      "Analytics & Valor": 2.9,
      "Cultura & Literacy": 2.2,
      "IA & Advanced Analytics": 2.1,
    },
  },
  Saúde: {
    avg: 2.1, top10: 3.5, top25: 2.8, bottom25: 1.4,
    companies: 289,
    description: "Hospitais, clínicas, healthtechs e planos de saúde",
    dimensions: {
      "Estratégia & Governança": 2.3,
      "Arquitetura & Engenharia": 2.0,
      "Gestão de Dados": 2.2,
      "Qualidade de Dados": 2.4,
      "Analytics & Valor": 1.9,
      "Cultura & Literacy": 1.8,
      "IA & Advanced Analytics": 1.7,
    },
  },
  Manufatura: {
    avg: 2.3, top10: 3.6, top25: 2.9, bottom25: 1.6,
    companies: 334,
    description: "Indústria, bens de consumo e cadeia de suprimentos",
    dimensions: {
      "Estratégia & Governança": 2.2,
      "Arquitetura & Engenharia": 2.5,
      "Gestão de Dados": 2.4,
      "Qualidade de Dados": 2.3,
      "Analytics & Valor": 2.1,
      "Cultura & Literacy": 2.0,
      "IA & Advanced Analytics": 2.0,
    },
  },
  Outro: {
    avg: 2.8, top10: 4.0, top25: 3.3, bottom25: 2.0,
    companies: 521,
    description: "Outros segmentos e empresas diversificadas",
    dimensions: {
      "Estratégia & Governança": 2.8,
      "Arquitetura & Engenharia": 2.9,
      "Gestão de Dados": 2.7,
      "Qualidade de Dados": 2.8,
      "Analytics & Valor": 2.9,
      "Cultura & Literacy": 2.6,
      "IA & Advanced Analytics": 2.5,
    },
  },
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

const DIMENSION_SHORT: Record<string, string> = {
  "Estratégia & Governança": "Estratégia",
  "Arquitetura & Engenharia": "Arquitetura",
  "Gestão de Dados": "Gestão",
  "Qualidade de Dados": "Qualidade",
  "Analytics & Valor": "Analytics",
  "Cultura & Literacy": "Cultura",
  "IA & Advanced Analytics": "IA",
};

const getPercentileLabel = (score: number, benchmark: typeof INDUSTRY_BENCHMARKS[string]) => {
  if (score >= benchmark.top10) return { label: "Top 10%", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" };
  if (score >= benchmark.top25) return { label: "Top 25%", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" };
  if (score >= benchmark.avg) return { label: "Acima da média", color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200" };
  if (score >= benchmark.bottom25) return { label: "Abaixo da média", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" };
  return { label: "Bottom 25%", color: "text-red-600", bg: "bg-red-50 border-red-200" };
};

const CustomRadarTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2 mb-1 last:mb-0">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-gray-600">{p.name}:</span>
            <span className="font-bold text-gray-900">{p.value}/5</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function BenchmarkingPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [lastAssessment, setLastAssessment] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const load = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) { router.push("/auth/login"); return; }
      const { data: userData } = await supabase.from("users").select("*").eq("id", authData.user.id).single();
      if (userData) setUser(userData as UserProfile);
      const { data: results } = await supabase
        .from("assessment_results").select("*").eq("user_id", authData.user.id)
        .order("created_at", { ascending: false }).limit(1);
      if (results && results.length > 0) setLastAssessment(results[0] as AssessmentResult);
      setIsLoading(false);
    };
    load();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
          <p className="mt-3 text-gray-500 text-sm">Carregando benchmarks...</p>
        </div>
      </div>
    );
  }

  const isPaidPlan = user?.plan === "silver" || user?.plan === "gold";
  const isGold = user?.plan === "gold";
  const userIndustry = (user?.industry || "Tech") as keyof typeof INDUSTRY_BENCHMARKS;
  const userBenchmark = INDUSTRY_BENCHMARKS[userIndustry] || INDUSTRY_BENCHMARKS["Outro"];
  const currentScore = lastAssessment?.overall_score ?? 0;
  const dimensionScores = lastAssessment?.dimension_scores || {};
  const percentile = getPercentileLabel(currentScore, userBenchmark);

  const compareIndustry = (selectedIndustry || userIndustry) as keyof typeof INDUSTRY_BENCHMARKS;
  const compareBenchmark = INDUSTRY_BENCHMARKS[compareIndustry] || INDUSTRY_BENCHMARKS["Outro"];

  // Dados para radar chart
  const radarData = DIMENSIONS.map((d) => ({
    dimension: DIMENSION_SHORT[d],
    "Sua empresa": dimensionScores[d] ?? 0,
    [`Média ${compareIndustry}`]: compareBenchmark.dimensions[d] ?? 0,
  }));

  // Dados para bar chart comparativo
  const barData = DIMENSIONS.map((d) => ({
    name: DIMENSION_SHORT[d],
    Você: dimensionScores[d] ?? 0,
    Setor: compareBenchmark.dimensions[d] ?? 0,
  }));

  // Ranking de todos os setores
  const industryRanking = Object.entries(INDUSTRY_BENCHMARKS)
    .sort((a, b) => b[1].avg - a[1].avg)
    .map(([name, data], i) => ({ name, ...data, rank: i + 1 }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user || undefined} activePage="benchmarking" />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Benchmarking Setorial</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Compare sua maturidade com empresas do mesmo setor e identifique gaps estratégicos
              </p>
            </div>
            {!isPaidPlan && (
              <Link href="/planos">
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm">
                  <Award className="h-4 w-4" /> Desbloquear Silver/Gold
                </button>
              </Link>
            )}
          </div>

          {/* POSIÇÃO NO RANKING */}
          {lastAssessment && (
            <div className="grid grid-cols-4 gap-4">
              <div className={`rounded-2xl p-5 border ${percentile.bg}`}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Sua Posição</p>
                <p className={`text-2xl font-bold ${percentile.color}`}>{percentile.label}</p>
                <p className="text-xs text-gray-500 mt-1">no setor {userIndustry}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Seu Score</p>
                <p className="text-3xl font-bold text-indigo-600">{currentScore}</p>
                <p className="text-xs text-gray-500 mt-1">vs. média {userBenchmark.avg} do setor</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Gap para Top 25%</p>
                {currentScore >= userBenchmark.top25 ? (
                  <div className="flex items-center gap-1 text-emerald-600">
                    <TrendingUp className="h-5 w-5" />
                    <p className="text-2xl font-bold">Atingido!</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-amber-600">
                    <TrendingDown className="h-5 w-5" />
                    <p className="text-2xl font-bold">-{(userBenchmark.top25 - currentScore).toFixed(1)}</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">referência: {userBenchmark.top25}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Gap para Top 10%</p>
                {currentScore >= userBenchmark.top10 ? (
                  <div className="flex items-center gap-1 text-emerald-600">
                    <Award className="h-5 w-5" />
                    <p className="text-2xl font-bold">Elite!</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-500">
                    <Target className="h-5 w-5" />
                    <p className="text-2xl font-bold">-{(userBenchmark.top10 - currentScore).toFixed(1)}</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">referência: {userBenchmark.top10}</p>
              </div>
            </div>
          )}

          {/* CONTEÚDO PRINCIPAL */}
          {!lastAssessment ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
              <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Realize um diagnóstico primeiro</h3>
              <p className="text-gray-500 text-sm mb-6">
                Para comparar com o mercado, você precisa ter pelo menos um diagnóstico realizado.
              </p>
              <Link href="/assessment">
                <button className="bg-indigo-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all">
                  Iniciar Diagnóstico →
                </button>
              </Link>
            </div>
          ) : !isPaidPlan ? (
            /* PAYWALL */
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-10 text-center">
              <Lock className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Benchmarking Setorial Completo</h3>
              <p className="text-gray-600 text-sm mb-6 max-w-lg mx-auto">
                Disponível nos planos <strong>Silver</strong> e <strong>Gold</strong>. Compare sua empresa com{" "}
                <strong>{userBenchmark.companies}+ empresas</strong> do setor {userIndustry} e identifique
                exatamente onde você está perdendo para a concorrência.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                {[
                  { icon: "📊", title: "Radar por dimensão", desc: "Veja gaps em cada área vs. setor" },
                  { icon: "🏆", title: "Ranking setorial", desc: "Sua posição entre os pares" },
                  { icon: "🎯", title: "Análise multi-setor", desc: "Compare com outros setores" },
                ].map((f) => (
                  <div key={f.title} className="bg-white rounded-xl p-4 border border-indigo-100">
                    <p className="text-2xl mb-2">{f.icon}</p>
                    <p className="text-sm font-bold text-gray-900">{f.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
                  </div>
                ))}
              </div>
              <Link href="/planos">
                <button className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-md">
                  Ver Planos Silver e Gold →
                </button>
              </Link>
            </div>
          ) : (
            /* CONTEÚDO COMPLETO PARA SILVER/GOLD */
            <div className="space-y-6">

              {/* SELETOR DE SETOR PARA COMPARAÇÃO */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-semibold text-gray-700">Comparar com:</span>
                  {Object.keys(INDUSTRY_BENCHMARKS).map((ind) => (
                    <button
                      key={ind}
                      onClick={() => setSelectedIndustry(ind === userIndustry && !selectedIndustry ? null : ind)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        (selectedIndustry || userIndustry) === ind
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300"
                      }`}
                    >
                      {ind}
                      {ind === userIndustry && <span className="ml-1 opacity-70">(seu setor)</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* RADAR CHART + BAR CHART */}
              <div className="grid grid-cols-2 gap-6">
                {/* Radar */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-base font-bold text-gray-900">Perfil de Maturidade</h2>
                    <span className="ml-auto text-xs text-gray-400">vs. {compareIndustry}</span>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: "#6b7280" }} />
                      <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 9 }} tickCount={6} />
                      <Tooltip content={<CustomRadarTooltip />} />
                      <Radar name="Sua empresa" dataKey="Sua empresa" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                      <Radar name={`Média ${compareIndustry}`} dataKey={`Média ${compareIndustry}`} stroke="#f97316" fill="#f97316" fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 4" />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="flex items-center gap-4 justify-center mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span className="w-3 h-0.5 bg-indigo-500 inline-block" />Sua empresa
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span className="w-3 h-0.5 bg-orange-400 inline-block border-dashed" />Média {compareIndustry}
                    </div>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-base font-bold text-gray-900">Comparativo por Dimensão</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={barData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} />
                      <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                        formatter={(value) => [`${value}/5`]}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Bar dataKey="Você" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Setor" fill="#f97316" radius={[4, 4, 0, 0]} opacity={0.7} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* TABELA DETALHADA POR DIMENSÃO */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <Target className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-base font-bold text-gray-900">Análise Detalhada por Dimensão</h2>
                  <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                    <Info className="h-3.5 w-3.5" />
                    <span>Comparando com {compareBenchmark.companies} empresas do setor {compareIndustry}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {DIMENSIONS.map((dim) => {
                    const yourScore = dimensionScores[dim] ?? 0;
                    const sectorScore = compareBenchmark.dimensions[dim] ?? 0;
                    const diff = +(yourScore - sectorScore).toFixed(1);
                    return (
                      <div key={dim} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="w-36 flex-shrink-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{dim}</p>
                        </div>
                        <div className="flex-1 flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500">Você</span>
                              <span className="font-bold text-indigo-600">{yourScore}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(yourScore / 5) * 100}%` }} />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500">Setor</span>
                              <span className="font-bold text-orange-500">{sectorScore}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: `${(sectorScore / 5) * 100}%` }} />
                            </div>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 flex-shrink-0 w-20 justify-end ${diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-500" : "text-gray-400"}`}>
                          {diff > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : diff < 0 ? <TrendingDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                          <span className="text-xs font-bold">{diff > 0 ? "+" : ""}{diff}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RANKING MULTI-SETOR (Gold only) */}
              {isGold ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <Award className="h-5 w-5 text-amber-500" />
                    <h2 className="text-base font-bold text-gray-900">Ranking Multi-Setor</h2>
                    <span className="ml-2 text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">Gold</span>
                  </div>
                  <div className="space-y-3">
                    {industryRanking.map((ind) => {
                      const isUserSector = ind.name === userIndustry;
                      return (
                        <div key={ind.name} className={`flex items-center gap-4 p-3 rounded-xl border ${isUserSector ? "bg-indigo-50 border-indigo-200" : "bg-gray-50 border-gray-100"}`}>
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${ind.rank === 1 ? "bg-amber-400 text-white" : ind.rank === 2 ? "bg-gray-400 text-white" : ind.rank === 3 ? "bg-amber-700 text-white" : "bg-gray-200 text-gray-600"}`}>
                            {ind.rank}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-900">{ind.name}</p>
                              {isUserSector && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Seu setor</span>}
                            </div>
                            <p className="text-xs text-gray-500">{ind.description}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-gray-900">{ind.avg}</p>
                            <p className="text-xs text-gray-400">média</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-emerald-600">{ind.top10}</p>
                            <p className="text-xs text-gray-400">top 10%</p>
                          </div>
                          <div className="w-24">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(ind.avg / 5) * 100}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {currentScore > 0 && (
                    <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-indigo-800">
                          <strong>Sua posição:</strong> Com score de <strong>{currentScore}</strong>, você está{" "}
                          {currentScore >= userBenchmark.top10 ? "no <strong>Top 10%</strong> do setor " + userIndustry :
                           currentScore >= userBenchmark.top25 ? "no <strong>Top 25%</strong> do setor " + userIndustry :
                           currentScore >= userBenchmark.avg ? "<strong>acima da média</strong> do setor " + userIndustry :
                           "<strong>abaixo da média</strong> do setor " + userIndustry}.
                          {currentScore < userBenchmark.top10 && ` Você precisa de +${(userBenchmark.top10 - currentScore).toFixed(1)} pontos para atingir o Top 10%.`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Silver: teaser do ranking multi-setor */
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="h-5 w-5 text-amber-500" />
                    <h3 className="text-sm font-bold text-gray-900">Ranking Multi-Setor</h3>
                    <span className="ml-2 text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">Exclusivo Gold</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Compare sua empresa com <strong>todos os setores</strong> e veja onde o mercado brasileiro
                    está mais avançado em maturidade de dados.
                  </p>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    <p className="text-xs text-amber-800">Disponível apenas no plano Gold</p>
                    <Link href="/planos" className="ml-auto">
                      <button className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1">
                        Upgrade para Gold <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
