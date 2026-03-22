"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DIMENSIONS } from "@/lib/assessment/questions";
import { Button } from "@/components/ui/button";
import { AssessmentHeader } from "@/components/assessment/assessment-header";
import { QuestionCard } from "@/components/assessment/question-card";
import { ScaleResponse } from "@/components/assessment/scale-response";
import { TernaryResponse } from "@/components/assessment/ternary-response";
import { SaveIndicator } from "@/components/assessment/save-indicator";

type Responses = Record<string, number>;

export default function AssessmentPage() {
  const router = useRouter();
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [responses, setResponses] = useState<Responses>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentDimension = DIMENSIONS[currentDimensionIndex];

  // Scroll ao topo quando muda de dimensão
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentDimensionIndex]);

  // Carregar respostas salvas
  useEffect(() => {
    const saved = sessionStorage.getItem("assessment_responses");
    if (saved) {
      setResponses(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  // Salvar respostas no sessionStorage
  const handleResponseChange = (questionId: string, value: number) => {
    const newResponses = { ...responses, [questionId]: value };
    setResponses(newResponses);
    sessionStorage.setItem("assessment_responses", JSON.stringify(newResponses));
  };

  // Verificar se todas as perguntas foram respondidas
  const isCurrentDimensionComplete = () => {
    return currentDimension.questions.every((q) => responses[q.id] !== undefined);
  };

  // Ir para próxima dimensão
  const handleNextDimension = () => {
    if (currentDimensionIndex < DIMENSIONS.length - 1) {
      setCurrentDimensionIndex(currentDimensionIndex + 1);
    }
  };

  // Ir para dimensão anterior
  const handlePreviousDimension = () => {
    if (currentDimensionIndex > 0) {
      setCurrentDimensionIndex(currentDimensionIndex - 1);
    }
  };

  // Finalizar assessment
  const handleFinish = async () => {
    try {
      setSaveStatus("saving");
      const supabase = createClient();

      const { data: user } = await supabase.auth.getUser();

      if (!user.user) {
        setSaveStatus("error");
        return;
      }

      const { data, error } = await supabase
        .from("assessment_results")
        .insert({
          user_id: user.user.id,
          responses,
        })
        .select()
        .single();

      if (error) {
        setSaveStatus("error");
        return;
      }

      setSaveStatus("saved");
      sessionStorage.removeItem("assessment_responses");

      // Redirecionar para resultado
      setTimeout(() => {
        router.push(`/resultado/${data.id}`);
      }, 1000);
    } catch (err) {
      setSaveStatus("error");
    }
  };

  // Salvar e sair
  const handleSaveAndExit = async () => {
    try {
      setSaveStatus("saving");
      sessionStorage.removeItem("assessment_responses");
      setSaveStatus("saved");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      setSaveStatus("error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
          <p className="mt-4 text-gray-600">Carregando assessment...</p>
        </div>
      </div>
    );
  }

  const progress = Math.round(
    ((currentDimensionIndex + 1) / DIMENSIONS.length) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AssessmentHeader
        currentDimension={currentDimensionIndex + 1}
        totalDimensions={DIMENSIONS.length}
        dimensionName={currentDimension.name}
        progress={progress}
        onSaveAndExit={handleSaveAndExit}
      />

      <div ref={contentRef} className="max-w-4xl mx-auto px-6 py-12">
        {/* DESCRIÇÃO DA DIMENSÃO */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {currentDimension.name}
          </h2>
          <p className="text-lg text-gray-600">
            {currentDimension.description}
          </p>
        </div>

        {/* PERGUNTAS */}
        <div className="space-y-8 mb-12">
          {currentDimension.questions.map((question) => (
            <QuestionCard key={question.id} question={question}>
              {question.type === "scale" ? (
                <ScaleResponse
                  levels={[
                    { level: 1, label: "Inexistente", description: "" },
                    { level: 2, label: "Inicial", description: "" },
                    { level: 3, label: "Estruturado", description: "" },
                    { level: 4, label: "Gerenciado", description: "" },
                    { level: 5, label: "Otimizado", description: "" },
                  ]}
                  value={responses[question.id]}
                  onChange={(value) => handleResponseChange(question.id, value)}
                />
              ) : (
                <TernaryResponse
                  value={responses[question.id]}
                  onChange={(value) => handleResponseChange(question.id, value)}
                />
              )}
            </QuestionCard>
          ))}
        </div>

        {/* NAVEGAÇÃO */}
        <div className="flex gap-4 justify-between">
          <Button
            onClick={handlePreviousDimension}
            disabled={currentDimensionIndex === 0}
            className="px-6 py-3 bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Dimensão Anterior
          </Button>

          {currentDimensionIndex === DIMENSIONS.length - 1 ? (
            <Button
              onClick={handleFinish}
              disabled={!isCurrentDimensionComplete()}
              className="px-8 py-3 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✓ Finalizar Assessment
            </Button>
          ) : (
            <Button
              onClick={handleNextDimension}
              disabled={!isCurrentDimensionComplete()}
              className="px-6 py-3 bg-brand-primary text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima Dimensão →
            </Button>
          )}
        </div>
      </div>

      <SaveIndicator status={saveStatus} />
    </div>
  );
}