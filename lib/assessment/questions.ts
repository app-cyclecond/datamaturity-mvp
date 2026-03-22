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
  },
  {
    id: "SG2",
    dimension: "Estratégia & Governança",
    text: "Existem papéis e responsabilidades bem definidos para a gestão de dados (ex: data owners, stewards)?",
    description:
      "Verifica se há clareza sobre quem é responsável pela qualidade, definição e uso dos dados.",
  },
  {
    id: "SG3",
    dimension: "Estratégia & Governança",
    text: "A priorização de iniciativas de dados é orientada por impacto no negócio?",
    description:
      "Avalia se projetos de dados são definidos com base em valor e não apenas por demanda técnica ou urgência.",
  },
  {
    id: "SG4",
    dimension: "Estratégia & Governança",
    text: "Existe um modelo formal de governança de dados com rituais, fóruns ou comitês estabelecidos?",
    description:
      "Verifica se há estrutura organizacional ativa para tomada de decisão sobre dados.",
  },
  {
    id: "SG5",
    dimension: "Estratégia & Governança",
    text: "Políticas e diretrizes de dados (ex: qualidade, acesso, segurança) estão definidas e são seguidas?",
    description:
      "Avalia a existência e aplicação prática de regras relacionadas ao uso e controle de dados.",
  },
  {
    id: "SG6",
    dimension: "Estratégia & Governança",
    text: "A liderança da empresa utiliza dados de forma consistente para tomada de decisão?",
    description:
      "Mede o nível de influência de dados no nível executivo e estratégico.",
  },
];

export const architectureEngineeringQuestions: AssessmentQuestion[] = [
  {
    id: "AE1",
    dimension: "Arquitetura & Engenharia",
    text: "A organização possui uma arquitetura de dados estruturada (ex: data lake, data warehouse) bem definida?",
    description:
      "Avalia se existe um ambiente centralizado e organizado para armazenamento e processamento de dados.",
  },
  {
    id: "AE2",
    dimension: "Arquitetura & Engenharia",
    text: "Os dados são integrados a partir de múltiplas fontes de forma automatizada?",
    description:
      "Verifica se há pipelines de ingestão automatizados ou se o processo ainda depende de extrações manuais.",
  },
  {
    id: "AE3",
    dimension: "Arquitetura & Engenharia",
    text: "Os pipelines de dados são monitorados e possuem tratamento de falhas estruturado?",
    description:
      "Avalia a existência de monitoramento, alertas e mecanismos de recuperação de falhas.",
  },
  {
    id: "AE4",
    dimension: "Arquitetura & Engenharia",
    text: "A arquitetura de dados é escalável para suportar crescimento de volume e complexidade?",
    description:
      "Verifica se o ambiente foi projetado para crescer sem perda significativa de performance.",
  },
  {
    id: "AE5",
    dimension: "Arquitetura & Engenharia",
    text: "Existe padronização no desenvolvimento de pipelines e modelos de dados?",
    description:
      "Avalia se há boas práticas definidas para evitar soluções inconsistentes ou duplicadas.",
  },
  {
    id: "AE6",
    dimension: "Arquitetura & Engenharia",
    text: "Ambientes de desenvolvimento, teste e produção são bem definidos e separados?",
    description:
      "Verifica maturidade no ciclo de desenvolvimento e controle de mudanças.",
  },
];

export const dataManagementQuestions: AssessmentQuestion[] = [
  {
    id: "DM1",
    dimension: "Gestão de Dados",
    text: "A organização possui um catálogo de dados estruturado e acessível?",
    description:
      "Avalia se existe um repositório central com informações sobre os dados disponíveis na empresa.",
  },
  {
    id: "DM2",
    dimension: "Gestão de Dados",
    text: "Os principais dados possuem definição clara e padronizada (ex: métricas, KPIs)?",
    description:
      "Verifica se há consistência na definição de conceitos de negócio utilizados nos dados.",
  },
  {
    id: "DM3",
    dimension: "Gestão de Dados",
    text: "Existe visibilidade sobre a origem e transformação dos dados (data lineage)?",
    description:
      "Avalia se é possível rastrear de onde os dados vêm e como foram processados.",
  },
  {
    id: "DM4",
    dimension: "Gestão de Dados",
    text: "Os dados possuem responsáveis definidos para sua manutenção e gestão contínua?",
    description:
      "Verifica se há responsáveis claros pela atualização, qualidade e uso dos dados.",
  },
  {
    id: "DM5",
    dimension: "Gestão de Dados",
    text: "Há padronização na nomenclatura e estrutura dos dados em toda a organização?",
    description:
      "Avalia se existe consistência na forma como dados são organizados e nomeados.",
  },
  {
    id: "DM6",
    dimension: "Gestão de Dados",
    text: "Os dados são facilmente encontrados e compreendidos pelos usuários de negócio?",
    description:
      "Mede o nível de acessibilidade e entendimento dos dados dentro da organização.",
  },
];

export const dataQualityQuestions: AssessmentQuestion[] = [
  {
    id: "DQ1",
    dimension: "Qualidade de Dados",
    text: "Os dados utilizados para análise são consistentes entre diferentes sistemas e relatórios?",
    description:
      "Avalia se há divergências entre fontes de dados ou se os números são confiáveis e alinhados.",
  },
  {
    id: "DQ2",
    dimension: "Qualidade de Dados",
    text: "Os dados possuem nível adequado de completude (ausência de campos vazios ou incompletos)?",
    description:
      "Verifica se as informações estão preenchidas de forma adequada para suportar análises.",
  },
  {
    id: "DQ3",
    dimension: "Qualidade de Dados",
    text: "Existem regras e validações automáticas para garantir a qualidade dos dados?",
    description:
      "Avalia se há controles implementados para evitar erros na entrada ou processamento dos dados.",
  },
  {
    id: "DQ4",
    dimension: "Qualidade de Dados",
    text: "A qualidade dos dados é monitorada continuamente com indicadores ou alertas?",
    description:
      "Verifica se existem métricas e acompanhamento ativo da qualidade dos dados.",
  },
  {
    id: "DQ5",
    dimension: "Qualidade de Dados",
    text: "Problemas de qualidade de dados são identificados e corrigidos de forma estruturada?",
    description:
      "Avalia se há processos claros para tratar inconsistências e erros.",
  },
  {
    id: "DQ6",
    dimension: "Qualidade de Dados",
    text: "Os usuários confiam nos dados para tomada de decisão?",
    description:
      "Mede a percepção de confiabilidade dos dados dentro da organização.",
  },
];

export const analyticsValueQuestions: AssessmentQuestion[] = [
  {
    id: "AV1",
    dimension: "Analytics & Valor",
    text: "A organização utiliza dashboards e relatórios de forma consistente no dia a dia?",
    description:
      "Avalia se ferramentas de BI são amplamente utilizadas ou se ainda são pontuais.",
  },
  {
    id: "AV2",
    dimension: "Analytics & Valor",
    text: "Decisões importantes são tomadas com base em dados e não apenas em intuição?",
    description:
      "Verifica o grau de uso de dados no processo decisório.",
  },
  {
    id: "AV3",
    dimension: "Analytics & Valor",
    text: "Existem casos de uso de analytics que geram impacto mensurável no negócio?",
    description:
      "Avalia se há iniciativas que efetivamente trazem resultados concretos (ex: redução de custos, aumento de receita).",
  },
  {
    id: "AV4",
    dimension: "Analytics & Valor",
    text: "A organização acompanha o retorno (ROI) das iniciativas de dados e analytics?",
    description:
      "Verifica se existe mensuração de valor gerado pelas iniciativas.",
  },
  {
    id: "AV5",
    dimension: "Analytics & Valor",
    text: "Os dados são utilizados de forma proativa para identificar oportunidades e riscos?",
    description:
      "Avalia se o uso de dados é reativo ou antecipatório.",
  },
  {
    id: "AV6",
    dimension: "Analytics & Valor",
    text: "As áreas de negócio possuem autonomia para explorar dados e gerar insights?",
    description:
      "Mede o nível de independência das áreas no uso de dados.",
  },
];

export const cultureLiteracyQuestions: AssessmentQuestion[] = [
  {
    id: "CL1",
    dimension: "Cultura & Literacy",
    text: "Os colaboradores utilizam dados com frequência em suas atividades diárias?",
    description:
      "Avalia o nível de adoção de dados no trabalho cotidiano.",
  },
  {
    id: "CL2",
    dimension: "Cultura & Literacy",
    text: "Os colaboradores possuem conhecimento básico para interpretar dados e indicadores?",
    description:
      "Verifica o nível de alfabetização em dados (data literacy) na organização.",
  },
  {
    id: "CL3",
    dimension: "Cultura & Literacy",
    text: "A empresa promove treinamentos e capacitação em dados e analytics?",
    description:
      "Avalia se há iniciativas estruturadas para desenvolver habilidades relacionadas a dados.",
  },
  {
    id: "CL4",
    dimension: "Cultura & Literacy",
    text: "Existe incentivo para o uso de dados na tomada de decisão em todos os níveis da organização?",
    description:
      "Verifica se a cultura organizacional estimula decisões baseadas em dados.",
  },
  {
    id: "CL5",
    dimension: "Cultura & Literacy",
    text: "As lideranças incentivam e utilizam dados como referência em suas decisões?",
    description:
      "Avalia o papel da liderança na disseminação da cultura data-driven.",
  },
  {
    id: "CL6",
    dimension: "Cultura & Literacy",
    text: "O uso de dados é visto como parte natural do trabalho, e não como uma obrigação adicional?",
    description:
      "Mede o nível de maturidade cultural em relação ao uso de dados.",
  },
];

export const aiAdvancedQuestions: AssessmentQuestion[] = [
  {
    id: "AI1",
    dimension: "IA & Advanced Analytics",
    text: "A organização utiliza modelos analíticos avançados (ex: machine learning) em seus processos?",
    description:
      "Avalia se há uso de técnicas avançadas além de análises descritivas.",
  },
  {
    id: "AI2",
    dimension: "IA & Advanced Analytics",
    text: "Existem modelos preditivos que apoiam a antecipação de eventos ou resultados?",
    description:
      "Verifica se a empresa consegue prever cenários com base em dados históricos.",
  },
  {
    id: "AI3",
    dimension: "IA & Advanced Analytics",
    text: "Soluções de inteligência artificial estão integradas aos processos de negócio?",
    description:
      "Avalia se a IA está incorporada de forma prática e operacional.",
  },
  {
    id: "AI4",
    dimension: "IA & Advanced Analytics",
    text: "Decisões operacionais são automatizadas com base em dados e modelos analíticos?",
    description:
      "Verifica o nível de automação e uso de algoritmos na tomada de decisão.",
  },
  {
    id: "AI5",
    dimension: "IA & Advanced Analytics",
    text: "A organização explora tecnologias de IA generativa para aumentar produtividade ou inovação?",
    description:
      "Avalia o uso de ferramentas modernas de IA no dia a dia.",
  },
  {
    id: "AI6",
    dimension: "IA & Advanced Analytics",
    text: "Existe uma estratégia clara para evolução do uso de IA na organização?",
    description:
      "Verifica se o uso de IA é estruturado ou apenas experimental.",
  },
];

export const assessmentQuestions: AssessmentQuestion[] = [
  ...strategyGovernanceQuestions,
  ...architectureEngineeringQuestions,
  ...dataManagementQuestions,
  ...dataQualityQuestions,
  ...analyticsValueQuestions,
  ...cultureLiteracyQuestions,
  ...aiAdvancedQuestions,
];

export const assessmentDimensions: AssessmentDimension[] = [
  "Estratégia & Governança",
  "Arquitetura & Engenharia",
  "Gestão de Dados",
  "Qualidade de Dados",
  "Analytics & Valor",
  "Cultura & Literacy",
  "IA & Advanced Analytics",
];