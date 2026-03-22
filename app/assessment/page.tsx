"use client";

import { useEffect, useRef, useState } from "react";
import {
  assessmentQuestions,
  maturityLevels,
} from "@/lib/assessment/questions";

type DimensionResult = {
  dimension: string;
  score: number;
  level: string;
};

type DiagnosisSummary = {
  strongest: DimensionResult | null;
  weakest: DimensionResult | null;
  strongestMessage: string;
  weakestMessage: string;
  nextStepMessage: string;
};

export default function AssessmentPage() {
  const flatQuestions = assessmentQuestions ?? [];
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const hasSavedResult = useRef(false);

  const question = flatQuestions[current];

  const progress =
    flatQuestions.length > 0
      ? Math.round(((current + 1) / flatQuestions.length) * 100)
      : 0;

  function handleAnswer(value: number) {
    if (!question) return;

    setAnswers((prev) => ({
      ...prev,
      [question.id]: value,
    }));
  }

  function next() {
    if (flatQuestions.length === 0) return;

    if (current === flatQuestions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrent((prev) => prev + 1);
  }

  function prev() {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
    }
  }

  function calculateScore() {
    const values = Object.values(answers);

    if (values.length === 0) return 0;

    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  function getLevel(score: number) {
    if (score < 2) return "Inexistente";
    if (score < 3) return "Inicial";
    if (score < 4) return "Intermediário";
    if (score < 4.5) return "Avançado";
    return "Otimizado";
  }

  function calculateDimensionResults(): DimensionResult[] {
    const grouped: Record<string, number[]> = {};

    flatQuestions.forEach((item) => {
      const answer = answers[item.id];

      if (typeof answer !== "number") return;

      if (!grouped[item.dimension]) {
        grouped[item.dimension] = [];
      }

      grouped[item.dimension].push(answer);
    });

    return Object.entries(grouped)
      .map(([dimension, values]) => {
        const score =
          values.reduce((sum, value) => sum + value, 0) / values.length;

        return {
          dimension,
          score,
          level: getLevel(score),
        };
      })
      .sort((a, b) => b.score - a.score);
  }

  const score = calculateScore();
  const level = getLevel(score);
  const levelDescription = getLevelDescription(level);
  const dimensionResults = calculateDimensionResults();
  const diagnosisSummary = buildDiagnosisSummary(dimensionResults);

  useEffect(() => {
    async function saveResult() {
      try {
        await fetch("/api/assessment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            score,
            level,
            dimensionScores: dimensionResults,
          }),
        });
      } catch (e) {
        console.error("Erro ao salvar:", e);
      }
    }

    if (finished && !hasSavedResult.current) {
      hasSavedResult.current = true;
      saveResult();
    }
  }, [finished, score, level, dimensionResults]);

  if (flatQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Nenhuma pergunta encontrada
          </h1>
          <p className="text-gray-600">
            Verifique se o arquivo <strong>lib/assessment/questions.ts</strong>{" "}
            está exportando <strong>assessmentQuestions</strong> corretamente.
          </p>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 space-y-6 text-center">
          <h1 className="text-3xl font-bold">Resultado do diagnóstico</h1>

          <div className="text-6xl font-bold">{score.toFixed(1)}</div>

          <div className="text-xl">
            Nível: <strong>{level}</strong>
          </div>

          <div className="rounded-xl bg-gray-100 p-5 text-left">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              Interpretação do resultado
            </p>
            <p className="text-gray-700 leading-relaxed">{levelDescription}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="rounded-xl border border-gray-200 p-5 bg-white">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Ponto forte
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {diagnosisSummary.strongestMessage}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-5 bg-white">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Principal gap
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {diagnosisSummary.weakestMessage}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-5 bg-white">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Próximo passo recomendado
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {diagnosisSummary.nextStepMessage}
              </p>
            </div>
          </div>

          <div className="space-y-3 text-left">
            <div>
              <h2 className="text-xl font-bold">Resultado por dimensão</h2>
              <p className="text-sm text-gray-500">
                Veja onde sua maturidade está mais forte ou mais fraca
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dimensionResults.map((item) => (
                <div
                  key={item.dimension}
                  className="border rounded-xl p-4 bg-white"
                >
                  <p className="text-sm text-gray-500 mb-1">{item.dimension}</p>
                  <p className="text-2xl font-bold">{item.score.toFixed(1)}</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">
                    {item.level}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-gray-600">Resultado salvo com sucesso.</p>

          <button
            onClick={() => {
              setFinished(false);
              setCurrent(0);
              setAnswers({});
              hasSavedResult.current = false;
            }}
            className="px-6 py-3 bg-black text-white rounded-xl"
          >
            Refazer diagnóstico
          </button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Erro ao carregar pergunta
          </h1>
          <p className="text-gray-600">
            Não foi possível encontrar a pergunta atual do assessment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-black text-white p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-300 mb-2">
            DataMaturity Assessment
          </p>
          <h1 className="text-3xl font-bold mb-2">Diagnóstico de maturidade</h1>
          <p className="text-gray-300">
            Responda cada pergunta usando a escala de 1 a 5.
          </p>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>
                Pergunta {current + 1} de {flatQuestions.length}
              </span>
              <span>{progress}%</span>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-black rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              {question.dimension}
            </div>

            <h2 className="text-2xl font-semibold text-gray-900">
              {question.text}
            </h2>

            <p className="text-base text-gray-600 leading-relaxed">
              {question.description}
            </p>
          </div>

          <div className="grid gap-3">
            {maturityLevels.map((item) => (
              <button
                key={item.level}
                type="button"
                onClick={() => handleAnswer(item.level)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  answers[question.id] === item.level
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-900 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                <div className="font-semibold">
                  {item.level}.0 — {item.label}
                </div>

                <div className="text-sm opacity-80">{item.description}</div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={prev}
              disabled={current === 0}
              className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 disabled:opacity-40"
            >
              Voltar
            </button>

            <button
              type="button"
              onClick={next}
              disabled={!answers[question.id]}
              className="px-5 py-3 rounded-xl bg-black text-white disabled:opacity-40"
            >
              {current === flatQuestions.length - 1 ? "Finalizar" : "Próxima"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getLevelDescription(level: string) {
  switch (level) {
    case "Inexistente":
      return "Sua empresa ainda não possui uma base minimamente estruturada para gestão de dados. O foco agora deve ser construir fundamentos simples, claros e sustentáveis.";
    case "Inicial":
      return "Sua empresa já iniciou a jornada, mas ainda depende muito de esforços isolados. O próximo passo é organizar, padronizar e reduzir dependência de pessoas-chave.";
    case "Intermediário":
      return "Sua empresa já tem capacidades relevantes em dados, mas ainda falta consistência, escala e maior integração entre processos, tecnologia e governança.";
    case "Avançado":
      return "Sua empresa já opera com boa maturidade em dados e possui bases sólidas. O foco agora deve ser otimização contínua, automação e geração ampliada de valor.";
    case "Otimizado":
      return "Sua empresa trata dados como ativo estratégico e competitivo. O desafio passa a ser manter excelência, evoluir continuamente e ampliar diferenciais frente ao mercado.";
    default:
      return "";
  }
}

function buildDiagnosisSummary(
  dimensionResults: DimensionResult[]
): DiagnosisSummary {
  if (dimensionResults.length === 0) {
    return {
      strongest: null,
      weakest: null,
      strongestMessage: "Ainda não foi possível identificar um ponto forte.",
      weakestMessage: "Ainda não foi possível identificar um principal gap.",
      nextStepMessage:
        "Conclua o assessment para receber uma recomendação mais precisa.",
    };
  }

  const sorted = [...dimensionResults].sort((a, b) => b.score - a.score);
  const strongest = sorted[0] ?? null;
  const weakest = sorted[sorted.length - 1] ?? null;

  return {
    strongest,
    weakest,
    strongestMessage: buildStrongestMessage(strongest),
    weakestMessage: buildWeakestMessage(weakest),
    nextStepMessage: buildNextStepMessage(strongest, weakest),
  };
}

function buildStrongestMessage(item: DimensionResult | null) {
  if (!item) {
    return "Ainda não foi possível identificar um ponto forte.";
  }

  const dimensionText: Record<string, string> = {
    "Estratégia & Governança":
      "A direção estratégica e a governança de dados parecem estar mais amadurecidas, o que indica maior clareza de prioridades, papéis e tomada de decisão.",
    "Arquitetura & Engenharia":
      "Sua base técnica é um destaque. A arquitetura e engenharia de dados parecem bem estruturadas, criando uma fundação sólida para evolução futura.",
    "Gestão de Dados":
      "A organização e padronização dos dados aparecem como ponto forte, indicando maior controle sobre definições, ownership e entendimento dos ativos de dados.",
    "Qualidade de Dados":
      "A confiabilidade dos dados se destaca. Isso sugere mais consistência, monitoramento e confiança para suportar análises e decisões.",
    "Analytics & Valor":
      "A empresa já demonstra boa capacidade de transformar dados em decisões e impacto real no negócio, o que é um sinal relevante de maturidade.",
    "Cultura & Literacy":
      "A cultura de dados parece ser uma fortaleza, mostrando que as pessoas entendem melhor os indicadores e incorporam dados ao dia a dia.",
    "IA & Advanced Analytics":
      "O uso de analytics avançado e IA aparece acima das demais dimensões, indicando uma organização com visão mais sofisticada de geração de valor.",
  };

  return `${dimensionText[item.dimension] ?? "Essa dimensão aparece como o principal ponto forte da organização."} Score atual: ${item.score.toFixed(1)}.`;
}

function buildWeakestMessage(item: DimensionResult | null) {
  if (!item) {
    return "Ainda não foi possível identificar um principal gap.";
  }

  const dimensionText: Record<string, string> = {
    "Estratégia & Governança":
      "O maior gap está em estratégia e governança. Isso normalmente indica falta de direção clara, ownership definido e mecanismos formais de decisão sobre dados.",
    "Arquitetura & Engenharia":
      "O maior gap está na base técnica. Isso sugere limitações em integração, escalabilidade, automação de pipelines ou disciplina de engenharia.",
    "Gestão de Dados":
      "O maior gap está na organização dos dados. Isso costuma aparecer quando a empresa tem dificuldade para localizar, definir e padronizar seus ativos de dados.",
    "Qualidade de Dados":
      "O maior gap está na qualidade dos dados. Isso sinaliza risco de inconsistência, baixa confiança nos números e dificuldade para sustentar decisões com segurança.",
    "Analytics & Valor":
      "O maior gap está em transformar dados em impacto real. Isso indica que a empresa pode até ter base de dados, mas ainda não converte isso em decisão, ROI e resultado.",
    "Cultura & Literacy":
      "O maior gap está na adoção pelas pessoas. Isso sugere baixa alfabetização de dados, pouca autonomia das áreas e dependência excessiva do time técnico.",
    "IA & Advanced Analytics":
      "O maior gap está no uso avançado de analytics e IA. Isso indica que a organização ainda explora pouco modelos preditivos, automação e aplicações mais sofisticadas.",
  };

  return `${dimensionText[item.dimension] ?? "Essa dimensão aparece como o principal gap da organização."} Score atual: ${item.score.toFixed(1)}.`;
}

function buildNextStepMessage(
  strongest: DimensionResult | null,
  weakest: DimensionResult | null
) {
  if (!weakest) {
    return "Conclua o assessment para receber uma recomendação mais precisa.";
  }

  const weakestAction: Record<string, string> = {
    "Estratégia & Governança":
      "Comece definindo uma direção clara para dados, com papéis, fóruns de decisão e priorização baseada em valor para o negócio.",
    "Arquitetura & Engenharia":
      "Priorize a estruturação da arquitetura e dos pipelines, reduzindo processos manuais e criando uma base mais escalável e confiável.",
    "Gestão de Dados":
      "Estruture catálogo, ownership, definições de KPIs e padronização, para que os dados fiquem mais organizados e utilizáveis.",
    "Qualidade de Dados":
      "Implemente regras de validação, monitoramento e tratamento de falhas, aumentando a confiança e a consistência dos dados.",
    "Analytics & Valor":
      "Selecione poucos casos de uso prioritários com impacto mensurável e conecte analytics diretamente a decisões e resultados do negócio.",
    "Cultura & Literacy":
      "Invista em capacitação e uso prático no dia a dia, para que as áreas ganhem autonomia e passem a decidir melhor com dados.",
    "IA & Advanced Analytics":
      "Estruture uma trilha gradual para analytics avançado e IA, começando por casos simples, bem delimitados e com valor claro.",
  };

  if (!strongest) {
    return weakestAction[weakest.dimension] ?? "Priorize a evolução da dimensão com menor score.";
  }

  return `${weakestAction[weakest.dimension] ?? "Priorize a evolução da dimensão com menor score."} Você pode usar a força atual em ${strongest.dimension} como alavanca para acelerar essa evolução.`;
}