"use client";

import { Button } from "@/components/ui/button";
import { DIMENSIONS } from "@/lib/assessment/questions";
import { ExportActions } from "@/components/assessment/export-actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AssessmentResult = {
  id: string;
  user_id: string;
  overall_score: number;
  level: string;
  dimension_scores: Record<string, number>;
  created_at: string;
};

type UserProfile = {
  name: string;
  email: string;
  company: string;
};

// Determinar nível baseado no score
function getLevel(score: number | string) {
  const numScore = typeof score === "string" ? parseFloat(score) : score;
  if (numScore < 1.5) return "Inexistente";
  if (numScore < 2.5) return "Inicial";
  if (numScore < 3.5) return "Intermediário";
  if (numScore < 4.5) return "Avançado";
  return "Otimizado";
}

// Cores por nível
function getLevelColor(score: number | string) {
  const numScore = typeof score === "string" ? parseFloat(score) : score;
  if (numScore < 1.5) return "bg-red-50 text-red-900 border-red-200";
  if (numScore < 2.5) return "bg-orange-50 text-orange-900 border-orange-200";
  if (numScore < 3.5) return "bg-yellow-50 text-yellow-900 border-yellow-200";
  if (numScore < 4.5) return "bg-blue-50 text-blue-900 border-blue-200";
  return "bg-green-50 text-green-900 border-green-200";
}

export default function ResultadoPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient();

        // Verificar autenticação
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) {
          router.push("/login");
          return;
        }

        // Buscar resultado
        const { data: resultData, error: resultError } = await supabase
          .from("assessment_results")
          .select("*")
          .eq("id", params.id)
          .eq("user_id", authData.user.id)
          .single();

        if (resultError || !resultData) {
          router.push("/dashboard");
          return;
        }

        // Buscar dados do usuário
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        setResult(resultData as AssessmentResult);
        setUser(userData as UserProfile);
      } catch (error) {
        console.error("Erro ao carregar resultado:", error);
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          <p className="mt-4 text-gray-600">Carregando resultado...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Resultado não encontrado</p>
          <Link href="/dashboard">
            <Button className="mt-4">Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* BOTÃO VOLTAR */}
        <Link href="/dashboard">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        </Link>

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Seu Diagnóstico</h1>
          <p className="text-purple-100">
            Resultado de{" "}
            {new Date(result.created_at).toLocaleDateString("pt-BR")}
          </p>
        </div>

        {/* SCORE GERAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
            <p className="text-gray-600 text-sm font-medium mb-2">Score Geral</p>
            <div className="text-5xl font-bold text-indigo-600 mb-2">
              {result.overall_score}
            </div>
            <div
              className={`inline-block px-4 py-2 rounded-lg border ${getLevelColor(result.overall_score)} text-sm font-semibold`}
            >
              {result.level}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
            <p className="text-gray-600 text-sm font-medium mb-2">
              Dimensões Avaliadas
            </p>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {DIMENSIONS.length}
            </div>
            <p className="text-gray-500 text-sm">áreas de maturidade</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
            <p className="text-gray-600 text-sm font-medium mb-2">
              Data do Diagnóstico
            </p>
            <div className="text-lg font-semibold text-gray-900 mt-4">
              {new Date(result.created_at).toLocaleDateString("pt-BR")}
            </div>
          </div>
        </div>

        {/* DIMENSÕES */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Resultados por Dimensão
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DIMENSIONS.map((dimension) => {
              const score = result.dimension_scores[dimension.name] || 0;
              return (
                <div
                  key={dimension.name}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {dimension.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {dimension.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div>
                      <div className="text-3xl font-bold text-gray-900">
                        {score}
                      </div>
                      <div
                        className={`inline-block px-3 py-1 rounded-lg border text-xs font-semibold mt-2 ${getLevelColor(score)}`}
                      >
                        {getLevel(score)}
                      </div>
                    </div>

                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">
                          {Math.round((score / 5) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* EXPORT ACTIONS */}
        <div className="mb-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Compartilhar Resultado</h3>
          <ExportActions
            resultId={result.id}
            assessmentData={result}
            user={user || { name: "Usuário", email: "", company: "" }}
          />
        </div>

        {/* AÇÕES */}
        <div className="flex gap-4 justify-center">
          <Link href="/assessment">
            <Button className="px-8 py-3 bg-indigo-600 text-white hover:opacity-90">
              Fazer Novo Diagnóstico
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="px-8 py-3 bg-gray-200 text-gray-900 hover:bg-gray-300">
              Voltar ao Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
