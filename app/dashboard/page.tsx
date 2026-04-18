"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/layout/sidebar";
import AuthenticatedLayout from "@/components/auth/AuthenticatedLayout";
import {
  TrendingUp, TrendingDown, Minus, ArrowRight, Target, Zap,
  BarChart3, AlertTriangle, CheckCircle2, Clock, ChevronRight, Activity,
  BookOpen, ExternalLink, Globe, Rss,
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

// ─── RECURSOS CURADOS POR DIMENSÃO ───────────────────────────────────────────
type Resource = {
  title: string;
  description: string;
  url: string;
  source: string;
  type: "artigo" | "notícia" | "guia" | "site";
  dimension: string;
  row: 1 | 2;
};

const DIMENSION_RESOURCES: Record<string, Resource[]> = {
  "Estratégia & Governança": [
    {
      title: "DAMA-DMBOK: O Guia Definitivo de Gestão de Dados",
      description: "Framework global de referência para governança e estratégia de dados em organizações.",
      url: "https://www.dama.org/cpages/body-of-knowledge",
      source: "DAMA International",
      type: "guia",
      dimension: "Estratégia & Governança",
      row: 1,
    },
    {
      title: "Como criar uma estratégia de dados que gera valor real",
      description: "Artigo prático sobre como alinhar a estratégia de dados aos objetivos de negócio.",
      url: "https://hbr.org/2020/02/how-to-set-up-a-data-architecture-to-support-both-business-and-it-goals",
      source: "Harvard Business Review",
      type: "artigo",
      dimension: "Estratégia & Governança",
      row: 2,
    },
    {
      title: "Data Governance Institute — Recursos e Frameworks",
      description: "Portal com frameworks, templates e melhores práticas de governança de dados.",
      url: "https://datagovernance.com",
      source: "Data Governance Institute",
      type: "site",
      dimension: "Estratégia & Governança",
      row: 2,
    },
  ],
  "Arquitetura & Engenharia": [
    {
      title: "Modern Data Stack: O que é e como implementar",
      description: "Guia completo sobre as ferramentas e arquiteturas modernas para engenharia de dados.",
      url: "https://www.moderndatastack.xyz",
      source: "Modern Data Stack",
      type: "site",
      dimension: "Arquitetura & Engenharia",
      row: 1,
    },
    {
      title: "Data Mesh vs Data Lakehouse: qual escolher?",
      description: "Comparativo aprofundado entre as principais arquiteturas de dados modernas.",
      url: "https://www.databricks.com/blog/2020/01/30/what-is-a-data-lakehouse.html",
      source: "Databricks Blog",
      type: "artigo",
      dimension: "Arquitetura & Engenharia",
      row: 1,
    },
    {
      title: "dbt: Transformação de dados com qualidade e rastreabilidade",
      description: "Como usar dbt para criar pipelines de dados confiáveis e documentados.",
      url: "https://docs.getdbt.com/docs/introduction",
      source: "dbt Labs",
      type: "guia",
      dimension: "Arquitetura & Engenharia",
      row: 2,
    },
  ],
  "Gestão de Dados": [
    {
      title: "Data Catalog: Por que toda empresa precisa de um",
      description: "Como implementar um catálogo de dados para melhorar a descoberta e governança.",
      url: "https://www.alation.com/blog/what-is-a-data-catalog/",
      source: "Alation Blog",
      type: "artigo",
      dimension: "Gestão de Dados",
      row: 1,
    },
    {
      title: "Master Data Management: Guia Prático",
      description: "Estratégias para implementar MDM e garantir consistência de dados mestres.",
      url: "https://www.informatica.com/resources/articles/what-is-master-data-management.html",
      source: "Informatica",
      type: "guia",
      dimension: "Gestão de Dados",
      row: 1,
    },
    {
      title: "LGPD e Gestão de Dados: O que muda na prática",
      description: "Impactos da Lei Geral de Proteção de Dados na gestão e governança de dados.",
      url: "https://www.gov.br/anpd/pt-br",
      source: "ANPD Brasil",
      type: "site",
      dimension: "Gestão de Dados",
      row: 2,
    },
  ],
  "Qualidade de Dados": [
    {
      title: "The Data Quality Manifesto: 6 dimensões essenciais",
      description: "Framework para avaliar e melhorar a qualidade dos dados em sua organização.",
      url: "https://www.ibm.com/topics/data-quality",
      source: "IBM Think",
      type: "artigo",
      dimension: "Qualidade de Dados",
      row: 1,
    },
    {
      title: "Great Expectations: Validação de dados em pipelines",
      description: "Ferramenta open source para testes e validação automática de qualidade de dados.",
      url: "https://greatexpectations.io",
      source: "Great Expectations",
      type: "site",
      dimension: "Qualidade de Dados",
      row: 1,
    },
    {
      title: "Data Observability: O próximo nível da qualidade",
      description: "Como monitorar a saúde dos dados em tempo real com observabilidade end-to-end.",
      url: "https://www.montecarlodata.com/blog-what-is-data-observability/",
      source: "Monte Carlo Data",
      type: "artigo",
      dimension: "Qualidade de Dados",
      row: 2,
    },
  ],
  "Analytics & Valor": [
    {
      title: "Gartner: Tendências em Analytics e BI para 2025",
      description: "As principais tendências em analytics, BI e inteligência de negócios segundo o Gartner.",
      url: "https://www.gartner.com/en/data-analytics",
      source: "Gartner",
      type: "site",
      dimension: "Analytics & Valor",
      row: 1,
    },
    {
      title: "Como construir uma cultura data-driven de verdade",
      description: "Guia prático para transformar dados em decisões de negócio com impacto mensurável.",
      url: "https://hbr.org/2020/02/how-to-actually-be-a-data-driven-company",
      source: "Harvard Business Review",
      type: "artigo",
      dimension: "Analytics & Valor",
      row: 1,
    },
    {
      title: "Metabase: BI open source para equipes ágeis",
      description: "Ferramenta de BI acessível para criar dashboards e relatórios sem código.",
      url: "https://www.metabase.com",
      source: "Metabase",
      type: "site",
      dimension: "Analytics & Valor",
      row: 2,
    },
  ],
  "Cultura & Literacy": [
    {
      title: "Data Literacy: Como desenvolver competências em dados",
      description: "Framework para desenvolver letramento em dados em todos os níveis da organização.",
      url: "https://www.datacamp.com/blog/what-is-data-literacy",
      source: "DataCamp Blog",
      type: "artigo",
      dimension: "Cultura & Literacy",
      row: 1,
    },
    {
      title: "Storytelling com Dados — Cole Nussbaumer Knaflic",
      description: "O livro referência para comunicar dados de forma clara e persuasiva para executivos.",
      url: "https://www.storytellingwithdata.com",
      source: "Storytelling with Data",
      type: "site",
      dimension: "Cultura & Literacy",
      row: 1,
    },
    {
      title: "Como criar um programa de Data Champions",
      description: "Guia passo a passo para identificar e capacitar embaixadores de dados nas áreas de negócio.",
      url: "https://www.thoughtspot.com/data-trends/data-literacy/data-champion",
      source: "ThoughtSpot",
      type: "guia",
      dimension: "Cultura & Literacy",
      row: 2,
    },
  ],
  "IA & Advanced Analytics": [
    {
      title: "MIT Sloan: IA Generativa nas Empresas em 2025",
      description: "Pesquisa sobre como líderes estão implementando GenAI com governança e ROI mensurável.",
      url: "https://sloanreview.mit.edu/topic/artificial-intelligence/",
      source: "MIT Sloan Review",
      type: "artigo",
      dimension: "IA & Advanced Analytics",
      row: 1,
    },
    {
      title: "MLOps: Levando modelos de ML para produção",
      description: "Guia prático de MLOps para escalar modelos de machine learning com qualidade.",
      url: "https://ml-ops.org",
      source: "ml-ops.org",
      type: "guia",
      dimension: "IA & Advanced Analytics",
      row: 1,
    },
    {
      title: "Hugging Face: Plataforma de modelos de IA open source",
      description: "Repositório com milhares de modelos de IA prontos para uso em projetos corporativos.",
      url: "https://huggingface.co",
      source: "Hugging Face",
      type: "site",
      dimension: "IA & Advanced Analytics",
      row: 2,
    },
  ],
};

function getRecommendedResources(
  topDimensions: Array<{ name: string; score: number }>,
  secondRow = false
): Resource[] {
  const row = secondRow ? (2 as const) : (1 as const);
  const resources: Resource[] = [];
  for (const dim of topDimensions) {
    const dimResources = DIMENSION_RESOURCES[dim.name] || [];
    const rowResources = dimResources.filter((r) => r.row === row);
    if (rowResources.length > 0) {
      resources.push(rowResources[0]);
    }
    if (resources.length >= 3) break;
  }
  // Completar com recursos de outras dimensões se necessário
  if (resources.length < 3) {
    for (const [, dimResources] of Object.entries(DIMENSION_RESOURCES)) {
      for (const r of dimResources) {
        if (r.row === row && !resources.find((x) => x.title === r.title)) {
          resources.push(r);
          if (resources.length >= 3) break;
        }
      }
      if (resources.length >= 3) break;
    }
  }
  return resources.slice(0, 3);
}

// ──────────────────────────────────────────────────────────────────────────────

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
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setCheckoutStatus(params.get("checkout"));
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const load = async () => {
      try {
        // Limpar sessão inválida antes de tentar carregar
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
          await supabase.auth.signOut();
          router.push("/auth/login");
          return;
        }
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
          await supabase.auth.signOut();
          router.push("/auth/login");
          return;
        }
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
      } catch (err) {
        console.error("Dashboard load error:", err);
        router.push("/auth/login");
      }
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
    <AuthenticatedLayout>
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user || undefined} activePage="home" />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* BANNER SUCESSO CHECKOUT */}
          {checkoutStatus === "success" && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-800">Pagamento confirmado! Seu plano foi ativado.</p>
                <p className="text-sm text-emerald-700 mt-0.5">Caso o plano não apareça atualizado, recarregue a página em alguns segundos.</p>
              </div>
            </div>
          )}
          {checkoutStatus === "cancelled" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800">Pagamento cancelado.</p>
                <p className="text-sm text-amber-700 mt-0.5">Nenhuma cobrança foi realizada. <a href="/planos" className="underline">Ver planos</a>.</p>
              </div>
            </div>
          )}
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

          {/* LEITURAS & RECURSOS RECOMENDADOS */}
          {lastAssessment && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-base font-bold text-gray-900">Leituras & Recursos Recomendados</h2>
                </div>
                <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg">
                  Curado para suas áreas críticas
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {getRecommendedResources(sortedDimensions.slice(0, 3)).map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-3 p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all bg-gray-50 hover:bg-indigo-50/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        resource.type === "artigo" ? "bg-blue-100 text-blue-700" :
                        resource.type === "notícia" ? "bg-emerald-100 text-emerald-700" :
                        resource.type === "guia" ? "bg-purple-100 text-purple-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {resource.type === "artigo" ? "📄 Artigo" :
                         resource.type === "notícia" ? "📰 Notícia" :
                         resource.type === "guia" ? "📘 Guia" : "🌐 Site"}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-gray-300 group-hover:text-indigo-400 transition-colors flex-shrink-0 mt-0.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-2 leading-snug">
                        {resource.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{resource.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-auto">
                      <Globe className="h-3 w-3 text-gray-300" />
                      <span className="text-xs text-gray-400">{resource.source}</span>
                      <span className="ml-auto text-xs text-indigo-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        {resource.dimension}
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              {/* Segunda linha de recursos */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                {getRecommendedResources(sortedDimensions.slice(0, 3), true).map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      resource.type === "artigo" ? "bg-blue-100" :
                      resource.type === "notícia" ? "bg-emerald-100" :
                      resource.type === "guia" ? "bg-purple-100" : "bg-amber-100"
                    }`}>
                      <span className="text-sm">
                        {resource.type === "artigo" ? "📄" :
                         resource.type === "notícia" ? "📰" :
                         resource.type === "guia" ? "📘" : "🌐"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors truncate">{resource.title}</p>
                      <p className="text-xs text-gray-400 truncate">{resource.source}</p>
                    </div>
                    <ExternalLink className="h-3 w-3 text-gray-300 group-hover:text-indigo-400 flex-shrink-0" />
                  </a>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Rss className="h-3 w-3" /> Recursos atualizados mensalmente pela equipe DataMaturity
                </p>
                <Link href="/biblioteca">
                  <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                    Ver Biblioteca Completa <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
    </AuthenticatedLayout>
  );
}
