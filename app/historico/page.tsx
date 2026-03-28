"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import {
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Calendar,
  TrendingUp,
  BarChart3,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const score = payload[0].value as number;
    const getColor = (s: number) => s >= 4 ? "#10b981" : s >= 3 ? "#6366f1" : s >= 2 ? "#f59e0b" : "#ef4444";
    const getLabel = (s: number) => s >= 4.5 ? "Otimizado" : s >= 3.5 ? "Avançado" : s >= 2.5 ? "Intermediário" : s >= 1.5 ? "Inicial" : "Inexistente";
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 min-w-[140px]">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-bold" style={{ color: getColor(score) }}>{score}<span className="text-sm font-normal text-gray-400">/5</span></p>
        <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: getColor(score) + "20", color: getColor(score) }}>{getLabel(score)}</span>
      </div>
    );
  }
  return null;
};

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

export default function HistoricoPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [selectedIds, setSelectedIds] = useState<[string, string] | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
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
        .order("created_at", { ascending: false });

      if (results) {
        setAssessments(results as AssessmentResult[]);
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

  const getScoreChange = (current: number, previous: number) => {
    const change = current - previous;
    if (change > 0) return { value: `+${change.toFixed(1)}`, color: "text-green-600", icon: ArrowUp };
    if (change < 0) return { value: `${change.toFixed(1)}`, color: "text-red-600", icon: ArrowDown };
    return { value: "0", color: "text-gray-600", icon: null };
  };

  const calculateComparison = (current: AssessmentResult, previous: AssessmentResult) => {
    const scoreChange = getScoreChange(current.overall_score, previous.overall_score);
    
    const dimensionChanges = Object.entries(current.dimension_scores).map(([name, score]) => {
      const prevScore = previous.dimension_scores[name] || 0;
      return {
        name,
        current: score,
        previous: prevScore,
        change: score - prevScore,
      };
    });

    return { scoreChange, dimensionChanges };
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
          <p className="mt-4 text-gray-600">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar user={user || undefined} activePage="historico" />

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-10">
        <div className="space-y-8">
          {/* BOTÃO VOLTAR */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          {/* HEADER */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Histórico de Diagnósticos</h1>
            <p className="text-gray-600 mt-1">Acompanhe a evolução da maturidade de dados da sua empresa</p>
          </div>

          {/* GRÁFICO DE EVOLUÇÃO */}
          {assessments.length > 1 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-900">Evolução do Score Geral</h3>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart
                  data={[...assessments].reverse().map((a) => ({
                    data: new Date(a.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
                    score: a.overall_score,
                  }))}
                  margin={{ top: 10, right: 30, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis
                    dataKey="data"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    dy={8}
                  />
                  <YAxis
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                    dx={-4}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#6366f1", strokeWidth: 1, strokeDasharray: "4 4" }} />
                  <ReferenceLine
                    y={3}
                    stroke="#10b981"
                    strokeDasharray="5 5"
                    strokeWidth={1.5}
                    label={{ value: "Meta 3.0", position: "insideTopRight", fontSize: 11, fill: "#10b981", fontWeight: 600 }}
                  />
                  <Area
                    type="monotoneX"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="url(#scoreGradient)"
                    dot={{ r: 5, fill: "#6366f1", strokeWidth: 2.5, stroke: "#fff" }}
                    activeDot={{ r: 8, fill: "#6366f1", stroke: "#fff", strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {assessments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum diagnóstico realizado</h3>
              <p className="text-gray-600 mb-6">Comece fazendo seu primeiro diagnóstico para ver o histórico aqui.</p>
              <Button
                onClick={() => router.push("/assessment")}
                className="bg-brand-primary text-white hover:opacity-90"
              >
                Iniciar Diagnóstico
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* TIMELINE */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-10">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-2">
                    {assessments.map((assessment, index) => (
                      <button
                        key={assessment.id}
                        onClick={() => {
                          if (index > 0) {
                            setSelectedIds([assessment.id, assessments[index - 1].id]);
                          } else if (assessments.length > 1) {
                            setSelectedIds([assessment.id, assessments[1].id]);
                          }
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedIds?.[0] === assessment.id
                            ? "bg-brand-primary/10 border border-brand-primary text-brand-primary font-medium"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              {new Date(assessment.created_at).toLocaleDateString("pt-BR")}
                            </div>
                            <div className="text-xs opacity-75">
                              Score: {assessment.overall_score}
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* COMPARATIVO */}
              <div className="lg:col-span-2">
                {selectedIds && assessments.length > 1 ? (
                  (() => {
                    const current = assessments.find((a) => a.id === selectedIds[0])!;
                    const previous = assessments.find((a) => a.id === selectedIds[1])!;
                    const comparison = calculateComparison(current, previous);

                    return (
                      <div className="space-y-6">
                        {/* HEADER COMPARATIVO */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                          <div className="grid grid-cols-2 gap-8">
                            {/* ANTERIOR */}
                            <div>
                              <p className="text-gray-600 text-sm font-medium mb-2">Diagnóstico Anterior</p>
                              <div className="text-4xl font-bold text-gray-400 mb-2">{previous.overall_score}</div>
                              <div className={`inline-block px-3 py-1 rounded-lg border text-xs font-semibold ${getLevelColor(previous.level)}`}>
                                {previous.level}
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(previous.created_at).toLocaleDateString("pt-BR")}
                              </p>
                            </div>

                            {/* ATUAL */}
                            <div>
                              <p className="text-gray-600 text-sm font-medium mb-2">Diagnóstico Atual</p>
                              <div className="text-4xl font-bold text-brand-primary mb-2">{current.overall_score}</div>
                              <div className={`inline-block px-3 py-1 rounded-lg border text-xs font-semibold ${getLevelColor(current.level)}`}>
                                {current.level}
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(current.created_at).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </div>

                          {/* MUDANÇA GERAL */}
                          <div className="mt-8 pt-8 border-t border-gray-200">
                            <p className="text-gray-600 text-sm font-medium mb-3">Variação Geral</p>
                            <div className="flex items-center gap-3">
                              <div className={`text-3xl font-bold ${comparison.scoreChange.color}`}>
                                {comparison.scoreChange.value}
                              </div>
                              {comparison.scoreChange.icon && (
                                <comparison.scoreChange.icon className="h-6 w-6" />
                              )}
                              <p className="text-gray-600">
                                {comparison.scoreChange.value === "0"
                                  ? "Sem mudanças"
                                  : comparison.scoreChange.value.startsWith("+")
                                  ? "Melhorou!"
                                  : "Piorou"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* MUDANÇAS POR DIMENSÃO */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                          <h3 className="text-lg font-bold text-gray-900 mb-6">Mudanças por Dimensão</h3>
                          <div className="space-y-4">
                            {comparison.dimensionChanges.map((dim, i) => (
                              <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                                <div>
                                  <p className="font-medium text-gray-900">{dim.name}</p>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className="text-sm text-gray-500">{dim.previous} → {dim.current}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={`text-lg font-bold ${dim.change > 0 ? "text-green-600" : dim.change < 0 ? "text-red-600" : "text-gray-600"}`}>
                                    {dim.change > 0 ? "+" : ""}{dim.change.toFixed(1)}
                                  </div>
                                  {dim.change !== 0 && (
                                    <div className="flex justify-end">
                                      {dim.change > 0 ? (
                                        <ArrowUp className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <ArrowDown className="h-4 w-4 text-red-600" />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* INSIGHTS */}
                        <div className="bg-gradient-to-r from-brand-primary/10 to-purple-500/10 rounded-2xl border border-brand-primary/20 p-8">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">Insights</h3>
                          <ul className="space-y-2 text-gray-700">
                            {comparison.dimensionChanges.filter((d) => d.change > 0).length > 0 && (
                              <li className="flex items-start gap-2">
                                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>
                                  {comparison.dimensionChanges.filter((d) => d.change > 0).length} dimensão(ões) melhorou(aram)
                                </span>
                              </li>
                            )}
                            {comparison.dimensionChanges.filter((d) => d.change < 0).length > 0 && (
                              <li className="flex items-start gap-2">
                                <ArrowDown className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                <span>
                                  {comparison.dimensionChanges.filter((d) => d.change < 0).length} dimensão(ões) regrediu(iram)
                                </span>
                              </li>
                            )}
                            <li className="flex items-start gap-2">
                              <BarChart3 className="h-5 w-5 text-brand-primary mt-0.5 flex-shrink-0" />
                              <span>
                                Score geral {comparison.scoreChange.value === "0" ? "manteve" : "mudou em"} {comparison.scoreChange.value}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecione dois diagnósticos</h3>
                    <p className="text-gray-600">
                      Clique em um diagnóstico na timeline para comparar com o anterior
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
