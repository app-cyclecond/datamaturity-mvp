"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DIMENSIONS } from "@/lib/assessment/questions";
import {
  AssessmentHeader,
  QuestionCard,
  ScaleResponse,
  TernaryResponse,
  SaveIndicator,
} from "@/components/assessment";
import { Button } from "@/components/ui/button";

export default function AssessmentPage() {
  const router = useRouter();
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const currentDimension = DIMENSIONS[currentDimensionIndex];
  const allQuestionsAnswered = currentDimension.questions.every(
    (q) => answers[q.id] !== undefined
  );

  // Auto-scroll para a próxima pergunta após responder
  const handleAnswer = async (questionId: string, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    // Salvar no sessionStorage
    sessionStorage.setItem("assessmentAnswers", JSON.stringify(newAnswers));

    // Scroll automático para a próxima pergunta
    const currentQuestionIndex = currentDimension.questions.findIndex(
      (q) => q.id === questionId
    );
    if (currentQuestionIndex < currentDimension.questions.length - 1) {
      const nextQuestionId = currentDimension.questions[currentQuestionIndex + 1].id;
      setTimeout(() => {
        questionRefs.current[nextQuestionId]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }

    // Tentar salvar no banco de dados
    try {
      setSaving(true);
      setSaveError(null);

      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: newAnswers,
          dimension: currentDimension.name,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setSaveError(error.message || "Erro ao salvar");
      }
    } catch (error) {
      setSaveError("Erro ao conectar com o servidor");
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleNextDimension = () => {
    if (currentDimensionIndex < DIMENSIONS.length - 1) {
      setCurrentDimensionIndex(currentDimensionIndex + 1);
      // Scroll para o topo
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousDimension = () => {
    if (currentDimensionIndex > 0) {
      setCurrentDimensionIndex(currentDimensionIndex - 1);
      // Scroll para o topo
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinalize = async () => {
    try {
      setSaving(true);
      setSaveError(null);

      const response = await fetch("/api/assessment/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        const error = await response.json();
        setSaveError(error.message || "Erro ao finalizar");
        return;
      }

      const data = await response.json();
      // Limpar sessionStorage
      sessionStorage.removeItem("assessmentAnswers");
      // Redirecionar para resultados
      router.push(`/resultado/${data.id}`);
    } catch (error) {
      setSaveError("Erro ao finalizar assessment");
      console.error("Finalize error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    sessionStorage.removeItem("assessmentAnswers");
    router.push("/dashboard");
  };

  // Restaurar respostas do sessionStorage ao carregar
  useEffect(() => {
    const saved = sessionStorage.getItem("assessmentAnswers");
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch (error) {
        console.error("Error restoring answers:", error);
      }
    }
  }, []);

  const isLastDimension = currentDimensionIndex === DIMENSIONS.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AssessmentHeader
        currentDimension={currentDimensionIndex + 1}
        totalDimensions={DIMENSIONS.length}
        dimensionName={currentDimension.name}
        onClose={handleClose}
      />

      <main className="max-w-3xl mx-auto px-4 py-8 pb-20">
        {/* Mensagem de erro */}
        {saveError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            ⚠️ {saveError}
          </div>
        )}

        {/* Descrição da dimensão */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentDimension.name}
          </h2>
          <p className="text-gray-600 text-lg">
            {currentDimension.description}
          </p>
        </div>

        {/* Perguntas */}
        <div className="space-y-6">
          {currentDimension.questions.map((question, index) => (
            <div
              key={question.id}
              ref={(el) => {
                if (el) questionRefs.current[question.id] = el;
              }}
            >
              <QuestionCard question={question}>
                {question.type === "scale" ? (
                  <ScaleResponse
                    levels={question.levels || []}
                    value={answers[question.id]}
                    onChange={(value) => handleAnswer(question.id, value)}
                    disabled={saving}
                  />
                ) : (
                  <TernaryResponse
                    value={answers[question.id]}
                    onChange={(value) => handleAnswer(question.id, value)}
                    disabled={saving}
                  />
                )}
              </QuestionCard>
            </div>
          ))}
        </div>

        {/* Botões de navegação */}
        <div className="mt-12 flex gap-4 justify-between">
          <Button
            onClick={handlePreviousDimension}
            disabled={currentDimensionIndex === 0 || saving}
            variant="outline"
            className="px-6 py-2"
          >
            ← Dimensão Anterior
          </Button>

          {isLastDimension ? (
            <Button
              onClick={handleFinalize}
              disabled={!allQuestionsAnswered || saving}
              className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white"
            >
              {saving ? "Salvando..." : "✓ Finalizar Assessment"}
            </Button>
          ) : (
            <Button
              onClick={handleNextDimension}
              disabled={!allQuestionsAnswered || saving}
              className="px-6 py-2"
            >
              Próxima Dimensão →
            </Button>
          )}
        </div>
      </main>

      {/* Indicador de salvamento */}
      <SaveIndicator saving={saving} error={!!saveError} />
    </div>
  );
}