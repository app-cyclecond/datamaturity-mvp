import {
  AssessmentQuestion,
  assessmentDimensions,
  maturityLevels,
} from "./questions";

export function getMaturityLevel(score: number): string {
  if (score < 2) return "Inexistente";
  if (score < 3) return "Inicial";
  if (score < 4) return "Estruturado";
  if (score < 4.5) return "Gerenciado";
  return "Otimizado";
}

export function getLevelDescription(level: string): string {
  switch (level) {
    case "Inexistente":
      return "Sua empresa ainda não possui uma base minimamente estruturada para gestão de dados. O foco agora deve ser construir fundamentos simples, claros e sustentáveis.";
    case "Inicial":
      return "Sua empresa já iniciou a jornada, mas ainda depende muito de esforços isolados. O próximo passo é organizar, padronizar e reduzir dependência de pessoas-chave.";
    case "Estruturado":
      return "Sua empresa já tem capacidades relevantes em dados, mas ainda falta consistência, escala e maior integração entre processos, tecnologia e governança.";
    case "Gerenciado":
      return "Sua empresa já opera com boa maturidade em dados e possui bases sólidas. O foco agora deve ser otimização contínua, automação e geração ampliada de valor.";
    case "Otimizado":
      return "Sua empresa trata dados como ativo estratégico e competitivo. O desafio passa a ser manter excelência, evoluir continuamente e ampliar diferenciais frente ao mercado.";
    default:
      return "";
  }
}

export interface DimensionResult {
  dimension: string;
  score: number;
  level: string;
}

export function calculateDimensionResults(
  questions: AssessmentQuestion[],
  answers: Record<string, number>
): DimensionResult[] {
  const grouped: Record<string, number[]> = {};

  questions.forEach((question) => {
    const answer = answers[question.id];
    if (typeof answer !== "number") return;

    if (!grouped[question.dimension]) {
      grouped[question.dimension] = [];
    }
    grouped[question.dimension].push(answer);
  });

  return Object.entries(grouped)
    .map(([dimension, values]) => {
      const score = values.reduce((sum, val) => sum + val, 0) / values.length;
      return {
        dimension,
        score,
        level: getMaturityLevel(score),
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function calculateOverallScore(answers: Record<string, number>): number {
  const values = Object.values(answers);
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function getStrongestDimensionMessage(
  dimension: DimensionResult | null
): string {
  if (!dimension) {
    return "Ainda não foi possível identificar um ponto forte.";
  }

  const messages: Record<string, string> = {
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

  return `${messages[dimension.dimension] ?? "Essa dimensão aparece como o principal ponto forte da organização."} Score atual: ${dimension.score.toFixed(1)}.`;
}

export function getWeakestDimensionMessage(
  dimension: DimensionResult | null
): string {
  if (!dimension) {
    return "Ainda não foi possível identificar um principal gap.";
  }

  const messages: Record<string, string> = {
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

  return `${messages[dimension.dimension] ?? "Essa dimensão aparece como o principal gap da organização."} Score atual: ${dimension.score.toFixed(1)}.`;
}

export function getNextStepMessage(
  strongest: DimensionResult | null,
  weakest: DimensionResult | null
): string {
  if (!weakest) {
    return "Conclua o assessment para receber uma recomendação mais precisa.";
  }

  const actions: Record<string, string> = {
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

  const baseAction =
    actions[weakest.dimension] ??
    "Priorize a evolução da dimensão com menor score.";

  if (!strongest) {
    return baseAction;
  }

  return `${baseAction} Você pode usar a força atual em ${strongest.dimension} como alavanca para acelerar essa evolução.`;
}
