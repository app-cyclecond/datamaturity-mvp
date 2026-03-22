export type AssessmentDimension =
  | "Estratégia & Governança"
  | "Arquitetura & Engenharia"
  | "Gestão de Dados"
  | "Qualidade de Dados"
  | "Analytics & Valor"
  | "Cultura & Literacy"
  | "IA & Advanced Analytics";

export interface AssessmentQuestion {
  id: string;
  dimension: AssessmentDimension;
  text: string;
  description: string;
  type?: "scale" | "ternary";
  levels?: MaturityLevel[];
}

export interface MaturityLevel {
  level: number;
  label: string;
  description: string;
}

export const maturityLevels: MaturityLevel[] = [
  {
    level: 1,
    label: "Inexistente",
    description:
      "A prática não existe ou ocorre de forma totalmente informal, sem qualquer padronização ou controle.",
  },
  {
    level: 2,
    label: "Inicial",
    description:
      "A prática existe de forma pontual e não estruturada, com forte dependência de esforços manuais e pessoas específicas.",
  },
  {
    level: 3,
    label: "Estruturado",
    description:
      "A prática está definida e documentada, com processos estabelecidos, porém ainda com limitações de escala ou consistência.",
  },
  {
    level: 4,
    label: "Gerenciado",
    description:
      "A prática é monitorada, mensurada e executada de forma consistente, com governança clara e capacidade de escala.",
  },
  {
    level: 5,
    label: "Otimizado",
    description:
      "A prática é continuamente aprimorada, altamente automatizada e integrada à estratégia do negócio, gerando vantagem competitiva.",
  },
];

export const strategyGovernanceQuestions: AssessmentQuestion[] = [
  {
    id: "SG1",
    dimension: "Estratégia & Governança",
    text: "A organização possui uma estratégia clara para o uso de dados alinhada aos objetivos do negócio?",
    description:
      "Avalia se existe uma visão formal e comunicada sobre como dados suportam decisões e resultados estratégicos.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "SG2",
    dimension: "Estratégia & Governança",
    text: "Existem papéis e responsabilidades bem definidos para a gestão de dados (ex: data owners, stewards)?",
    description:
      "Verifica se há clareza sobre quem é responsável pela qualidade, definição e uso dos dados.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "SG3",
    dimension: "Estratégia & Governança",
    text: "A priorização de iniciativas de dados é orientada por impacto no negócio?",
    description:
      "Avalia se projetos de dados são definidos com base em valor e não apenas por demanda técnica ou urgência.",
    type: "ternary",
  },
  {
    id: "SG4",
    dimension: "Estratégia & Governança",
    text: "Existe um modelo formal de governança de dados com rituais, fóruns ou comitês estabelecidos?",
    description:
      "Verifica se há estrutura organizacional ativa para tomada de decisão sobre dados.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "SG5",
    dimension: "Estratégia & Governança",
    text: "Políticas e diretrizes de dados (ex: qualidade, acesso, segurança) estão definidas e são seguidas?",
    description:
      "Avalia a existência e aplicação prática de regras relacionadas ao uso e controle de dados.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "SG6",
    dimension: "Estratégia & Governança",
    text: "A liderança da empresa utiliza dados de forma consistente para tomada de decisão?",
    description:
      "Mede o nível de influência de dados no nível executivo e estratégico.",
    type: "ternary",
  },
];

export const architectureEngineeringQuestions: AssessmentQuestion[] = [
  {
    id: "AE1",
    dimension: "Arquitetura & Engenharia",
    text: "A organização possui uma arquitetura de dados estruturada (ex: data lake, data warehouse) bem definida?",
    description:
      "Avalia se existe um ambiente centralizado e organizado para armazenamento e processamento de dados.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "AE2",
    dimension: "Arquitetura & Engenharia",
    text: "Os dados são integrados a partir de múltiplas fontes de forma automatizada?",
    description:
      "Verifica se há pipelines de ingestão automatizados ou se o processo ainda depende de extrações manuais.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "AE3",
    dimension: "Arquitetura & Engenharia",
    text: "Os pipelines de dados são monitorados e possuem tratamento de falhas estruturado?",
    description:
      "Avalia a existência de monitoramento, alertas e mecanismos de recuperação de falhas.",
    type: "ternary",
  },
  {
    id: "AE4",
    dimension: "Arquitetura & Engenharia",
    text: "A arquitetura de dados é escalável para suportar crescimento de volume e complexidade?",
    description:
      "Verifica se o ambiente foi projetado para crescer sem perda significativa de performance.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "AE5",
    dimension: "Arquitetura & Engenharia",
    text: "Existe padronização no desenvolvimento de pipelines e modelos de dados?",
    description:
      "Avalia se há boas práticas definidas para evitar soluções inconsistentes ou duplicadas.",
    type: "ternary",
  },
  {
    id: "AE6",
    dimension: "Arquitetura & Engenharia",
    text: "Ambientes de desenvolvimento, teste e produção são bem definidos e separados?",
    description:
      "Verifica maturidade no ciclo de desenvolvimento e controle de mudanças.",
    type: "scale",
    levels: maturityLevels,
  },
];

export const dataManagementQuestions: AssessmentQuestion[] = [
  {
    id: "DM1",
    dimension: "Gestão de Dados",
    text: "A organização possui um catálogo de dados estruturado e acessível?",
    description:
      "Avalia se existe um repositório central com informações sobre os dados disponíveis na empresa.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "DM2",
    dimension: "Gestão de Dados",
    text: "Os principais dados possuem definição clara e padronizada (ex: métricas, KPIs)?",
    description:
      "Verifica se há consistência na definição de conceitos de negócio utilizados nos dados.",
    type: "ternary",
  },
  {
    id: "DM3",
    dimension: "Gestão de Dados",
    text: "Existe visibilidade sobre a origem e transformação dos dados (data lineage)?",
    description:
      "Avalia se é possível rastrear de onde os dados vêm e como foram processados.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "DM4",
    dimension: "Gestão de Dados",
    text: "Os dados possuem responsáveis definidos para sua manutenção e gestão contínua?",
    description:
      "Verifica se há responsáveis claros pela atualização, qualidade e uso dos dados.",
    type: "ternary",
  },
  {
    id: "DM5",
    dimension: "Gestão de Dados",
    text: "Há padronização na nomenclatura e estrutura dos dados em toda a organização?",
    description:
      "Avalia se existe consistência na forma como dados são organizados e nomeados.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "DM6",
    dimension: "Gestão de Dados",
    text: "Os dados são facilmente encontrados e compreendidos pelos usuários de negócio?",
    description:
      "Mede o nível de acessibilidade e entendimento dos dados dentro da organização.",
    type: "ternary",
  },
];

export const dataQualityQuestions: AssessmentQuestion[] = [
  {
    id: "DQ1",
    dimension: "Qualidade de Dados",
    text: "Os dados utilizados para análise são consistentes entre diferentes sistemas e relatórios?",
    description:
      "Avalia se há divergências entre fontes de dados ou se os números são confiáveis e alinhados.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "DQ2",
    dimension: "Qualidade de Dados",
    text: "Os dados possuem nível adequado de completude (ausência de campos vazios ou incompletos)?",
    description:
      "Verifica se as informações estão preenchidas de forma adequada para suportar análises.",
    type: "ternary",
  },
  {
    id: "DQ3",
    dimension: "Qualidade de Dados",
    text: "Existem regras e validações automáticas para garantir a qualidade dos dados?",
    description:
      "Avalia se há controles implementados para evitar erros na entrada ou processamento dos dados.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "DQ4",
    dimension: "Qualidade de Dados",
    text: "A qualidade dos dados é monitorada continuamente com indicadores ou alertas?",
    description:
      "Verifica se existem métricas e acompanhamento ativo da qualidade dos dados.",
    type: "ternary",
  },
  {
    id: "DQ5",
    dimension: "Qualidade de Dados",
    text: "Problemas de qualidade de dados são identificados e corrigidos de forma estruturada?",
    description:
      "Avalia se há processos claros para tratar inconsistências e erros.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "DQ6",
    dimension: "Qualidade de Dados",
    text: "Os usuários confiam nos dados para tomada de decisão?",
    description:
      "Mede a percepção de confiabilidade dos dados dentro da organização.",
    type: "ternary",
  },
];

export const analyticsValueQuestions: AssessmentQuestion[] = [
  {
    id: "AV1",
    dimension: "Analytics & Valor",
    text: "A organização utiliza dashboards e relatórios de forma consistente no dia a dia?",
    description:
      "Avalia se ferramentas de BI são amplamente utilizadas ou se ainda são pontuais.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "AV2",
    dimension: "Analytics & Valor",
    text: "Decisões importantes são tomadas com base em dados e não apenas em intuição?",
    description:
      "Verifica o grau de uso de dados no processo decisório.",
    type: "ternary",
  },
  {
    id: "AV3",
    dimension: "Analytics & Valor",
    text: "Existem casos de uso de analytics que geram impacto mensurável no negócio?",
    description:
      "Avalia se há iniciativas que efetivamente trazem resultados concretos (ex: redução de custos, aumento de receita).",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "AV4",
    dimension: "Analytics & Valor",
    text: "A organização acompanha o retorno (ROI) das iniciativas de dados e analytics?",
    description:
      "Verifica se existe mensuração de valor gerado pelas iniciativas.",
    type: "ternary",
  },
  {
    id: "AV5",
    dimension: "Analytics & Valor",
    text: "Os dados são utilizados de forma proativa para identificar oportunidades e riscos?",
    description:
      "Avalia se o uso de dados é reativo ou antecipatório.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "AV6",
    dimension: "Analytics & Valor",
    text: "As áreas de negócio possuem autonomia para explorar dados e gerar insights?",
    description:
      "Mede o nível de independência das áreas no uso de dados.",
    type: "ternary",
  },
];

export const cultureLiteracyQuestions: AssessmentQuestion[] = [
  {
    id: "CL1",
    dimension: "Cultura & Literacy",
    text: "Os colaboradores utilizam dados com frequência em suas atividades diárias?",
    description:
      "Avalia o nível de adoção de dados no trabalho cotidiano.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "CL2",
    dimension: "Cultura & Literacy",
    text: "Os colaboradores possuem conhecimento básico para interpretar dados e indicadores?",
    description:
      "Verifica o nível de alfabetização em dados (data literacy) na organização.",
    type: "ternary",
  },
  {
    id: "CL3",
    dimension: "Cultura & Literacy",
    text: "A empresa promove treinamentos e capacitação em dados e analytics?",
    description:
      "Avalia se há iniciativas estruturadas para desenvolver habilidades relacionadas a dados.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "CL4",
    dimension: "Cultura & Literacy",
    text: "Existe incentivo para o uso de dados na tomada de decisão em todos os níveis da organização?",
    description:
      "Verifica se a cultura organizacional estimula decisões baseadas em dados.",
    type: "ternary",
  },
  {
    id: "CL5",
    dimension: "Cultura & Literacy",
    text: "As lideranças incentivam e utilizam dados como base para decisões estratégicas?",
    description:
      "Avalia se há exemplo vindo de cima para baixo no uso de dados.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "CL6",
    dimension: "Cultura & Literacy",
    text: "A organização investe em desenvolvimento de habilidades técnicas em dados (Python, SQL, etc)?",
    description:
      "Verifica se há investimento em capacitação técnica dos colaboradores.",
    type: "ternary",
  },
];

export const aiAdvancedAnalyticsQuestions: AssessmentQuestion[] = [
  {
    id: "IA1",
    dimension: "IA & Advanced Analytics",
    text: "A organização utiliza modelos de machine learning ou IA em produção?",
    description:
      "Avalia se há iniciativas de IA/ML já implementadas e em uso.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "IA2",
    dimension: "IA & Advanced Analytics",
    text: "Existem processos estruturados para desenvolvimento e validação de modelos de IA?",
    description:
      "Verifica se há metodologia e governança para projetos de IA.",
    type: "ternary",
  },
  {
    id: "IA3",
    dimension: "IA & Advanced Analytics",
    text: "Os modelos de IA são monitorados e atualizados regularmente?",
    description:
      "Avalia se há manutenção contínua dos modelos em produção.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "IA4",
    dimension: "IA & Advanced Analytics",
    text: "Há expertise interna em data science e machine learning?",
    description:
      "Verifica se há profissionais qualificados para trabalhar com IA.",
    type: "ternary",
  },
  {
    id: "IA5",
    dimension: "IA & Advanced Analytics",
    text: "A organização avalia e gerencia riscos éticos e de viés em modelos de IA?",
    description:
      "Avalia a maturidade em governança responsável de IA.",
    type: "scale",
    levels: maturityLevels,
  },
  {
    id: "IA6",
    dimension: "IA & Advanced Analytics",
    text: "Modelos de IA geram valor mensurável e impacto no negócio?",
    description:
      "Verifica se há ROI comprovado em iniciativas de IA.",
    type: "ternary",
  },
];

// ✅ CONSTANTE DIMENSIONS - AGRUPA TODAS AS DIMENSÕES
export interface DimensionData {
  id: string;
  name: string;
  description: string;
  questions: AssessmentQuestion[];
}

export const DIMENSIONS: DimensionData[] = [
  {
    id: "strategy-governance",
    name: "Estratégia & Governança",
    description: "Avalia a maturidade em estratégia, governança e alinhamento de dados com objetivos do negócio.",
    questions: strategyGovernanceQuestions,
  },
  {
    id: "architecture-engineering",
    name: "Arquitetura & Engenharia",
    description: "Avalia a maturidade da infraestrutura, pipelines de dados e arquitetura técnica.",
    questions: architectureEngineeringQuestions,
  },
  {
    id: "data-management",
    name: "Gestão de Dados",
    description: "Avalia a maturidade em catalogação, documentação e gestão de dados.",
    questions: dataManagementQuestions,
  },
  {
    id: "data-quality",
    name: "Qualidade de Dados",
    description: "Avalia a maturidade em qualidade, consistência e confiabilidade dos dados.",
    questions: dataQualityQuestions,
  },
  {
    id: "analytics-value",
    name: "Analytics & Valor",
    description: "Avalia a maturidade em geração de valor através de analytics e BI.",
    questions: analyticsValueQuestions,
  },
  {
    id: "culture-literacy",
    name: "Cultura & Literacy",
    description: "Avalia a maturidade em cultura de dados e alfabetização dos colaboradores.",
    questions: cultureLiteracyQuestions,
  },
  {
    id: "ai-advanced",
    name: "IA & Advanced Analytics",
    description: "Avalia a maturidade em IA, machine learning e advanced analytics.",
    questions: aiAdvancedAnalyticsQuestions,
  },
];