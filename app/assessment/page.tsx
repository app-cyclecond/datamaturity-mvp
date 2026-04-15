"use client";
import { Sidebar } from "@/components/layout/sidebar";
import AuthenticatedLayout from "@/components/auth/AuthenticatedLayout";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DIMENSIONS } from "@/lib/assessment/questions";
import { createClient } from "@/lib/supabase/client";
import {
  AssessmentHeader,
  QuestionCard,
  ScaleResponse,
  TernaryResponse,
  SaveIndicator,
} from "@/components/assessment";
import { Button } from "@/components/ui/button";
import { Lock, Zap, Crown, AlertTriangle, CheckCircle2 } from "lucide-react";

type SaveStatus = "idle" | "saving" | "saved" | "error";
type UserPlan = "starter" | "bronze" | "silver" | "gold";

const PLAN_LIMITS: Record<UserPlan, number> = {
  starter: 1,
  bronze: 1,
  silver: 3,
  gold: Infinity,
};

const PLAN_LABELS: Record<UserPlan, string> = {
  starter: "Starter",
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
};

type AccessInfo = {
  hasAccess: boolean;
  plan: UserPlan;
  used: number;
  limit: number;
  reason?: string;
};

export default function AssessmentPage() {
  const router = useRouter();
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [accessInfo, setAccessInfo] = useState<AccessInfo | null>(null);
  const [userProfile, setUserProfile] = useState<{ name?: string; email?: string; plan?: string } | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const questionRefsMap = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const supabase = createClient();

        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) {
          router.push("/auth/login");
          return;
        }

        // Buscar dados do usuário
        const { data: userData } = await supabase
          .from("users")
          .select("plan, name, email")
          .eq("id", authData.user.id)
          .single();

        const plan = ((userData?.plan as UserPlan) || "starter");
        setUserProfile({ name: userData?.name, email: userData?.email, plan });

        // Gold = ilimitado, não precisa verificar
        if (plan === "gold") {
          setAccessInfo({ hasAccess: true, plan, used: 0, limit: Infinity });
          setIsLoading(false);
          return;
        }

        // Para outros planos, contar diagnósticos do mês atual
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const { data: results } = await supabase
          .from("assessment_results")
          .select("created_at")
          .eq("user_id", authData.user.id)
          .gte("created_at", monthStart.toISOString());

        const used = results?.length || 0;
        const limit = PLAN_LIMITS[plan];
        const hasAccess = used < limit;

        setAccessInfo({
          hasAccess,
          plan,
          used,
          limit,
          reason: hasAccess ? undefined : `Você atingiu o limite de ${limit} diagnóstico(s) por mês no plano ${PLAN_LABELS[plan]}.`,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao verificar acesso:", error);
        setIsLoading(false);
        // Em caso de erro, permite acesso (fail-open) para não bloquear usuários legítimos
        setAccessInfo({ hasAccess: true, plan: "starter", used: 0, limit: 1 });
      }
    };

    verifyAccess();
  }, [router]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // Limite atingido — tela de bloqueio elegante
  if (accessInfo && !accessInfo.hasAccess) {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    const nextMonthStr = nextMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar user={userProfile || undefined} activePage="assessment" />
        <main className="ml-64 flex items-center justify-center min-h-screen p-8">
          <div className="max-w-lg w-full">
            {/* Card principal */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header colorido */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">Limite do mês atingido</h1>
                    <p className="text-sm text-amber-700">Plano {PLAN_LABELS[accessInfo.plan]}</p>
                  </div>
                </div>
              </div>

              {/* Contador visual */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Diagnósticos realizados este mês</span>
                  <span className="text-sm font-bold text-gray-900">{accessInfo.used}/{accessInfo.limit}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
                  <div
                    className="bg-amber-500 h-3 rounded-full transition-all"
                    style={{ width: "100%" }}
                  />
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Seu próximo diagnóstico estará disponível em <strong>{nextMonthStr}</strong>.
                </p>

                {/* Opções */}
                <div className="space-y-3">
                  <button
                    onClick={() => router.push("/planos")}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-sm transition-all"
                  >
                    <Crown className="h-4 w-4" />
                    Fazer upgrade para Gold — diagnósticos ilimitados
                  </button>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm transition-all"
                  >
                    Voltar ao Dashboard
                  </button>
                </div>
              </div>

              {/* Comparativo de planos */}
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Comparativo de planos</p>
                <div className="space-y-2">
                  {(["bronze", "silver", "gold"] as UserPlan[]).map((p) => (
                    <div key={p} className={`flex items-center justify-between py-2 px-3 rounded-lg ${p === accessInfo.plan ? "bg-amber-50 border border-amber-200" : ""}`}>
                      <span className="text-sm font-medium text-gray-700 capitalize">{PLAN_LABELS[p]}</span>
                      <span className={`text-sm font-bold ${p === "gold" ? "text-emerald-600" : "text-gray-600"}`}>
                        {p === "gold" ? "Ilimitado" : `${PLAN_LIMITS[p]}/mês`}
                        {p === accessInfo.plan && <span className="ml-2 text-xs text-amber-600">(seu plano)</span>}
                      </span>
                    </div>
                  ))}
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

  const totalQuestions = DIMENSIONS.reduce((sum, dim) => sum + dim.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const overallProgress = Math.round((answeredQuestions / totalQuestions) * 100);

  const handleAnswer = (questionId: string, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    sessionStorage.setItem("assessmentAnswers", JSON.stringify(newAnswers));

    setTimeout(() => {
      const currentQuestionIndex = currentDimension.questions.findIndex(
        (q) => q.id === questionId
      );
      if (currentQuestionIndex < currentDimension.questions.length - 1) {
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
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setCurrentDimensionIndex(currentDimensionIndex + 1), 300);
    }
  };

  const handlePreviousDimension = () => {
    if (currentDimensionIndex > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setCurrentDimensionIndex(currentDimensionIndex - 1), 300);
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
        return;
      }

      const data = await response.json();

      if (!data.resultId) {
        setSaveStatus("error");
        setSaveMessage("Erro: ID de resultado não recebido");
        return;
      }

      sessionStorage.removeItem("assessmentAnswers");
      router.push(`/resultado/${data.resultId}`);
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage("Erro ao finalizar assessment");
    }
  };

  const isLastDimension = currentDimensionIndex === DIMENSIONS.length - 1;
  const isSaving = saveStatus === "saving";

  // Banner de uso para planos não-Gold
  const showUsageBanner = accessInfo && accessInfo.plan !== "gold" && accessInfo.limit !== Infinity;

  return (
    <AuthenticatedLayout>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AssessmentHeader
        currentDimension={currentDimensionIndex + 1}
        totalDimensions={DIMENSIONS.length}
        dimensionName={currentDimension.name}
        progress={overallProgress}
        onSaveAndExit={handleSaveAndExit}
      />

      {/* Banner de uso para Bronze/Silver */}
      {showUsageBanner && (
        <div className="max-w-3xl mx-auto px-4 pt-4">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
            accessInfo.used + 1 >= accessInfo.limit
              ? "bg-amber-50 border-amber-200 text-amber-800"
              : "bg-indigo-50 border-indigo-200 text-indigo-800"
          }`}>
            {accessInfo.used + 1 >= accessInfo.limit ? (
              <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-500" />
            ) : (
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-indigo-500" />
            )}
            <div className="flex-1">
              <span className="font-semibold">
                Diagnóstico {accessInfo.used + 1} de {accessInfo.limit}
              </span>
              {" "}no plano <span className="font-semibold capitalize">{PLAN_LABELS[accessInfo.plan]}</span>
              {accessInfo.used + 1 >= accessInfo.limit && (
                <span className="ml-1 text-amber-700">— este é o seu último diagnóstico do mês.</span>
              )}
            </div>
            <button
              onClick={() => router.push("/planos")}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 whitespace-nowrap"
            >
              <Zap className="h-3 w-3" /> Fazer upgrade
            </button>
          </div>
        </div>
      )}

      <main ref={mainRef} className="max-w-3xl mx-auto px-4 py-8 pb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentDimension.name}
          </h2>
          <p className="text-gray-600 text-lg">{currentDimension.description}</p>
        </div>

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

        <div className="mt-12 flex gap-4 justify-between sticky bottom-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 px-4 py-3">
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

      <SaveIndicator status={saveStatus} message={saveMessage} />
    </div>
      </AuthenticatedLayout>
  );
}
