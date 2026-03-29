"use client";
import { Sidebar } from "@/components/layout/sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Lock, Download, BookOpen, Shield, Users, BarChart2, Star, Wrench } from "lucide-react";
import Link from "next/link";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  plan: string;
};

type ContentItem = {
  id: string;
  title: string;
  description: string;
  category: "executivo" | "governanca" | "cultura" | "analytics" | "talentos" | "toolkit";
  required_plan: "bronze" | "silver" | "gold";
  content_url: string;
  nivel: "Estratégico" | "Operacional";
};

const LIBRARY_CONTENT: ContentItem[] = [
  // EXECUTIVO
  {
    id: "21",
    title: "Governança de Dados",
    description: "Estratégia, políticas e estrutura de governança para gerenciar dados como ativo corporativo.",
    category: "executivo",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Governanca-Dados.pdf",
    nivel: "Estratégico",
  },
  {
    id: "22",
    title: "Letramento Executivo em IA e Dados",
    description: "O que todo líder precisa saber para guiar a organização na era dos dados.",
    category: "executivo",
    required_plan: "silver",
    content_url: "/biblioteca/DataMaturity-Letramento-Executivo.pdf",
    nivel: "Estratégico",
  },
  {
    id: "23",
    title: "Transformação e Cultura Data-Driven",
    description: "Como engajar a organização, implementar letramento e gerenciar mudanças organizacionais.",
    category: "executivo",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Transformacao-Cultura.pdf",
    nivel: "Estratégico",
  },
  {
    id: "24",
    title: "Casos de Insucesso e Aprendizados",
    description: "Por que projetos de dados falham e como líderes podem evitar armadilhas comuns.",
    category: "executivo",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Casos-Insucesso-Aprendizados.pdf",
    nivel: "Estratégico",
  },
  {
    id: "25",
    title: "Analytics e Insights",
    description: "Da análise descritiva ao preditivo: como gerar valor real com dados para o negócio.",
    category: "executivo",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Analytics-Insights.pdf",
    nivel: "Estratégico",
  },
  {
    id: "26",
    title: "O Futuro da Democratização de Dados",
    description: "Como Analytics Aumentada e GenAI eliminam o gargalo entre perguntas de negócio e respostas de dados.",
    category: "executivo",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Analytics-Aumentada.pdf",
    nivel: "Estratégico",
  },
  {
    id: "27",
    title: "Talentos e Papéis em Dados",
    description: "Papéis, responsabilidades, hard/soft skills e fluxos de entrada e saída para estruturar times de dados de alta performance.",
    category: "executivo",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Talentos-Papeis.pdf",
    nivel: "Estratégico",
  },

  // GOVERNANÇA
  {
    id: "1",
    title: "Governança de Dados",
    description: "Estratégia, políticas e estrutura de governança para gerenciar dados como ativo corporativo.",
    category: "governanca",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Governanca-Dados.pdf",
    nivel: "Estratégico",
  },
  {
    id: "2",
    title: "Ciclo de Vida de Soluções de Dados & IA",
    description: "Do protótipo à produção: como escalar valor de forma estruturada.",
    category: "governanca",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Ciclo-Vida-Solucoes.pdf",
    nivel: "Operacional",
  },
  {
    id: "3",
    title: "Política de Inteligência Artificial",
    description: "Diretrizes éticas, seguras e responsáveis para o uso de IA na empresa.",
    category: "governanca",
    required_plan: "silver",
    content_url: "/biblioteca/DataMaturity-Politica-IA.pdf",
    nivel: "Estratégico",
  },
  {
    id: "4",
    title: "Templates Práticos de Governança",
    description: "Dicionário de Dados, Matriz RACI, Avaliação de Qualidade.",
    category: "governanca",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Templates-Governanca.pdf",
    nivel: "Operacional",
  },

  // CULTURA
  {
    id: "5",
    title: "Transformação e Cultura Data-Driven",
    description: "Como engajar a organização, implementar letramento e gerenciar mudanças organizacionais.",
    category: "cultura",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Transformacao-Cultura.pdf",
    nivel: "Estratégico",
  },
  {
    id: "6",
    title: "Playbook de Change Management",
    description: "Como garantir a adoção de produtos e soluções de dados.",
    category: "cultura",
    required_plan: "silver",
    content_url: "/biblioteca/DataMaturity-Playbook-ChangeManagement.pdf",
    nivel: "Operacional",
  },
  {
    id: "7",
    title: "Letramento Executivo em IA e Dados",
    description: "O que todo líder precisa saber para guiar a organização.",
    category: "cultura",
    required_plan: "silver",
    content_url: "/biblioteca/DataMaturity-Letramento-Executivo.pdf",
    nivel: "Estratégico",
  },
  {
    id: "8",
    title: "Workshop de Estratégia e Valor",
    description: "Como facilitar sessões de ideação e priorização de casos de uso.",
    category: "cultura",
    required_plan: "silver",
    content_url: "/biblioteca/DataMaturity-Workshop-Estrategia-Valor.pdf",
    nivel: "Operacional",
  },
  {
    id: "9",
    title: "Casos de Insucesso e Aprendizados",
    description: "Por que projetos de dados falham e como evitar armadilhas comuns.",
    category: "cultura",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Casos-Insucesso-Aprendizados.pdf",
    nivel: "Estratégico",
  },
  {
    id: "10",
    title: "Como Estruturar um Hackathon de Dados",
    description: "Guia prático para acelerar inovação e engajar equipes.",
    category: "cultura",
    required_plan: "silver",
    content_url: "/biblioteca/DataMaturity-Como-Estruturar-Hackathon.pdf",
    nivel: "Operacional",
  },

  // ANALYTICS
  {
    id: "11",
    title: "Analytics e Insights",
    description: "Da análise descritiva ao preditivo: como gerar valor real com dados.",
    category: "analytics",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Analytics-Insights.pdf",
    nivel: "Estratégico",
  },
  {
    id: "12",
    title: "Data Storytelling",
    description: "Como comunicar insights e influenciar decisões com dados.",
    category: "analytics",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Data-Storytelling.pdf",
    nivel: "Operacional",
  },
  {
    id: "13",
    title: "Métricas e KPIs",
    description: "Conceitos, fórmulas e como medir o que realmente importa.",
    category: "analytics",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Metricas-KPIs.pdf",
    nivel: "Operacional",
  },
  {
    id: "14",
    title: "O Futuro da Democratização de Dados",
    description: "Como Analytics Aumentada e GenAI eliminam o gargalo entre perguntas de negócio e respostas de dados.",
    category: "analytics",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Analytics-Aumentada.pdf",
    nivel: "Estratégico",
  },
  {
    id: "15",
    title: "Guia Rápido de Métricas de Negócios",
    description: "Referência rápida de fórmulas e KPIs essenciais.",
    category: "analytics",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Guia-Rapido-Metricas.pdf",
    nivel: "Operacional",
  },

  // TALENTOS
  {
    id: "16",
    title: "Talentos e Papéis em Dados",
    description: "Papéis, responsabilidades, hard/soft skills e fluxos de entrada e saída para estruturar times de dados de alta performance.",
    category: "talentos",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Talentos-Papeis.pdf",
    nivel: "Estratégico",
  },
  {
    id: "17",
    title: "Guia de Papéis em Dados",
    description: "Job Descriptions detalhadas para CDO, Engenheiro, Cientista e Analista de Dados.",
    category: "talentos",
    required_plan: "silver",
    content_url: "/biblioteca/DataMaturity-Guia-Papeis-Dados.pdf",
    nivel: "Operacional",
  },

  // TOOLKIT
  {
    id: "18",
    title: "Toolkit Prático",
    description: "Ferramentas, templates e guias para acelerar projetos de dados.",
    category: "toolkit",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Toolkit-Pratico.pdf",
    nivel: "Estratégico",
  },
  {
    id: "19",
    title: "Guia de Entrevista com Process Owners",
    description: "Como mapear fluxos de dados e identificar dores de negócio.",
    category: "toolkit",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Guia-Entrevista-Processos.pdf",
    nivel: "Operacional",
  },
  {
    id: "20",
    title: "Ficha de Hipótese (Template)",
    description: "Estruturando projetos de analytics antes da primeira linha de código.",
    category: "toolkit",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Ficha-Hipotese-Template.pdf",
    nivel: "Operacional",
  },
];

const CATEGORY_CONFIG = {
  executivo: {
    label: "Executivo",
    icon: Star,
    color: "bg-indigo-50 border-indigo-200",
    iconColor: "text-indigo-600",
    badgeColor: "bg-indigo-100 text-indigo-800",
    activeColor: "bg-indigo-600 text-white border-indigo-600",
  },
  governanca: {
    label: "Governança",
    icon: Shield,
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    badgeColor: "bg-blue-100 text-blue-800",
    activeColor: "bg-blue-600 text-white border-blue-600",
  },
  cultura: {
    label: "Cultura",
    icon: Users,
    color: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-600",
    badgeColor: "bg-purple-100 text-purple-800",
    activeColor: "bg-purple-600 text-white border-purple-600",
  },
  analytics: {
    label: "Analytics",
    icon: BarChart2,
    color: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-600",
    badgeColor: "bg-emerald-100 text-emerald-800",
    activeColor: "bg-emerald-600 text-white border-emerald-600",
  },
  talentos: {
    label: "Talentos",
    icon: Star,
    color: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
    badgeColor: "bg-amber-100 text-amber-800",
    activeColor: "bg-amber-500 text-white border-amber-500",
  },
  toolkit: {
    label: "Toolkit",
    icon: Wrench,
    color: "bg-orange-50 border-orange-200",
    iconColor: "text-orange-600",
    badgeColor: "bg-orange-100 text-orange-800",
    activeColor: "bg-orange-500 text-white border-orange-500",
  },
};

const PLAN_ORDER = { bronze: 1, silver: 2, gold: 3 };

export default function BibliotecaPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof CATEGORY_CONFIG | null>("executivo");

  useEffect(() => {
    const supabase = createClient();
    const load = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.push("/login");
        return;
      }
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();
      if (userData) setUser(userData as UserProfile);
      setIsLoading(false);
    };
    load();
  }, [router]);

  const canAccess = (requiredPlan: "bronze" | "silver" | "gold") => {
    if (!user) return false;
    const userLevel = PLAN_ORDER[user.plan as keyof typeof PLAN_ORDER] ?? 0;
    const required = PLAN_ORDER[requiredPlan];
    return userLevel >= required;
  };

  const filteredContent = selectedCategory
    ? LIBRARY_CONTENT.filter((item) => item.category === selectedCategory)
    : LIBRARY_CONTENT;

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

  const userPlanLevel = PLAN_ORDER[user?.plan as keyof typeof PLAN_ORDER] ?? 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user || undefined} activePage="biblioteca" />

      <main className="flex-1 ml-64 p-10">
        <div className="max-w-5xl">

          {/* HEADER */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-4 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Biblioteca de Conteúdo</h1>
                <p className="text-gray-500 mt-2">
                  Acesse documentos e guias para acelerar sua transformação em dados
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700">
                  <BookOpen className="h-3.5 w-3.5" />
                  {LIBRARY_CONTENT.length} documentos
                </span>
              </div>
            </div>
          </div>

          {/* PLANO ATUAL */}
          {user && (
            <div className={`mb-6 p-4 rounded-xl border-2 flex items-center justify-between ${
              user.plan === "gold"
                ? "bg-amber-50 border-amber-300"
                : user.plan === "silver"
                ? "bg-gray-50 border-gray-300"
                : "bg-orange-50 border-orange-300"
            }`}>
              <div>
                <span className="text-sm font-medium text-gray-600">Seu plano atual:</span>
                <span className={`ml-2 font-bold text-lg capitalize ${
                  user.plan === "gold" ? "text-amber-600" :
                  user.plan === "silver" ? "text-gray-600" : "text-orange-600"
                }`}>
                  {user.plan === "gold" ? "🥇 Gold" : user.plan === "silver" ? "🥈 Silver" : "🥉 Bronze"}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {user.plan === "gold"
                  ? "✅ Acesso completo a todos os documentos"
                  : user.plan === "silver"
                  ? "Acesso a documentos Bronze e Silver"
                  : "Acesso apenas a documentos Bronze"}
              </span>
            </div>
          )}

          {/* FILTROS POR CATEGORIA */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border ${
                selectedCategory === null
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Todos ({LIBRARY_CONTENT.length})
            </button>
            {(Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>).map((cat) => {
              const cfg = CATEGORY_CONFIG[cat];
              const Icon = cfg.icon;
              const count = LIBRARY_CONTENT.filter((i) => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border flex items-center gap-2 ${
                    selectedCategory === cat
                      ? cfg.activeColor + " shadow-md"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cfg.label} ({count})
                </button>
              );
            })}
          </div>

          {/* GRID DE DOCUMENTOS */}
          <div className="space-y-3">
            {filteredContent.map((item) => {
              const cfg = CATEGORY_CONFIG[item.category];
              const Icon = cfg.icon;
              const accessible = canAccess(item.required_plan);

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border-2 p-5 transition-all ${
                    accessible
                      ? "bg-white border-gray-100 hover:border-indigo-200 hover:shadow-md"
                      : "bg-gray-50 border-gray-100 opacity-75"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* ÍCONE + INFO */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`p-2.5 rounded-xl border-2 flex-shrink-0 ${cfg.color}`}>
                        <Icon className={`h-5 w-5 ${cfg.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className={`text-base font-bold ${accessible ? "text-gray-900" : "text-gray-500"}`}>
                            {item.title}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badgeColor}`}>
                            {cfg.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.nivel === "Estratégico"
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {item.nivel}
                          </span>
                        </div>
                        <p className={`text-sm ${accessible ? "text-gray-600" : "text-gray-400"}`}>
                          {item.description}
                        </p>
                        <div className="mt-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            item.required_plan === "gold"
                              ? "bg-amber-100 text-amber-700"
                              : item.required_plan === "silver"
                              ? "bg-gray-200 text-gray-600"
                              : "bg-orange-100 text-orange-700"
                          }`}>
                            {item.required_plan === "gold" ? "🥇" : item.required_plan === "silver" ? "🥈" : "🥉"}
                            Plano {item.required_plan.charAt(0).toUpperCase() + item.required_plan.slice(1)}+
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* BOTÃO DE AÇÃO */}
                    <div className="flex-shrink-0">
                      {accessible ? (
                        <a
                          href={item.content_url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
                        >
                          <Download className="h-4 w-4" />
                          Baixar PDF
                        </a>
                      ) : (
                        <Link href="/planos">
                          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-500 text-sm font-semibold rounded-xl hover:bg-gray-300 transition-all cursor-pointer">
                            <Lock className="h-4 w-4" />
                            Upgrade
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA UPGRADE */}
          {userPlanLevel < 3 && (
            <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
              <h2 className="text-2xl font-bold mb-2">🚀 Desbloqueie todo o conteúdo</h2>
              <p className="mb-6 text-indigo-100 text-sm">
                Com o plano Gold, você tem acesso irrestrito a todos os 20 documentos da biblioteca,
                incluindo guias avançados de Analytics, IA Generativa e Casos de Insucesso.
              </p>
              <Link href="/planos">
                <button className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all shadow-md">
                  Fazer Upgrade para Gold →
                </button>
              </Link>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
