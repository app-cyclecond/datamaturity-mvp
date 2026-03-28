"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/layout/sidebar";
import {
  TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown,
  Calendar, BarChart3, ChevronRight, Activity, CheckCircle2,
  GitCompare, X,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

// ─── TYPES ───────────────────────────────────────────────────────────────────
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

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const LEVEL_COLORS: Record<string, string> = {
  Inexistente: "bg-red-50 text-red-700 border-red-200",
  Inicial: "bg-orange-50 text-orange-700 border-orange-200",
  Intermediário: "bg-amber-50 text-amber-700 border-amber-200",
  Avançado: "bg-blue-50 text-blue-700 border-blue-200",
  Otimizado: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const SCORE_COLOR = (s: number) =>
  s >= 4 ? "#10b981" : s >= 3 ? "#6366f1" : s >= 2 ? "#f59e0b" : "#ef4444";

const SCORE_LABEL = (s: number) =>
  s >= 4.5 ? "Otimizado" : s >= 3.5 ? "Avançado" : s >= 2.5 ? "Intermediário" : s >= 1.5 ? "Inicial" : "Inexistente";

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

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────
const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const score = payload[0].value;
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 min-w-[150px]">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-2xl font-bold" style={{ color: SCORE_COLOR(score) }}>
          {score}<span className="text-sm font-normal text-gray-400">/5</span>
        </p>
        <span
          className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: SCORE_COLOR(score) + "20", color: SCORE_COLOR(score) }}
        >
          {SCORE_LABEL(score)}
        </span>
      </div>
    );
  }
  return null;
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function HistoricoPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Seleção: até 2 IDs. Primeiro clique = A (mais recente), segundo = B (base)
  const [selectedA, setSelectedA] = useState<string | null>(null);
  const [selectedB, setSelectedB] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const load = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) { router.push("/auth/login"); return; }
      const { data: userData } = await supabase.from("users").select("*").eq("id", authData.user.id).single();
      if (userData) setUser(userData as UserProfile);
      const { data: results } = await supabase
        .from("assessment_results").select("*").eq("user_id", authData.user.id)
        .order("created_at", { ascending: false });
      if (results) {
        setAssessments(results as AssessmentResult[]);
        // Auto-selecionar os dois mais recentes se existirem
        if (results.length >= 2) {
          setSelectedA(results[0].id);
          setSelectedB(results[1].id);
        } else if (results.length === 1) {
          setSelectedA(results[0].id);
        }
      }
      setIsLoading(false);
    };
    load();
  }, [router]);

  const handleSelect = (id: string) => {
    if (selectedA === id) {
      // Deselecionar A: promover B para A
      setSelectedA(selectedB);
      setSelectedB(null);
      return;
    }
    if (selectedB === id) {
      setSelectedB(null);
      return;
    }
    if (!selectedA) { setSelectedA(id); return; }
    if (!selectedB) { setSelectedB(id); return; }
    // Já tem 2 selecionados: substituir o mais antigo
    setSelectedB(id);
  };

  const clearSelection = () => { setSelectedA(null); setSelectedB(null); };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
          <p className="mt-3 text-gray-500 text-sm">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  const assessA = assessments.find((a) => a.id === selectedA) ?? null;
  const assessB = assessments.find((a) => a.id === selectedB) ?? null;

  // Para o comparativo, A = mais recente, B = base de comparação
  const newer = assessA && assessB
    ? (new Date(assessA.created_at) >= new Date(assessB.created_at) ? assessA : assessB)
    : assessA;
  const older = assessA && assessB
    ? (new Date(assessA.created_at) >= new Date(assessB.created_at) ? assessB : assessA)
    : null;

  const chartData = [...assessments].reverse().map((a) => ({
    data: new Date(a.created_at).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    }),
    score: a.overall_score,
    id: a.id,
  }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user || undefined} activePage="historico" />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* HEADER */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Histórico de Diagnósticos</h1>
            <p className="text-gray-500 text-sm mt-0.5">Acompanhe a evolução da maturidade de dados da sua empresa</p>
          </div>

          {/* ESTADO VAZIO */}
          {assessments.length === 0 && (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum diagnóstico realizado ainda</h3>
              <p className="text-gray-500 text-sm mb-6">Faça seu primeiro diagnóstico para ver o histórico aqui.</p>
              <Link href="/assessment">
                <button className="bg-indigo-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all">
                  Iniciar Diagnóstico →
                </button>
              </Link>
            </div>
          )}

          {assessments.length > 0 && (
            <>
              {/* GRÁFICO DE EVOLUÇÃO */}
              {assessments.length > 1 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-base font-bold text-gray-900">Evolução do Score Geral</h3>
                    <span className="ml-auto text-xs text-gray-400">{assessments.length} diagnósticos</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                      <XAxis dataKey="data" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} dy={8} />
                      <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} dx={-4} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#6366f1", strokeWidth: 1, strokeDasharray: "4 4" }} />
                      <ReferenceLine y={3} stroke="#10b981" strokeDasharray="5 5" strokeWidth={1.5}
                        label={{ value: "Meta 3.0", position: "insideTopRight", fontSize: 10, fill: "#10b981", fontWeight: 600 }} />
                      <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5}
                        fill="url(#scoreGrad)"
                        dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 7, fill: "#6366f1", stroke: "#fff", strokeWidth: 2.5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* INSTRUÇÃO DE SELEÇÃO */}
              <div className={`rounded-xl px-4 py-3 flex items-center gap-3 text-sm transition-all ${
                selectedA && selectedB
                  ? "bg-indigo-50 border border-indigo-200 text-indigo-800"
                  : "bg-amber-50 border border-amber-200 text-amber-800"
              }`}>
                <GitCompare className="h-4 w-4 flex-shrink-0" />
                {!selectedA && !selectedB && (
                  <span>Clique em <strong>dois diagnósticos</strong> na lista abaixo para comparar.</span>
                )}
                {selectedA && !selectedB && (
                  <span><strong>1 selecionado.</strong> Clique em outro para comparar.</span>
                )}
                {selectedA && selectedB && (
                  <span><strong>Comparando 2 diagnósticos.</strong> Veja o resultado abaixo.</span>
                )}
                {(selectedA || selectedB) && (
                  <button onClick={clearSelection} className="ml-auto flex items-center gap-1 text-xs font-semibold opacity-70 hover:opacity-100">
                    <X className="h-3.5 w-3.5" /> Limpar
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* TIMELINE */}
                <div className="col-span-1">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sticky top-8">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-indigo-600" /> Timeline
                    </h3>
                    <div className="space-y-2">
                      {assessments.map((assessment, index) => {
                        const isA = selectedA === assessment.id;
                        const isB = selectedB === assessment.id;
                        const isSelected = isA || isB;
                        const label = isA ? "A" : isB ? "B" : null;
                        const prevScore = index < assessments.length - 1 ? assessments[index + 1].overall_score : null;
                        const delta = prevScore !== null ? assessment.overall_score - prevScore : null;

                        return (
                          <button
                            key={assessment.id}
                            onClick={() => handleSelect(assessment.id)}
                            className={`w-full text-left p-3 rounded-xl transition-all border ${
                              isA
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                                : isB
                                ? "bg-purple-100 border-purple-300 text-purple-900"
                                : "bg-gray-50 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-gray-700"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  {label && (
                                    <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                                      isA ? "bg-white text-indigo-600" : "bg-purple-500 text-white"
                                    }`}>
                                      {label}
                                    </span>
                                  )}
                                  <span className={`text-xs font-semibold ${isSelected ? "" : "text-gray-500"}`}>
                                    {new Date(assessment.created_at).toLocaleDateString("pt-BR", {
                                      day: "2-digit", month: "short", year: "numeric",
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 ml-7">
                                  <span className={`text-base font-bold ${isA ? "text-white" : isB ? "text-purple-700" : "text-gray-900"}`}>
                                    {assessment.overall_score}
                                  </span>
                                  <span className={`text-xs ${isA ? "text-indigo-200" : "text-gray-400"}`}>/5</span>
                                  {delta !== null && (
                                    <span className={`text-xs font-semibold flex items-center gap-0.5 ${
                                      delta > 0 ? (isA ? "text-green-300" : "text-emerald-600") :
                                      delta < 0 ? (isA ? "text-red-300" : "text-red-500") :
                                      "text-gray-400"
                                    }`}>
                                      {delta > 0 ? <ArrowUp className="h-3 w-3" /> : delta < 0 ? <ArrowDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                                      {delta > 0 ? "+" : ""}{delta.toFixed(1)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                                  isA ? "bg-white/20 text-white" :
                                  isB ? "bg-purple-200 text-purple-700" :
                                  LEVEL_COLORS[assessment.level] || "bg-gray-100 text-gray-600"
                                }`}>
                                  {assessment.level}
                                </span>
                                <ChevronRight className={`h-3.5 w-3.5 ${isSelected ? "opacity-60" : "text-gray-300"}`} />
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {assessments.length === 1 && (
                      <div className="mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                        <p className="text-xs text-indigo-700 font-medium">💡 Faça um 2º diagnóstico para comparar a evolução</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* PAINEL COMPARATIVO */}
                <div className="col-span-2 space-y-4">
                  {newer && older ? (
                    <>
                      {/* HEADER COMPARATIVO */}
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                          <GitCompare className="h-4 w-4 text-indigo-600" /> Comparativo
                        </h3>
                        <div className="grid grid-cols-3 gap-4 items-center">
                          {/* MAIS ANTIGO (B) */}
                          <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                            <p className="text-xs font-semibold text-purple-600 mb-1">Base (B)</p>
                            <p className="text-4xl font-bold text-purple-700">{older.overall_score}</p>
                            <p className="text-xs text-purple-500 mt-0.5">/5</p>
                            <span className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full border ${LEVEL_COLORS[older.level] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                              {older.level}
                            </span>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(older.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                            </p>
                          </div>

                          {/* VARIAÇÃO */}
                          <div className="text-center">
                            {(() => {
                              const diff = +(newer.overall_score - older.overall_score).toFixed(1);
                              return (
                                <div>
                                  <div className={`text-4xl font-bold ${diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-500" : "text-gray-400"}`}>
                                    {diff > 0 ? "+" : ""}{diff}
                                  </div>
                                  <div className={`flex items-center justify-center gap-1 mt-1 text-sm font-semibold ${diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-500" : "text-gray-400"}`}>
                                    {diff > 0 ? <TrendingUp className="h-4 w-4" /> : diff < 0 ? <TrendingDown className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                                    {diff > 0 ? "Evolução" : diff < 0 ? "Regressão" : "Estável"}
                                  </div>
                                  <p className="text-xs text-gray-400 mt-2">variação no score</p>
                                </div>
                              );
                            })()}
                          </div>

                          {/* MAIS RECENTE (A) */}
                          <div className="text-center p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                            <p className="text-xs font-semibold text-indigo-600 mb-1">Atual (A)</p>
                            <p className="text-4xl font-bold text-indigo-700">{newer.overall_score}</p>
                            <p className="text-xs text-indigo-400 mt-0.5">/5</p>
                            <span className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full border ${LEVEL_COLORS[newer.level] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                              {newer.level}
                            </span>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(newer.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* DIMENSÕES COMPARADAS */}
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Evolução por Dimensão</h3>
                        <div className="space-y-3">
                          {DIMENSIONS.map((dim) => {
                            const scoreA = newer.dimension_scores?.[dim] ?? 0;
                            const scoreB = older.dimension_scores?.[dim] ?? 0;
                            const diff = +(scoreA - scoreB).toFixed(1);
                            return (
                              <div key={dim} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-semibold text-gray-800">
                                    {DIMENSION_ICONS[dim]} {dim}
                                  </span>
                                  <div className={`flex items-center gap-1 text-sm font-bold ${diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-500" : "text-gray-400"}`}>
                                    {diff > 0 ? <ArrowUp className="h-3.5 w-3.5" /> : diff < 0 ? <ArrowDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                                    {diff > 0 ? "+" : ""}{diff}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  {/* Barra B (base) */}
                                  <div className="flex-1">
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="text-purple-500 font-medium">B</span>
                                      <span className="text-purple-600 font-bold">{scoreB}/5</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div className="bg-purple-400 h-1.5 rounded-full" style={{ width: `${(scoreB / 5) * 100}%` }} />
                                    </div>
                                  </div>
                                  {/* Barra A (atual) */}
                                  <div className="flex-1">
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="text-indigo-500 font-medium">A</span>
                                      <span className="text-indigo-600 font-bold">{scoreA}/5</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(scoreA / 5) * 100}%` }} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* INSIGHTS */}
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-5">
                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-indigo-600" /> Insights do Período
                        </h3>
                        <div className="space-y-2">
                          {(() => {
                            const improved = DIMENSIONS.filter((d) => (newer.dimension_scores?.[d] ?? 0) > (older.dimension_scores?.[d] ?? 0));
                            const regressed = DIMENSIONS.filter((d) => (newer.dimension_scores?.[d] ?? 0) < (older.dimension_scores?.[d] ?? 0));
                            const stable = DIMENSIONS.filter((d) => (newer.dimension_scores?.[d] ?? 0) === (older.dimension_scores?.[d] ?? 0));
                            const bestGain = [...DIMENSIONS].sort((a, b) =>
                              ((newer.dimension_scores?.[b] ?? 0) - (older.dimension_scores?.[b] ?? 0)) -
                              ((newer.dimension_scores?.[a] ?? 0) - (older.dimension_scores?.[a] ?? 0))
                            )[0];
                            const bestGainDiff = +(( newer.dimension_scores?.[bestGain] ?? 0) - (older.dimension_scores?.[bestGain] ?? 0)).toFixed(1);
                            return (
                              <>
                                {improved.length > 0 && (
                                  <div className="flex items-start gap-2 text-xs text-gray-700">
                                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                    <span><strong>{improved.length}</strong> dimensão(ões) evoluíram: {improved.map(d => DIMENSION_ICONS[d]).join(" ")}</span>
                                  </div>
                                )}
                                {regressed.length > 0 && (
                                  <div className="flex items-start gap-2 text-xs text-gray-700">
                                    <TrendingDown className="h-3.5 w-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>{regressed.length}</strong> dimensão(ões) regrediram: {regressed.map(d => DIMENSION_ICONS[d]).join(" ")}</span>
                                  </div>
                                )}
                                {stable.length > 0 && (
                                  <div className="flex items-start gap-2 text-xs text-gray-700">
                                    <Minus className="h-3.5 w-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                                    <span><strong>{stable.length}</strong> dimensão(ões) estáveis</span>
                                  </div>
                                )}
                                {bestGainDiff > 0 && (
                                  <div className="flex items-start gap-2 text-xs text-gray-700">
                                    <BarChart3 className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                                    <span>Maior evolução: <strong>{DIMENSION_ICONS[bestGain]} {bestGain}</strong> (+{bestGainDiff})</span>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </>
                  ) : newer && !older ? (
                    /* Apenas 1 selecionado — mostrar detalhes */
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                          {newer.overall_score}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{newer.level}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(newer.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                          </p>
                        </div>
                        <span className="ml-auto text-xs text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded-lg font-medium">
                          Selecionado (A)
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {DIMENSIONS.map((dim) => {
                          const score = newer.dimension_scores?.[dim] ?? 0;
                          const pct = (score / 5) * 100;
                          const color = score >= 4 ? "bg-emerald-500" : score >= 3 ? "bg-blue-500" : score >= 2 ? "bg-amber-500" : "bg-red-500";
                          return (
                            <div key={dim} className="flex items-center gap-3">
                              <span className="text-base w-6 flex-shrink-0">{DIMENSION_ICONS[dim]}</span>
                              <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-700 font-medium">{dim}</span>
                                  <span className="font-bold text-gray-900">{score}/5</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                  <div className={`${color} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-5 p-3 bg-amber-50 rounded-xl border border-amber-200">
                        <p className="text-xs text-amber-800 font-medium">
                          👆 Selecione um segundo diagnóstico na timeline para ver a comparação
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Nenhum selecionado */
                    <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                      <GitCompare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-base font-semibold text-gray-700 mb-2">Selecione diagnósticos para comparar</h3>
                      <p className="text-gray-400 text-sm">
                        Clique em um ou dois itens na timeline à esquerda para ver os detalhes e a comparação.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
