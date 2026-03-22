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

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function AssessmentPage() {
  const router = useRouter();
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveMessage, setSaveMessage] = useState<string>("");
  const mainRef = useRef<HTMLDivElement>(null);

  const currentDimension = DIMENSIONS[currentDimensionIndex];
  const allQuestionsAnswered = currentDimension.questions.every(
    (q) => answers[q.id] !== undefined
  );

  // Calcular progresso geral
  const totalQuestions = DIMENSIONS.reduce((sum, dim) => sum + dim.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const overallProgress = Math.round((answeredQuestions / totalQuestions) * 100);

  // Simples: apenas atualiza o estado local
  const handleAnswer = (questionId: string, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    // Salvar no sessionStorage para persistência
    sessionStorage.setItem("assessmentAnswers", JSON.stringify(newAnswers));
  };

  const handleNextDimension = () => {
    if (currentDimensionIndex < DIMENSIONS.length - 1) {
      // Scroll para o topo ANTES de mudar
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      // Pequeno delay para garantir que o scroll aconteça
      setTimeout(() => {
        setCurrentDimensionIndex(currentDimensionIndex + 1);
      }, 300);
    }
  };

  const handlePreviousDimension = () => {
    if (currentDimensionIndex > 0) {
      // Scroll para o topo ANTES de mudar
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      // Pequeno delay para garantir que o scroll aconteça
      setTimeout(() => {
        setCurrentDimensionIndex(currentDimensionIndex - 1);
      }, 300);
    }
  };

  const handleSaveAndExit = () => {
    sessionStorage.removeItem("assessmentAnswers");
    router.push("/dashboard");
  };

  const handleFinalize = async () => {
    try {
      setSaveStatus("saving");
      setSaveMessage("");

      // Verificar se todas as perguntas foram respondidas
      const allAnswered = DIMENSIONS.every((dim) =>
        dim.questions.every((q) => answers[q.id] !== undefined)
      );

      if (!allAnswered) {
        setSaveStatus("error");
        setSaveMessage("Por favor, responda todas as perguntas antes de finalizar");
        return;
      }

      const response = await fetch("/api/assessment/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        const error = await response.json();
        setSaveStatus("error");
        setSaveMessage(error.message || "Erro ao finalizar assessment");
        console.error("Finalize error:", error);
        return;
      }

      const data = await response.json();
      
      // Verificar se a resposta tem um ID (CORRIGIDO: resultId)
      if (!data.resultId) {
        setSaveStatus("error");
        setSaveMessage("Erro: ID de resultado não recebido");
        console.error("No ID in response:", data);
        return;
      }

      // Limpar sessionStorage
      sessionStorage.removeItem("assessmentAnswers");
      
      // Redirecionar para resultados (CORRIGIDO: data.resultId)
      router.push(`/resultado/${data.resultId}`);
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage("Erro ao finalizar assessment");
      console.error("Finalize error:", error);
    }
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
  const isSaving = saveStatus === "saving";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AssessmentHeader
        currentDimension={currentDimensionIndex + 1}
        totalDimensions={DIMENSIONS.length}
        dimensionName={currentDimension.name}
        progress={overallProgress}
        onSaveAndExit={handleSaveAndExit}
      />

      <main ref={mainRef} className="max-w-3xl mx-auto px-4 py-8 pb-20">
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
          {currentDimension.questions.map((question) => (
            <div key={question.id}>
              <QuestionCard question={question}>
                {question.type === "scale" ? (
                  <ScaleResponse
                    levels={question.levels || []}
                    value={answers[question.id]}
                    onChange={(value) => handleAnswer(question.id, value)}
                    disabled={isSaving}
                  />
                ) : (
                  <TernaryResponse
                    value={answers[question.id]}
                    onChange={(value) => handleAnswer(question.id, value)}
                    disabled={isSaving}
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
            disabled={currentDimensionIndex === 0 || isSaving}
            variant="outline"
            className="px-6 py-2"
          >
            ← Dimensão Anterior
          </Button>

          {isLastDimension ? (
            <Button
              onClick={handleFinalize}
              disabled={!allQuestionsAnswered || isSaving}
              className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white"
            >
              {isSaving ? "Salvando..." : "✓ Finalizar Assessment"}
            </Button>
          ) : (
            <Button
              onClick={handleNextDimension}
              disabled={!allQuestionsAnswered || isSaving}
              className="px-6 py-2"
            >
              Próxima Dimensão →
            </Button>
          )}
        </div>
      </main>

      {/* Indicador de salvamento */}
      <SaveIndicator status={saveStatus} message={saveMessage} />
    </div>
  );
}