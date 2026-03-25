"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Zap,
  Lock,
  Brain,
  Target,
  Database,
  BarChart3,
  Lightbulb,
  ChevronRight,
} from "lucide-react";

type DemoQuestion = {
  id: string;
  dimension: string;
  question: string;
  description: string;
  options: { value: number; label: string; description: string }[];
};

const DEMO_QUESTIONS: DemoQuestion[] = [
  {
    id: "q1",
    dimension: "Estratégia",
    question: "Sua empresa tem uma estratégia de dados clara e documentada?",
    description: "Avaliamos se há alinhamento entre objetivos de negócio e iniciativas de dados",
    options: [
      { value: 1, label: "Não existe", description: "Sem estratégia formal" },
      { value: 2, label: "Inicial", description: "Primeiras tentativas" },
      { value: 3, label: "Estruturado", description: "Documentado e comunicado" },
      { value: 4, label: "Gerenciado", description: "Monitorado regularmente" },
      { value: 5, label: "Otimizado", description: "Continuamente melhorado" },
    ],
  },
  {
    id: "q2",
    dimension: "Arquitetura",
    question: "Como está a infraestrutura de dados da sua empresa?",
    description: "Avaliamos escalabilidade, integração e qualidade da arquitetura",
    options: [
      { value: 1, label: "Caótica", description: "Silos desconectados" },
      { value: 2, label: "Básica", description: "Alguns pipelines manuais" },
      { value: 3, label: "Integrada", description: "Pipelines automatizados" },
      { value: 4, label: "Escalável", description: "Pronta para crescimento" },
      { value: 5, label: "Enterprise", description: "Nível corporativo" },
    ],
  },
  {
    id: "q3",
    dimension: "Governança",
    question: "Quem é responsável pelos dados na sua organização?",
    description: "Avaliamos clareza de papéis, responsabilidades e processos",
    options: [
      { value: 1, label: "Ninguém", description: "Sem proprietários" },
      { value: 2, label: "Ad-hoc", description: "Responsabilidade informal" },
      { value: 3, label: "Definido", description: "Papéis claros" },
      { value: 4, label: "Formalizado", description: "Processos documentados" },
      { value: 5, label: "Integrado", description: "Parte da cultura" },
    ],
  },
  {
    id: "q4",
    dimension: "Qualidade",
    question: "Como você garante a qualidade e confiabilidade dos dados?",
    description: "Avaliamos validações, monitoramento e tratamento de erros",
    options: [
      { value: 1, label: "Não há", description: "Sem validação" },
      { value: 2, label: "Manual", description: "Verificações pontuais" },
      { value: 3, label: "Automatizado", description: "Validações básicas" },
      { value: 4, label: "Monitorado", description: "Alertas em tempo real" },
      { value: 5, label: "Proativo", description: "Previsão de problemas" },
    ],
  },
  {
    id: "q5",
    dimension: "Analytics",
    question: "Como sua empresa usa dados para tomar decisões?",
    description: "Avaliamos adoção de BI, analytics e inteligência de negócios",
    options: [
      { value: 1, label: "Não usa", description: "Decisões intuitivas" },
      { value: 2, label: "Inicial", description: "Alguns relatórios" },
      { value: 3, label: "Estruturado", description: "Dashboards regulares" },
      { value: 4, label: "Avançado", description: "Análises preditivas" },
      { value: 5, label: "Inteligente", description: "IA e ML integrados" },
    ],
  },
];

export default function DemoPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<"intro" | "questions" | "results">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentQuestion = DEMO_QUESTIONS[currentQuestionIndex];
  const progress = Math.round(((currentQuestionIndex + 1) / DEMO_QUESTIONS.length) * 100);
  const averageScore = Object.values(answers).length > 0
    ? Math.round((Object.values(answers).reduce((a, b) => a + b, 0) / Object.values(answers).length) * 10) / 10
    : 0;

  const handleAnswer = (value: number) => {
    setIsAnimating(true);
    setAnswers({ ...answers, [currentQuestion.id]: value });

    setTimeout(() => {
      if (currentQuestionIndex < DEMO_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setCurrentStep("results");
      }
      setIsAnimating(false);
    }, 300);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleStartFull = () => {
    router.push("/signup?redirect=assessment");
  };

  const getLevelColor = (value: number) => {
    if (value <= 1) return "text-red-600";
    if (value <= 2) return "text-orange-600";
    if (value <= 3) return "text-yellow-600";
    if (value <= 4) return "text-blue-600";
    return "text-green-600";
  };

  const getLevelLabel = (value: number) => {
    if (value <= 1) return "Inexistente";
    if (value <= 2) return "Inicial";
    if (value <= 3) return "Estruturado";
    if (value <= 4) return "Gerenciado";
    return "Otimizado";
  };

  const getRecommendation = (score: number) => {
    if (score <= 1.5) return "Sua empresa está nos estágios iniciais. Há muito potencial de crescimento!";
    if (score <= 2.5) return "Você tem uma base, mas há gaps significativos a preencher.";
    if (score <= 3.5) return "Bom progresso! Foco em consolidação e otimização.";
    if (score <= 4.5) return "Excelente maturidade! Continue evoluindo para o nível enterprise.";
    return "Parabéns! Você está no topo da maturidade de dados.";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* HEADER */}
      <header className="fixed top-0 w-full border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
              DM
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              DataMaturity
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition">
              Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* INTRO STEP */}
      {currentStep === "intro" && (
        <div className="pt-32 pb-20 px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2">
              <Zap className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Demo Interativa Gratuita</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Descubra seu nível de <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Maturidade em Dados</span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Responda 5 perguntas estratégicas e receba uma avaliação inicial do seu nível de maturidade em dados. 
              Leva apenas <span className="font-semibold text-white">3 minutos</span>.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-12">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur">
                <Brain className="h-8 w-8 text-blue-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">Análise Inteligente</h3>
                <p className="text-sm text-slate-400">Baseado em frameworks globais</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur">
                <Lightbulb className="h-8 w-8 text-yellow-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">Insights Acionáveis</h3>
                <p className="text-sm text-slate-400">Recomendações práticas</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur">
                <Lock className="h-8 w-8 text-green-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">100% Privado</h3>
                <p className="text-sm text-slate-400">Sem compartilhamento de dados</p>
              </div>
            </div>

            <Button
              onClick={() => setCurrentStep("questions")}
              size="lg"
              className="h-14 px-8 text-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/50"
            >
              Começar Avaliação Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <p className="mt-6 text-sm text-slate-400">
              ✓ Sem necessidade de cadastro • ✓ Resultado imediato • ✓ Sem compromisso
            </p>
          </div>
        </div>
      )}

      {/* QUESTIONS STEP */}
      {currentStep === "questions" && (
        <div className="pt-32 pb-20 px-6">
          <div className="mx-auto max-w-2xl">
            {/* PROGRESS BAR */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-400">Pergunta {currentQuestionIndex + 1} de {DEMO_QUESTIONS.length}</p>
                  <h2 className="text-3xl font-bold text-white mt-2">{currentQuestion.question}</h2>
                  <p className="text-slate-400 mt-2">{currentQuestion.description}</p>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">{progress}% completo</p>
            </div>

            {/* OPTIONS */}
            <div
              ref={containerRef}
              className={`space-y-3 transition-all duration-300 ${isAnimating ? "opacity-50" : "opacity-100"}`}
            >
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  disabled={isAnimating}
                  className="w-full text-left p-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 hover:border-blue-500 hover:bg-slate-800 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-white group-hover:text-blue-400 transition">
                        {option.label}
                      </h4>
                      <p className="text-sm text-slate-400 mt-1">{option.description}</p>
                    </div>
                    <div className="h-6 w-6 rounded-full border-2 border-slate-600 group-hover:border-blue-500 flex items-center justify-center flex-shrink-0 ml-4">
                      <div className="h-2 w-2 rounded-full bg-slate-600 group-hover:bg-blue-500 transition" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* NAVIGATION */}
            <div className="flex gap-4 mt-12">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              <div className="flex-1 text-right text-sm text-slate-400 flex items-center justify-end">
                {Object.keys(answers).length} de {DEMO_QUESTIONS.length} respondidas
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULTS STEP */}
      {currentStep === "results" && (
        <div className="pt-32 pb-20 px-6">
          <div className="mx-auto max-w-2xl">
            {/* SCORE CARD */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-12 mb-12 text-center">
              <p className="text-sm font-medium text-slate-400 mb-4">Seu Score de Maturidade</p>
              <div className="mb-6">
                <div className={`text-7xl font-bold ${getLevelColor(averageScore)}`}>
                  {averageScore}
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-700/50 px-4 py-2 mb-6">
                <CheckCircle2 className={`h-5 w-5 ${getLevelColor(averageScore)}`} />
                <span className="font-semibold text-white">{getLevelLabel(averageScore)}</span>
              </div>
              <p className="text-lg text-slate-300 leading-relaxed">
                {getRecommendation(averageScore)}
              </p>
            </div>

            {/* DETAILED RESULTS */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-6">Seus Resultados Detalhados</h3>
              <div className="space-y-4">
                {DEMO_QUESTIONS.map((q) => (
                  <div key={q.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-slate-400">{q.dimension}</p>
                        <h4 className="text-white font-semibold mt-1">{q.question}</h4>
                      </div>
                      <div className={`text-3xl font-bold ${getLevelColor(answers[q.id] || 0)}`}>
                        {answers[q.id] || 0}
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          answers[q.id] <= 1 ? "bg-red-500" :
                          answers[q.id] <= 2 ? "bg-orange-500" :
                          answers[q.id] <= 3 ? "bg-yellow-500" :
                          answers[q.id] <= 4 ? "bg-blue-500" :
                          "bg-green-500"
                        }`}
                        style={{ width: `${(answers[q.id] || 0) * 20}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LIBRARY PREVIEW */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-6">Materiais Exclusivos que Você Teria Acesso</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {/* TÉCNICO */}
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/30 rounded-xl p-6 hover:border-blue-500/60 transition group cursor-pointer">
                  <div className="h-10 w-10 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition">
                    <Database className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Guia de Arquitetura de Dados Moderna</h4>
                  <p className="text-sm text-slate-400 mb-4">Estrutura recomendada para implementar uma arquitetura de dados escalável e resiliente.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">Técnico</span>
                    <ArrowRight className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition" />
                  </div>
                </div>

                {/* REGULATÓRIO */}
                <div className="bg-gradient-to-br from-red-600/20 to-red-900/20 border border-red-500/30 rounded-xl p-6 hover:border-red-500/60 transition group cursor-pointer">
                  <div className="h-10 w-10 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-500/30 transition">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Conformidade com LGPD</h4>
                  <p className="text-sm text-slate-400 mb-4">Checklist completo de conformidade com a Lei Geral de Proteção de Dados Pessoais.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-red-500/20 text-red-300 px-3 py-1 rounded-full">Regulatório</span>
                    <ArrowRight className="h-4 w-4 text-red-400 group-hover:translate-x-1 transition" />
                  </div>
                </div>

                {/* CULTURA */}
                <div className="bg-gradient-to-br from-green-600/20 to-green-900/20 border border-green-500/30 rounded-xl p-6 hover:border-green-500/60 transition group cursor-pointer">
                  <div className="h-10 w-10 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition">
                    <Users className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Transformação Data-Driven</h4>
                  <p className="text-sm text-slate-400 mb-4">Como transformar a cultura da organização para ser verdadeiramente orientada por dados.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full">Cultura</span>
                    <ArrowRight className="h-4 w-4 text-green-400 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </div>
              <p className="text-center text-slate-400 mt-6 text-sm">
                Estes são apenas 3 dos <span className="font-semibold text-white">40+ materiais</span> que você teria acesso completo
              </p>
            </div>

            {/* UPSELL CTA */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-3">
                Quer uma análise completa?
              </h3>
              <p className="text-slate-300 mb-6">
                Esta é apenas uma prévia! O assessment completo analisa 7 dimensões com mais de 40 perguntas estratégicas, 
                gera um relatório executivo detalhado e compara sua empresa com o mercado.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300">Análise de 7 dimensões</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300">Relatório executivo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300">Benchmarking do mercado</span>
                </div>
              </div>
              <Button
                onClick={handleStartFull}
                size="lg"
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/50"
              >
                Fazer Assessment Completo Grátis
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* BACK BUTTON */}
            <div className="text-center">
              <Button
                onClick={() => {
                  setCurrentStep("intro");
                  setCurrentQuestionIndex(0);
                  setAnswers({});
                }}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Recomeçar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-md py-8 px-6">
        <div className="mx-auto max-w-7xl text-center text-sm text-slate-400">
          <p>DataMaturity © 2024 • Metodologia baseada em DAMA-DMBOK, Gartner e McKinsey</p>
        </div>
      </footer>
    </main>
  );
}
