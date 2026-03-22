"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type User = {
  email: string;
  user_metadata?: {
    name?: string;
  };
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [hasAssessments, setHasAssessments] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user as any);

      // Aqui você pode trocar depois por consulta real
      const { data: results } = await supabase
        .from("assessment_results")
        .select("*");

      if (results && results.length > 0) {
        setHasAssessments(true);
      }
    };

    load();
  }, []);

  const name = user?.user_metadata?.name || "Usuário";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r flex flex-col justify-between">
        <div>
          <div className="p-6 font-bold text-lg">DataMaturity</div>

          <nav className="space-y-2 px-4">
            <a className="block p-2 rounded-lg bg-gray-100 font-medium">Dashboard</a>
            <a className="block p-2 rounded-lg hover:bg-gray-100">Novo diagnóstico</a>
            <a className="block p-2 rounded-lg hover:bg-gray-100">Histórico</a>
            <a className="block p-2 rounded-lg hover:bg-gray-100">Configurações</a>
          </nav>
        </div>

        <div className="p-4 border-t text-sm">
          <div className="font-medium">{name}</div>
          <div className="text-gray-500">{user?.email}</div>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-10">
        {!hasAssessments ? (
          <div className="max-w-3xl mx-auto text-center mt-20">
            {/* HEADER */}
            <h1 className="text-3xl font-semibold mb-2">
              Olá, {name}
            </h1>
            <p className="text-gray-600 mb-10">
              Veja como sua empresa está em Dados & AI
            </p>

            {/* CARD PRINCIPAL */}
            <div className="bg-white border rounded-2xl p-10 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                Descubra em 20 minutos onde sua organização está — e receba um relatório pronto para apresentar ao board.
              </h2>

              <Button
                className="mt-6 px-6 py-5 text-lg"
                style={{ backgroundColor: "#5B4FCF", color: "white" }}
              >
                Iniciar diagnóstico
              </Button>

              <p className="text-sm text-gray-500 mt-4">
                Gratuito · Sem cartão de crédito · Resultado imediato
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* HEADER COM BOTÃO */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">
                Dashboard
              </h1>

              <Button style={{ backgroundColor: "#5B4FCF", color: "white" }}>
                Novo diagnóstico
              </Button>
            </div>

            {/* AQUI você mantém seu conteúdo atual */}
            <div className="text-gray-600">
              {/* Mantém seus gráficos, score, etc */}
              Conteúdo existente do dashboard...
            </div>
          </div>
        )}
      </main>
    </div>
  );
}