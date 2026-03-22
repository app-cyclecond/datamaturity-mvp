"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type User = {
  email: string;
  user_metadata?: {
    name?: string;
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [hasAssessments, setHasAssessments] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user as any);

      const { data: results } = await supabase
        .from("assessment_results")
        .select("*");

      if (results && results.length > 0) {
        setHasAssessments(true);
      }

      setIsLoading(false);
    };

    load();
  }, []);

  const name = user?.user_metadata?.name || "Usuário";

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
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="p-6 font-bold text-lg text-gray-900">DataMaturity</div>

          <nav className="space-y-2 px-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full text-left block p-3 rounded-lg bg-gray-100 font-medium text-gray-900 hover:bg-gray-200 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push("/assessment")}
              className="w-full text-left block p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Novo diagnóstico
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full text-left block p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Histórico
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full text-left block p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Configurações
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 text-sm">
          <div className="font-medium text-gray-900">{name}</div>
          <div className="text-gray-500">{user?.email}</div>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-10">
        {!hasAssessments ? (
          <div className="max-w-3xl mx-auto text-center mt-20">
            {/* HEADER */}
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Olá, {name}
            </h1>
            <p className="text-lg text-gray-600 mb-12">
              Veja como sua empresa está em Dados & AI
            </p>

            {/* CARD PRINCIPAL */}
            <div className="bg-white border border-gray-200 rounded-2xl p-12 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Descubra em 20 minutos onde sua organização está — e receba um relatório pronto para apresentar ao board.
              </h2>

              <Button
                onClick={() => router.push("/assessment")}
                className="mt-6 px-8 py-6 text-lg bg-brand-primary text-white hover:opacity-90 transition-all"
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
            {/* HEADER COM BOTÃO */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard
              </h1>

              <Button
                onClick={() => router.push("/assessment")}
                className="bg-brand-primary text-white hover:opacity-90 transition-all px-6 py-3"
              >
                Novo diagnóstico
              </Button>
            </div>

            {/* CONTEÚDO EXISTENTE */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <p className="text-gray-600">
                Conteúdo do dashboard com histórico de assessments...
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}