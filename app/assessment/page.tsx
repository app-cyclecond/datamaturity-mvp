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
import { Lock, Zap, Crown, AlertTriangle, CheckCircle2, Star, ArrowRight } from "lucide-react";

type SaveStatus = "idle" | "saving" | "saved" | "error";
type UserPlan = "starter" | "bronze" | "silver" | "gold";

const PLAN_LIMITS: Record<UserPlan, number> = {
  starter: 0,
  bronze: 2,
  silver: 4,
  gold: Infinity,
};

const PLAN_LABELS: Record<UserPlan, string> = {
  starter: "Starter",
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
};

const PREVIEW_QUESTIONS = 3;

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
        if (!authData.user) { router.push("/auth/login"); return; }

        const { data: userData } = await supabase
          .from("users")
          .select("plan, name, email")
          .eq("id", authData.user.id)
          .single();

        const plan = ((userData?.plan as UserPlan) || "starter");
        setUserProfile({ name: userData?.name, email: userData?.email, plan });

        if (plan === "starter") {
          setAccessInfo({ hasAccess: false, plan, used: 0, limit: 0 });
          setIsLoading(false);
          return;
        }
        if (plan === "gold") {
          setAccessInfo({ hasAccess: true, plan, used: 0, limit: Infinity });
          setIsLoading(false);
          return;
        }

        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const { data: results } = await supabase
          .from("assessment_results")
          .select("created_at")
          .eq("user_id", authData.user.id)
          .gte("created_at", firstOfMonth);

        const used = results?.length || 0;
        const limit = PLAN_LIMITS[plan];
        const hasAccess = used < limit;
        setAccessInfo({ hasAccess, plan, used, limit,
          reason: hasAccess ? undefined : `Você atingiu o limite de ${limit} diagnóstico(s) do plano ${PLAN_LABELS[plan]}.` });
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao verificar acesso:", error);
        setIsLoading(false);
        setAccessInfo({ hasAccess: false, plan: "starter", used: 0, limit: 0 });
      }
    };
    verifyAccess();
  }, [router]);

  useEffect(() => {
    const saved = sessionStorage.getItem("assessmentAnswers");
    if (saved) { try { setAnswers(JSON.parse(saved)); } catch {} }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // ─── MODO PREVIEW (Starter) ───────────────────────────────────────────────
  if (accessInfo && !accessInfo.hasAccess && accessInfo.plan === "starter") {
    const previewDimension = DIMENSIONS[0];
    const previewQuestions = previewDimension.questions.slice(0, PREVIEW_QUESTIONS);
    const totalQ = DIMENSIONS.reduce((s, d) => s + d.questions.length, 0);

    return (
      <AuthenticatedLayout>
        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar user={userProfile || undefined} activePage="assessment" />
          <div className="flex-1 ml-64">
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
              <div className="max-w-3xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Preview gratuito · {previewDimension.name}</p>
                    <h1 className="text-xl font-bold text-gray-900 mt-0.5">Diagnóstico de Maturidade em Dados</h1>
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <Lock className="h-3 w-3" /> Preview — {PREVIEW_QUESTIONS} de {totalQ} perguntas
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Progresso</span>
                    <span>Bloqueado após {PREVIEW_QUESTIONS} perguntas</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-200 rounded-full" style={{ width: `${Math.round((PREVIEW_QUESTIONS / totalQ) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <main className="max-w-3xl mx-auto px-4 py-8 pb-32">
              <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 flex items-start gap-3">
                <Star className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-indigo-800">Você está no modo preview gratuito</p>
                  <p className="text-sm text-indigo-600 mt-0.5">
                    Veja como funciona o diagnóstico. Para responder todas as {totalQ} perguntas em 7 dimensões e receber seu relatório personalizado, escolha um plano.
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{previewDimension.name}</h2>
                <p className="text-gray-500 text-sm">{previewDimension.description}</p>
              </div>

              <div className="space-y-6">
                {previewQuestions.map((question) => (
                  <div key={question.id} className="relative">
                    <QuestionCard question={question}>
                      {question.type === "scale" ? (
                        <ScaleResponse levels={question.levels || []} value={undefined} onChange={() => {}} disabled={true} />
                      ) : (
                        <TernaryResponse value={undefined} onChange={() => {}} disabled={true} />
                      )}
                    </QuestionCard>
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                        <Lock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500 font-medium">Disponível com plano pago</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paywall inline */}
              <div className="mt-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-4">
                    <Crown className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Desbloqueie o diagnóstico completo</h3>
                  <p className="text-indigo-200 text-sm max-w-md mx-auto">
                    Responda todas as {totalQ} perguntas em 7 dimensões e receba seu score de maturidade, análise detalhada e roadmap personalizado.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/10 border border-white/20 rounded-xl p-5 hover:bg-white/20 transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-bold text-white">Bronze</span>
                    </div>
                    <div className="mb-3">
                      <span className="text-2xl font-extrabold text-white">R$ 4.900</span>
                      <span className="text-indigo-200 text-sm ml-1">/ano</span>
                    </div>
                    <ul className="space-y-1.5 text-sm text-indigo-100 mb-4">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-300" /> 2 diagnósticos completos</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-300" /> Score em 7 dimensões</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-300" /> Relatório PDF básico</li>
                    </ul>
                    <button onClick={() => router.push("/planos")} className="w-full bg-white text-indigo-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                      Escolher Bronze <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="bg-white/20 border-2 border-white/40 rounded-xl p-5 relative hover:bg-white/30 transition-all">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">Mais Popular</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center">
                        <Zap className="h-4 w-4 text-gray-700" />
                      </div>
                      <span className="font-bold text-white">Silver</span>
                    </div>
                    <div className="mb-3">
                      <span className="text-2xl font-extrabold text-white">R$ 9.900</span>
                      <span className="text-indigo-200 text-sm ml-1">/ano</span>
                    </div>
                    <ul className="space-y-1.5 text-sm text-indigo-100 mb-4">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-300" /> 4 diagnósticos completos</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-300" /> Score em 7 dimensões</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-300" /> Roadmap personalizado</li>
                    </ul>
                    <button onClick={() => router.push("/planos")} className="w-full bg-white text-indigo-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                      Escolher Silver <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-center text-indigo-300 text-xs">
                  Precisa de diagnósticos ilimitados?{" "}
                  <button onClick={() => router.push("/planos")} className="text-white underline font-medium">Conheça o plano Gold</button>
                </p>
              </div>
            </main>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // ─── LIMITE ATINGIDO (Bronze/Silver esgotado no mês) ─────────────────────
  if (accessInfo && !accessInfo.hasAccess && accessInfo.plan !== "starter") {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nextMonthStr = nextMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

    return (
      <AuthenticatedLayout>
        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar user={userProfile || undefined} activePage="assessment" />
          <main className="ml-64 flex items-center justify-center min-h-screen p-8 flex-1">
            <div className="max-w-lg w-full">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Diagnósticos realizados este mês</span>
                    <span className="text-sm font-bold text-gray-900">{accessInfo.used}/{accessInfo.limit}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
                    <div className="bg-amber-500 h-3 rounded-full" style={{ width: "100%" }} />
                  </div>
                  <p className="text-sm text-gray-500 mb-6">
                    Seu próximo diagnóstico estará disponível em <strong>{nextMonthStr}</strong>.
                  </p>
                  <div className="space-y-3">
                    <button onClick={() => router.push("/planos")} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-sm transition-all">
                      <Crown className="h-4 w-4" /> Fazer upgrade para Gold — diagnósticos ilimitados
                    </button>
                    <button onClick={() => router.push("/dashboard")} className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm transition-all">
                      Voltar ao Dashboard
                    </button>
                  </div>
                </div>
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
      </AuthenticatedLayout>
    );
  }

  // ─── DIAGNÓSTICO COMPLETO ─────────────────────────────────────────────────
  const currentDimension = DIMENSIONS[currentDimensionIndex];
  const allQuestionsAnswered = currentDimension.questions.every((q) => answers[q.id] !== undefined);
  const totalQuestions = DIMENSIONS.reduce((sum, dim) => sum + dim.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const overallProgress = Math.round((answeredQuestions / totalQuestions) * 100);

  const handleAnswer = (questionId: string, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    sessionStorage.setItem("assessmentAnswers", JSON.stringify(newAnswers));
    setTimeout(() => {
      const idx = currentDimension.questions.findIndex((q) => q.id === questionId);
      if (idx < currentDimension.questions.length - 1) {
        const nextEl = questionRefsMap.current[currentDimension.questions[idx + 1].id];
        if (nextEl) nextEl.scrollIntoView({ behavior: "smooth", block: "center" });
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
      const allAnswered = DIMENSIONS.every((dim) => dim.questions.every((q) => answers[q.id] !== undefined));
      if (!allAnswered) { setSaveStatus("error"); setSaveMessage("Por favor, responda todas as perguntas antes de finalizar"); return; }

      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) { router.push("/auth/login"); return; }

      const response = await fetch("/api/assessment/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, userId: authData.user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSaveStatus("error");
        setSaveMessage(errorData.error || "Erro ao finalizar assessment");
        return;
      }

      const data = await response.json();
      if (!data.resultId) { setSaveStatus("error"); setSaveMessage("Erro: ID de resultado não recebido"); return; }

      sessionStorage.removeItem("assessmentAnswers");
      router.push(`/resultado/${data.resultId}`);
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage("Erro ao finalizar assessment");
    }
  };

  const isLastDimension = currentDimensionIndex === DIMENSIONS.length - 1;
  const isSaving = saveStatus === "saving";
  const showUsageBanner = accessInfo && accessInfo.plan !== "gold" && accessInfo.limit !== Infinity;

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar user={userProfile || undefined} activePage="assessment" />
        <div className="flex-1 ml-64">
          <AssessmentHeader
            currentDimension={currentDimensionIndex + 1}
            totalDimensions={DIMENSIONS.length}
            dimensionName={currentDimension.name}
            progress={overallProgress}
            onSaveAndExit={handleSaveAndExit}
          />

          {showUsageBanner && (
            <div className="max-w-3xl mx-auto px-4 pt-4">
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
                accessInfo.used + 1 >= accessInfo.limit ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-indigo-50 border-indigo-200 text-indigo-800"
              }`}>
                {accessInfo.used + 1 >= accessInfo.limit
                  ? <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-500" />
                  : <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-indigo-500" />}
                <div className="flex-1">
                  <span className="font-semibold">Diagnóstico {accessInfo.used + 1} de {accessInfo.limit}</span>
                  {" "}no plano <span className="font-semibold capitalize">{PLAN_LABELS[accessInfo.plan]}</span>
                  {accessInfo.used + 1 >= accessInfo.limit && <span className="ml-1 text-amber-700">— este é o seu último diagnóstico do mês.</span>}
                </div>
                <button onClick={() => router.push("/planos")} className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 whitespace-nowrap">
                  <Zap className="h-3 w-3" /> Fazer upgrade
                </button>
              </div>
            </div>
          )}

          <main ref={mainRef} className="max-w-3xl mx-auto px-4 py-8 pb-20">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentDimension.name}</h2>
              <p className="text-gray-600 text-lg">{currentDimension.description}</p>
            </div>

            <div className="space-y-6">
              {currentDimension.questions.map((question) => (
                <div key={question.id} ref={(el) => { if (el) questionRefsMap.current[question.id] = el; }}>
                  <QuestionCard question={question}>
                    {question.type === "scale" ? (
                      <ScaleResponse levels={question.levels || []} value={answers[question.id]} onChange={(value) => handleAnswer(question.id, value)} disabled={isSaving} />
                    ) : (
                      <TernaryResponse value={answers[question.id]} onChange={(value) => handleAnswer(question.id, value)} disabled={isSaving} />
                    )}
                  </QuestionCard>
                </div>
              ))}
            </div>

            <div className="mt-12 flex gap-4 justify-between sticky bottom-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 px-4 py-3">
              <Button onClick={handlePreviousDimension} disabled={currentDimensionIndex === 0 || isSaving} variant="outline" className="px-6 py-2">
                ← Dimensão Anterior
              </Button>
              {isLastDimension ? (
                <Button onClick={handleFinalize} disabled={!allQuestionsAnswered || isSaving} className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white">
                  {isSaving ? "Salvando..." : "✓ Finalizar Assessment"}
                </Button>
              ) : (
                <Button onClick={handleNextDimension} disabled={!allQuestionsAnswered || isSaving} className="px-6 py-2">
                  Próxima Dimensão →
                </Button>
              )}
            </div>
          </main>

          <SaveIndicator status={saveStatus} message={saveMessage} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
