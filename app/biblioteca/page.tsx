"use client";
import { Sidebar } from "@/components/layout/sidebar";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, Download, BookOpen, Shield, Users } from "lucide-react";
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
  pillar: "técnico" | "regulatório" | "cultura";
  required_plan: "bronze" | "silver" | "gold";
  content_url?: string;
};

const SAMPLE_CONTENT: ContentItem[] = [
  // GOVERNANÇA
  {
    id: "1",
    title: "Governança de Dados",
    description: "Estratégia, políticas e estrutura de governança para gerenciar dados como ativo corporativo.",
    pillar: "técnico",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Governanca-Dados.pdf",
  },
  {
    id: "2",
    title: "Ciclo de Vida de Soluções de Dados & IA",
    description: "Do protótipo à produção: como escalar valor de forma estruturada.",
    pillar: "técnico",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Ciclo-Vida-Solucoes.pdf",
  },
  {
    id: "3",
    title: "Política de Inteligência Artificial",
    description: "Diretrizes éticas, seguras e responsáveis para o uso de IA na empresa.",
    pillar: "regulatório",
    required_plan: "silver",
    content_url: "/biblioteca/DataMaturity-Politica-IA.pdf",
  },
  {
    id: "4",
    title: "Templates Práticos de Governança",
    description: "Dicionário de Dados, Matriz RACI, Avaliação de Qualidade.",
    pillar: "técnico",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Templates-Governanca.pdf",
  },

  // CULTURA
  {
    id: "5",
    title: "Transformação e Cultura Data-Driven",
    description: "Como engajar a organização, implementar letramento e gerenciar mudanças organizacionais.",
    pillar: "cultura",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Transformacao-Cultura.pdf",
  },
  {
    id: "6",
    title: "Playbook de Change Management",
    description: "Como garantir a adoção de produtos e soluções de dados.",
    pillar: "cultura",
    required_plan: "silver",
    content_url: "/biblioteca/DataMaturity-Playbook-ChangeManagement.pdf",
  },
  {
    id: "7",
    title: "Letramento Executivo em IA e Dados",
    description: "O que todo líder precisa saber para guiar a organização.",
    pillar: "cultura",
    required_plan: "silver",
    content_url: "/biblioteca/DataMaturity-Letramento-Executivo.pdf",
  },
  {
    id: "8",
    title: "Workshop de Estratégia e Valor",
    description: "Como facilitar sessões de ideação e priorização de casos de uso.",
    pillar: "cultura",
    required_plan: "silver",
    content_url: "/biblioteca/DataMaturity-Workshop-Estrategia-Valor.pdf",
  },
  {
    id: "9",
    title: "Casos de Insucesso e Aprendizados",
    description: "Por que projetos de dados falham e como evitar armadilhas comuns.",
    pillar: "cultura",
    required_plan: "gold",
    content_url: "/biblioteca/DataMaturity-Casos-Insucesso-Aprendizados.pdf",
  },
  {
    id: "10",
    title: "Como Estruturar um Hackathon de Dados",
    description: "Guia prático para acelerar inovação e engajar equipes.",
    pillar: "cultura",
    required_plan: "silver",
    content_url: "/biblioteca/DataMaturity-Como-Estruturar-Hackathon.pdf",
  },

  // ANALYTICS
  {
    id: "11",
    title: "Analytics e Insights",
    description: "Da análise descritiva ao preditivo: como gerar valor real com dados.",
    pillar: "técnico",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Analytics-Insights.pdf",
  },
  {
    id: "12",
    title: "Data Storytelling",
    description: "Como comunicar insights e influenciar decisões com dados.",
    pillar: "técnico",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Data-Storytelling.pdf",
  },
  {
    id: "13",
    title: "Métricas e KPIs",
    description: "Conceitos, fórmulas e como medir o que realmente importa.",
    pillar: "técnico",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Metricas-KPIs.pdf",
  },
  {
    id: "14",
    title: "Analytics Aumentada e GenAI",
    description: "O futuro da democratização de dados com IA Generativa.",
    pillar: "técnico",
    required_plan: "gold",
    content_url: "/biblioteca/DataMaturity-Analytics-Aumentada.pdf",
  },
  {
    id: "15",
    title: "Guia Rápido de Métricas de Negócios",
    description: "Referência rápida de fórmulas e KPIs essenciais.",
    pillar: "técnico",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Guia-Rapido-Metricas.pdf",
  },

  // TALENTOS
  {
    id: "16",
    title: "Talentos e Papéis em Dados",
    description: "Estruturação de equipes, papéis críticos e estratégia de retenção de talentos.",
    pillar: "cultura",
    required_plan: "silver",
    content_url: "/biblioteca/DataMaturity-Talentos-Papeis.pdf",
  },
  {
    id: "17",
    title: "Guia de Papéis em Dados",
    description: "Job Descriptions detalhadas para CDO, Engenheiro, Cientista e Analista de Dados.",
    pillar: "cultura",
    required_plan: "silver",
    content_url: "/biblioteca/DataMaturity-Guia-Papeis-Dados.pdf",
  },

  // TOOLKIT
  {
    id: "18",
    title: "Toolkit Prático",
    description: "Ferramentas, templates e guias para acelerar projetos de dados.",
    pillar: "técnico",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Toolkit-Pratico.pdf",
  },
  {
    id: "19",
    title: "Guia de Entrevista com Process Owners",
    description: "Como mapear fluxos de dados e identificar dores de negócio.",
    pillar: "técnico",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Guia-Entrevista-Processos.pdf",
  },
  {
    id: "20",
    title: "Ficha de Hipótese (Template)",
    description: "Estruturando projetos de analytics antes da primeira linha de código.",
    pillar: "técnico",
    required_plan: "bronze",
    content_url: "/biblioteca/DataMaturity-Ficha-Hipotese-Template.pdf",
  },
];

const PILLAR_ICONS = {
  técnico: BookOpen,
  regulatório: Shield,
  cultura: Users,
};

const PILLAR_COLORS = {
  técnico: "bg-blue-50 border-blue-200 text-blue-900",
  regulatório: "bg-red-50 border-red-200 text-red-900",
  cultura: "bg-green-50 border-green-200 text-green-900",
};

export default function BibliotecaPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPillar, setSelectedPillar] = useState<"técnico" | "regulatório" | "cultura" | null>(null);

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

      if (userData) {
        setUser(userData as UserProfile);
      }

      setIsLoading(false);
    };

    load();
  }, [router]);

  const canAccessContent = (requiredPlan: string) => {
    if (!user) return false;
    if (user.plan === "gold") return true;
    if (user.plan === "silver" && requiredPlan !== "gold") return true;
    if (user.plan === "bronze" && requiredPlan === "bronze") return true;
    return false;
  };

  const filteredContent = selectedPillar
    ? SAMPLE_CONTENT.filter((item) => item.pillar === selectedPillar)
    : SAMPLE_CONTENT;

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
      <Sidebar user={user || undefined} activePage="biblioteca" />

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-10">
        <div className="max-w-5xl">
          {/* HEADER */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            <h1 className="text-4xl font-bold text-gray-900">Biblioteca de Conteúdo</h1>
            <p className="text-gray-600 mt-2">
              Acesse documentos e guias para acelerar sua transformação em dados
            </p>
          </div>

          {/* FILTROS POR PILAR */}
          <div className="mb-8 flex gap-3">
            <button
              onClick={() => setSelectedPillar(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPillar === null
                  ? "bg-brand-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Todos
            </button>
            {(["técnico", "regulatório", "cultura"] as const).map((pillar) => {
              const Icon = PILLAR_ICONS[pillar];
              return (
                <button
                  key={pillar}
                  onClick={() => setSelectedPillar(pillar)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    selectedPillar === pillar
                      ? "bg-brand-primary text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {pillar.charAt(0).toUpperCase() + pillar.slice(1)}
                </button>
              );
            })}
          </div>

          {/* CONTEÚDO */}
          <div className="space-y-4">
            {filteredContent.map((content) => {
              const Icon = PILLAR_ICONS[content.pillar];
              const hasAccess = canAccessContent(content.required_plan);
              const colorClass = PILLAR_COLORS[content.pillar];

              return (
                <div
                  key={content.id}
                  className={`border rounded-lg p-6 transition-all ${
                    hasAccess
                      ? "bg-white border-gray-200 hover:shadow-md"
                      : "bg-gray-50 border-gray-200 opacity-75"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg border ${colorClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{content.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-4">{content.description}</p>

                      <div className="flex items-center gap-4">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          Plano {content.required_plan.charAt(0).toUpperCase() + content.required_plan.slice(1)}+
                        </span>

                        {!hasAccess && (
                          <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            Bloqueado
                          </span>
                        )}
                      </div>
                    </div>

                    {hasAccess ? (
                      <a href={content.content_url} download className="ml-4 px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Baixar
                      </a>
                    ) : (
                      <Link href="/planos">
                        <button className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Upgrade
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA PARA UPGRADE */}
          {user?.plan !== "gold" && (
            <div className="mt-12 bg-gradient-to-r from-brand-primary to-purple-600 rounded-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-3">Desbloqueie todo o conteúdo</h2>
              <p className="mb-6 text-purple-100">
                Com o plano Gold, você tem acesso a toda a biblioteca de conteúdo, incluindo
                documentos avançados de técnico, regulatório e cultura.
              </p>
              <Link href="/planos">
                <button className="bg-white text-brand-primary font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-all">
                  Upgrade para Gold →
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
