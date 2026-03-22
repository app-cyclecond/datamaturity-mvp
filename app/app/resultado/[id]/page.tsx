"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getLevelDescription, getStrongestDimensionMessage, getWeakestDimensionMessage, getNextStepMessage, DimensionResult } from "@/lib/assessment/utils";
import { Download, ArrowLeft } from "lucide-react";

interface AssessmentResult {
  id: string;
  overall_score: number;
  level: string;
  dimension_scores: DimensionResult[];
  created_at: string;
}

export default function ResultadoPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resultId = params.id as string;

  useEffect(() => {
    async function loadResult() {
      try {
        const supabase = createClient();

        const { data, error: fetchError } = await supabase
          .from("assessment_results")
          .select("*")
          .eq("id", resultId)
          .single();

        if (fetchError || !data) {
          setError("Resultado não encontrado");
          return;
        }

        setResult(data as AssessmentResult);
      } catch (err) {
        console.error("Error loading result:", err);
        setError("Erro ao carregar resultado");
      } finally {
        setIsLoading(false);
      }
    }

    loadResult();
  }, [resultId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
          <p className="mt-4 text-gray-600">Carregando resultado...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Erro ao carregar resultado
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-brand-primary text-white rounded-lg font-medium hover:opacity-90 transition-all"
          >
            Voltar ao dashboard
          </button>
        </div>
      </div>
    );
  }

  const sorted = [...(result.dimension_scores || [])].sort(
    (a, b) => b.score - a.score
  );
  const strongest = sorted[0] || null;
  const weakest = sorted[sorted.length - 1] || null;

  const levelColor: Record<string, string> = {
    "Inexistente": "text-red-600",
    "Inicial": "text-orange-600",
    "Estruturado": "text-amber-600",
    "Gerenciado": "text-blue-600",
    "Otimizado": "text-green-600",
  };

  const levelBg: Record<string, string> = {
    "Inexistente": "bg-red-50",
    "Inicial": "bg-orange-50",
    "Estruturado": "bg-amber-50",
    "Gerenciado": "bg-blue-50",
    "Otimizado": "bg-green-50",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Resultado do Diagnóstico</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-all">
            <Download className="w-5 h-5" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Overall Score Card */}
        <div className={`rounded-2xl border border-gray-200 p-12 mb-12 text-center ${levelBg[result.level]}`}>
          <p className="text-sm font-medium text-gray-600 mb-2">Score Geral</p>
          <div className={`text-7xl font-bold ${levelColor[result.level]} mb-4`}>
            {result.overall_score.toFixed(1)}
          </div>
          <p className={`text-2xl font-semibold ${levelColor[result.level]} mb-6`}>
            {result.level}
          </p>
          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
            {getLevelDescription(result.level)}
          </p>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Strongest */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-lg">💪</span>
              Ponto Forte
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {getStrongestDimensionMessage(strongest)}
            </p>
          </div>

          {/* Weakest */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-lg">🎯</span>
              Principal Gap
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {getWeakestDimensionMessage(weakest)}
            </p>
          </div>

          {/* Next Step */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-lg">🚀</span>
              Próximo Passo
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {getNextStepMessage(strongest, weakest)}
            </p>
          </div>
        </div>

        {/* Dimension Results */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Resultado por Dimensão
          </h2>
          <p className="text-gray-600 mb-8">
            Veja onde sua maturidade está mais forte ou mais fraca
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(result.dimension_scores || []).map((dimension) => (
              <div
                key={dimension.dimension}
                className={`rounded-xl border border-gray-200 p-6 ${levelBg[dimension.level]}`}
              >
                <p className="text-sm text-gray-600 mb-2">{dimension.dimension}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className={`text-4xl font-bold ${levelColor[dimension.level]}`}>
                      {dimension.score.toFixed(1)}
                    </p>
                    <p className={`text-sm font-semibold ${levelColor[dimension.level]} mt-2`}>
                      {dimension.level}
                    </p>
                  </div>
                  <div className="w-20 h-20 rounded-full bg-white/50 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Score</p>
                      <p className="text-lg font-bold text-gray-900">
                        {Math.round((dimension.score / 5) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-brand-primary to-brand-primary rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">
            Pronto para evoluir sua maturidade em dados?
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Compartilhe este resultado com seu time e comece a implementar as recomendações para acelerar a transformação.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 bg-white text-brand-primary rounded-lg font-medium hover:bg-gray-100 transition-all"
            >
              Voltar ao Dashboard
            </button>
            <button className="px-6 py-3 border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-all">
              Compartilhar Resultado
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
