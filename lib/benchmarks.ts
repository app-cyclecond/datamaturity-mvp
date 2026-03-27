// Benchmarking setorial por dimensão
// Fonte: baseado em pesquisas DAMA, Gartner e McKinsey adaptadas para o mercado brasileiro

export type Industry = "Tech" | "Financeiro" | "Retail" | "Saúde" | "Manufatura" | "Outro";

export interface IndustryBenchmark {
  avg: number;
  top25: number;
  top10: number;
}

export interface DimensionBenchmark {
  [industry: string]: IndustryBenchmark;
}

// Benchmark geral por setor
export const INDUSTRY_BENCHMARKS: Record<Industry, IndustryBenchmark> = {
  Tech:        { avg: 3.8, top25: 4.2, top10: 4.6 },
  Financeiro:  { avg: 3.4, top25: 3.9, top10: 4.3 },
  Retail:      { avg: 2.6, top25: 3.2, top10: 3.8 },
  Saúde:       { avg: 2.2, top25: 2.8, top10: 3.5 },
  Manufatura:  { avg: 2.4, top25: 3.0, top10: 3.7 },
  Outro:       { avg: 2.9, top25: 3.4, top10: 4.0 },
};

// Benchmark por dimensão e setor
export const DIMENSION_BENCHMARKS: Record<string, Record<Industry, number>> = {
  "Estratégia & Governança": {
    Tech: 3.9, Financeiro: 3.8, Retail: 2.7, Saúde: 2.4, Manufatura: 2.5, Outro: 3.0,
  },
  "Arquitetura & Engenharia": {
    Tech: 4.1, Financeiro: 3.5, Retail: 2.5, Saúde: 2.1, Manufatura: 2.6, Outro: 2.8,
  },
  "Gestão de Dados": {
    Tech: 3.7, Financeiro: 3.6, Retail: 2.4, Saúde: 2.3, Manufatura: 2.3, Outro: 2.7,
  },
  "Qualidade de Dados": {
    Tech: 3.6, Financeiro: 3.9, Retail: 2.8, Saúde: 2.5, Manufatura: 2.4, Outro: 2.9,
  },
  "Analytics & Valor": {
    Tech: 4.0, Financeiro: 3.4, Retail: 2.8, Saúde: 2.0, Manufatura: 2.2, Outro: 2.8,
  },
  "Cultura & Literacy": {
    Tech: 3.5, Financeiro: 2.9, Retail: 2.3, Saúde: 1.9, Manufatura: 2.1, Outro: 2.6,
  },
  "IA & Advanced Analytics": {
    Tech: 3.8, Financeiro: 3.1, Retail: 2.2, Saúde: 1.8, Manufatura: 1.9, Outro: 2.5,
  },
};

// Roadmap de ações por dimensão e nível atual
export const ROADMAP_ACTIONS: Record<string, Record<number, string[]>> = {
  "Estratégia & Governança": {
    1: [
      "Nomear um responsável formal pela estratégia de dados (CDO ou equivalente)",
      "Realizar workshop executivo para alinhar visão de dados com objetivos de negócio",
      "Documentar os 5 principais casos de uso de dados prioritários para o negócio",
    ],
    2: [
      "Criar um Comitê de Dados com representantes de cada área de negócio",
      "Definir e publicar uma política de dados corporativa (classificação, acesso, retenção)",
      "Estabelecer OKRs trimestrais para iniciativas de dados com owner definido",
    ],
    3: [
      "Implementar um framework de governança com papéis de Data Owner e Data Steward",
      "Criar um Data Catalog centralizado com glossário de negócio padronizado",
      "Vincular métricas de qualidade de dados a KPIs de negócio",
    ],
    4: [
      "Automatizar monitoramento de conformidade com políticas de dados",
      "Implementar Data Mesh ou modelo federado de governança",
      "Integrar governança de dados ao processo de desenvolvimento de produtos",
    ],
  },
  "Arquitetura & Engenharia": {
    1: [
      "Mapear todas as fontes de dados existentes e criar um inventário centralizado",
      "Avaliar e escolher uma plataforma de dados cloud (AWS, GCP ou Azure)",
      "Implementar um repositório centralizado para dados críticos do negócio",
    ],
    2: [
      "Criar pipelines de ingestão automatizados para as principais fontes de dados",
      "Implementar um Data Warehouse ou Data Lake básico",
      "Estabelecer padrões de nomenclatura e versionamento para datasets",
    ],
    3: [
      "Migrar para arquitetura moderna (Lakehouse ou Medallion Architecture)",
      "Implementar orquestração de pipelines com Airflow ou Prefect",
      "Criar camadas Bronze/Silver/Gold para qualidade progressiva dos dados",
    ],
    4: [
      "Adotar DataOps com CI/CD para pipelines de dados",
      "Implementar observabilidade de dados (data quality monitoring em tempo real)",
      "Avaliar adoção de arquitetura Data Mesh para escalar com autonomia",
    ],
  },
  "Gestão de Dados": {
    1: [
      "Criar um inventário básico dos principais datasets e seus responsáveis",
      "Definir critérios mínimos de qualidade para dados críticos do negócio",
      "Implementar controle de acesso básico com princípio do menor privilégio",
    ],
    2: [
      "Implementar um Data Catalog (ex: DataHub, Amundsen ou Alation)",
      "Criar processos de onboarding de novos datasets com metadados obrigatórios",
      "Estabelecer SLAs de disponibilidade para dados críticos",
    ],
    3: [
      "Implementar linhagem de dados end-to-end para relatórios críticos",
      "Criar processos automatizados de detecção e correção de anomalias",
      "Estabelecer um programa formal de Data Quality com métricas mensuráveis",
    ],
    4: [
      "Implementar gestão de dados mestres (MDM) para entidades críticas",
      "Automatizar ciclo de vida de dados com políticas de retenção e arquivamento",
      "Criar um programa de certificação de dados para relatórios executivos",
    ],
  },
  "Qualidade de Dados": {
    1: [
      "Identificar os 10 datasets mais críticos e medir sua qualidade atual",
      "Criar um dashboard simples de monitoramento de qualidade de dados",
      "Estabelecer um processo de reporte e resolução de problemas de qualidade",
    ],
    2: [
      "Implementar validações automáticas na ingestão de dados (Great Expectations ou dbt tests)",
      "Criar SLAs de qualidade para dados que alimentam decisões executivas",
      "Treinar equipes de negócio para reportar e classificar problemas de qualidade",
    ],
    3: [
      "Implementar monitoramento contínuo de qualidade com alertas automáticos",
      "Criar scorecard de qualidade por domínio de dados com metas trimestrais",
      "Implementar processos de data profiling automatizados em novos datasets",
    ],
    4: [
      "Implementar data observability end-to-end (ex: Monte Carlo, Bigeye)",
      "Criar modelos preditivos para antecipar degradação de qualidade",
      "Vincular métricas de qualidade de dados a bonificações de equipes",
    ],
  },
  "Analytics & Valor": {
    1: [
      "Implementar uma ferramenta de BI centralizada (Power BI, Tableau ou Metabase)",
      "Criar um dashboard executivo com os 5 KPIs mais importantes do negócio",
      "Treinar líderes de negócio para consumir e interpretar dados",
    ],
    2: [
      "Criar uma camada semântica padronizada para métricas de negócio",
      "Implementar self-service analytics para áreas de negócio",
      "Estabelecer um processo de revisão mensal de KPIs com liderança",
    ],
    3: [
      "Implementar análises preditivas básicas para os principais processos de negócio",
      "Criar um programa de Analytics Champions em cada área de negócio",
      "Integrar dados externos (mercado, concorrência) às análises internas",
    ],
    4: [
      "Implementar analytics em tempo real para decisões operacionais críticas",
      "Criar modelos de atribuição e causalidade para campanhas e iniciativas",
      "Desenvolver produtos de dados para clientes ou parceiros externos",
    ],
  },
  "Cultura & Literacy": {
    1: [
      "Realizar diagnóstico de letramento em dados com todos os colaboradores",
      "Criar um programa básico de treinamento em dados para líderes",
      "Comunicar internamente a importância estratégica dos dados",
    ],
    2: [
      "Implementar trilha de aprendizado em dados por nível (executivo, gerencial, técnico)",
      "Criar casos de uso internos de sucesso com dados e comunicar amplamente",
      "Estabelecer métricas de adoção de ferramentas de dados por área",
    ],
    3: [
      "Criar um programa formal de Data Champions com certificação interna",
      "Integrar competências em dados ao processo de avaliação de desempenho",
      "Promover hackathons e desafios internos com dados para engajamento",
    ],
    4: [
      "Tornar o letramento em dados critério de promoção para cargos de liderança",
      "Criar comunidade de prática em dados com eventos regulares",
      "Publicar externamente cases de sucesso para atrair talentos data-driven",
    ],
  },
  "IA & Advanced Analytics": {
    1: [
      "Identificar 3 casos de uso de IA com alto potencial de ROI para o negócio",
      "Contratar ou desenvolver internamente competências básicas em ML/IA",
      "Realizar um projeto-piloto de IA em uma área de baixo risco",
    ],
    2: [
      "Implementar um processo estruturado de desenvolvimento e validação de modelos",
      "Criar uma plataforma básica de MLOps para gerenciar modelos em produção",
      "Estabelecer critérios de ética e governança para uso de IA",
    ],
    3: [
      "Escalar modelos de ML para múltiplos casos de uso em produção",
      "Implementar monitoramento de drift e retreinamento automático de modelos",
      "Criar um repositório centralizado de features (Feature Store)",
    ],
    4: [
      "Implementar GenAI em produtos e processos internos com governança clara",
      "Criar capacidade de pesquisa aplicada em IA para vantagem competitiva",
      "Desenvolver produtos de IA para clientes ou como diferencial de mercado",
    ],
  },
};
