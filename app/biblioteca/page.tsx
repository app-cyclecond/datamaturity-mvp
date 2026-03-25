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
  // TÉCNICO
  {
    id: "1",
    title: "Guia de Arquitetura de Dados Moderna",
    description: "Estrutura recomendada para implementar uma arquitetura de dados escalável",
    pillar: "técnico",
    required_plan: "bronze",
    content_url: "#",
  },
  {
    id: "2",
    title: "Pipeline de ETL - Melhores Práticas",
    description: "Como construir pipelines robustos e eficientes",
    pillar: "técnico",
    required_plan: "bronze",
    content_url: "#",
  },
  {
    id: "3",
    title: "Implementação de Data Warehouse",
    description: "Passo a passo para implementar um data warehouse empresarial",
    pillar: "técnico",
    required_plan: "silver",
    content_url: "#",
  },
  {
    id: "4",
    title: "Machine Learning em Produção",
    description: "Guia completo para colocar modelos de ML em produção",
    pillar: "técnico",
    required_plan: "gold",
    content_url: "#",
  },

  // REGULATÓRIO
  {
    id: "5",
    title: "Conformidade com LGPD",
    description: "Checklist de conformidade com a Lei Geral de Proteção de Dados",
    pillar: "regulatório",
    required_plan: "silver",
    content_url: "#",
  },
  {
    id: "6",
    title: "Governança de Dados - Regulamentações",
    description: "Frameworks regulatórios para governança de dados",
    pillar: "regulatório",
    required_plan: "silver",
    content_url: "#",
  },
  {
    id: "7",
    title: "Segurança e Compliance Avançado",
    description: "Implementação de segurança em nível enterprise",
    pillar: "regulatório",
    required_plan: "gold",
    content_url: "#",
  },

  // CULTURA
  {
    id: "8",
    title: "Mudança Organizacional para Data-Driven",
    description: "Como transformar a cultura da organização para ser data-driven",
    pillar: "cultura",
    required_plan: "gold",
    content_url: "#",
  },
  {
    id: "9",
    title: "Treinamento de Times em Analytics",
    description: "Programa de capacitação para times de dados",
    pillar: "cultura",
    required_plan: "gold",
    content_url: "#",
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
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between fixed h-screen">
        <div>
          <div className="p-6 font-bold text-lg text-gray-900 flex items-center gap-2">
            <div className="h-8 w-8 bg-brand-primary text-white rounded flex items-center justify-center font-bold">
              DM
            </div>
            DataMaturity
          </div>

          <nav className="space-y-2 px-4">
            <Link href="/dashboard">
              <button className="w-full text-left block p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                Home
              </button>
            </Link>
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
          <div className="font-medium text-gray-900">{user?.name || "Usuário"}</div>
          <div className="text-gray-500 text-xs">{user?.email}</div>
        </div>
      </aside>

      {/* CONTEÚDO */}
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
                      <button className="ml-4 px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Acessar
                      </button>
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
