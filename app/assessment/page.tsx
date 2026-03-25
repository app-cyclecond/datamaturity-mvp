"use client";
import { Sidebar } from "@/components/layout/sidebar";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DIMENSIONS } from "@/lib/assessment/questions";
import { checkAssessmentAccess } from "@/lib/assessment/access-control";
import { createClient } from "@supabase/supabase-js";
import {
  AssessmentHeader,
  QuestionCard,
  ScaleResponse,
  TernaryResponse,
  SaveIndicator,
} from "@/components/assessment";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lock } from "lucide-react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function AssessmentPage() {
  const router = useRouter();
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [accessDenied, setAccessDenied] = useState(false);
  const [accessMessage, setAccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);
  const questionRefsMap = useRef<Record<string, HTMLDivElement | null>>({});

  // Verificar acesso ao assessment
  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || "",
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
        );

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const accessResult = await checkAssessmentAccess(user.id);

        if (!accessResult.hasAccess) {
          setAccessDenied(true);
          setAccessMessage(accessResult.reason || "Acesso negado");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao verificar acesso:", error);
        setIsLoading(false);
      }
    };

    verifyAccess();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar />
        <main className="ml-0 md:ml-64 p-6">
          <div className="max-w-2xl mx-auto mt-20">
            <div className="bg-white rounded-lg shadow-lg border-l-4 border-red-500 p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Lock className="h-6 w-6 text-red-500 mt-1" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Acesso Restrito
                  </h1>
                  <p className="text-gray-600 mb-6 text-lg">{accessMessage}</p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Como desbloquear o assessment completo?
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>✓ Faça upgrade para um plano pago (Bronze, Silver ou Gold)</li>
                      <li>✓ Cada plano oferece um número diferente de diagnósticos por mês</li>
                      <li>✓ Gold oferece acesso ilimitado</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => router.push("/configuracoes")}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      Gerenciar Plano
                    </button>
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                    >
                      Voltar ao Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentDimension = DIMENSIONS[currentDimensionIndex];
  const allQuestionsAnswered = currentDimension.questions.every(
    (q) => answers[q.id] !== undefined
  );

  // Calcular progresso geral
  const totalQuestions = DIMENSIONS.reduce((sum, dim) => sum + dim.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const overallProgress = Math.round((answeredQuestions / totalQuestions) * 100);

  // Atualizar resposta e fazer scroll automático
  const handleAnswer = (questionId: string, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    // Salvar no sessionStorage para persistência
    sessionStorage.setItem("assessmentAnswers", JSON.stringify(newAnswers));

    // Fazer scroll automático para a próxima pergunta
    setTimeout(() => {
      const currentQuestionIndex = currentDimension.questions.findIndex(
        (q) => q.id === questionId
      );

      if (currentQuestionIndex < currentDimension.questions.length - 1) {
        // Próxima pergunta na mesma dimensão
        const nextQuestion = currentDimension.questions[currentQuestionIndex + 1];
        const nextElement = questionRefsMap.current[nextQuestion.id];

        if (nextElement) {
          nextElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }, 100);
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

      // Verificar se a resposta tem um ID
      if (!data.resultId) {
        setSaveStatus("error");
        setSaveMessage("Erro: ID de resultado não recebido");
        console.error("No ID in response:", data);
        return;
      }

      // Limpar sessionStorage
      sessionStorage.removeItem("assessmentAnswers");

      // Redirecionar para resultados
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
          <p className="text-gray-600 text-lg">{currentDimension.description}</p>
        </div>

        {/* Perguntas */}
        <div className="space-y-6">
          {currentDimension.questions.map((question) => (
            <div
              key={question.id}
              ref={(el) => {
                if (el) questionRefsMap.current[question.id] = el;
              }}
            >
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
