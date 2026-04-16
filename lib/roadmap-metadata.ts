/**
 * Metadados de cada ação do roadmap.
 * Chave: texto exato da ação (igual ao ROADMAP_ACTIONS em benchmarks.ts)
 * Valores:
 *   esforco: "Baixo" | "Médio" | "Alto"
 *   prazo:   "< 1 mês" | "1–3 meses" | "3–6 meses" | "6+ meses"
 *   tipo:    "Processo" | "Tecnologia" | "Cultura" | "Governança"
 */

export type Esforco = "Baixo" | "Médio" | "Alto";
export type Prazo = "< 1 mês" | "1–3 meses" | "3–6 meses" | "6+ meses";
export type TipoIniciativa = "Processo" | "Tecnologia" | "Cultura" | "Governança";

export interface ActionMetadata {
  esforco: Esforco;
  prazo: Prazo;
  tipo: TipoIniciativa;
}

export const ROADMAP_METADATA: Record<string, ActionMetadata> = {

  // ─── ESTRATÉGIA & GOVERNANÇA ─────────────────────────────────────────────

  // Nível 1
  "Nomear um responsável formal pela estratégia de dados (CDO ou equivalente)": {
    esforco: "Baixo", prazo: "< 1 mês", tipo: "Governança",
  },
  "Realizar workshop executivo para alinhar visão de dados com objetivos de negócio": {
    esforco: "Baixo", prazo: "< 1 mês", tipo: "Cultura",
  },
  "Documentar os 5 principais casos de uso de dados prioritários para o negócio": {
    esforco: "Baixo", prazo: "< 1 mês", tipo: "Processo",
  },
  // Nível 2
  "Criar um Comitê de Dados com representantes de cada área de negócio": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Governança",
  },
  "Definir e publicar uma política de dados corporativa (classificação, acesso, retenção)": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Governança",
  },
  "Estabelecer OKRs trimestrais para iniciativas de dados com owner definido": {
    esforco: "Baixo", prazo: "1–3 meses", tipo: "Processo",
  },
  // Nível 3
  "Implementar um framework de governança com papéis de Data Owner e Data Steward": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Governança",
  },
  "Criar um Data Catalog centralizado com glossário de negócio padronizado": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Tecnologia",
  },
  "Vincular métricas de qualidade de dados a KPIs de negócio": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Processo",
  },
  // Nível 4
  "Automatizar monitoramento de conformidade com políticas de dados": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Tecnologia",
  },
  "Implementar Data Mesh ou modelo federado de governança": {
    esforco: "Alto", prazo: "6+ meses", tipo: "Governança",
  },
  "Integrar governança de dados ao processo de desenvolvimento de produtos": {
    esforco: "Alto", prazo: "6+ meses", tipo: "Processo",
  },

  // ─── ARQUITETURA & ENGENHARIA ─────────────────────────────────────────────

  // Nível 1
  "Mapear todas as fontes de dados existentes e criar um inventário centralizado": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Processo",
  },
  "Avaliar e escolher uma plataforma de dados cloud (AWS, GCP ou Azure)": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Tecnologia",
  },
  "Implementar um repositório centralizado para dados críticos do negócio": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Tecnologia",
  },
  // Nível 2
  "Criar pipelines de ingestão automatizados para as principais fontes de dados": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Tecnologia",
  },
  "Implementar um Data Warehouse ou Data Lake básico": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Tecnologia",
  },
  "Estabelecer padrões de nomenclatura e versionamento para datasets": {
    esforco: "Baixo", prazo: "< 1 mês", tipo: "Processo",
  },
  // Nível 3
  "Implementar uma arquitetura de dados moderna (Lakehouse ou Data Mesh)": {
    esforco: "Alto", prazo: "6+ meses", tipo: "Tecnologia",
  },
  "Criar camadas de dados (Bronze/Silver/Gold) com transformações documentadas": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Tecnologia",
  },
  "Implementar observabilidade de pipelines com alertas automáticos": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Tecnologia",
  },
  // Nível 4
  "Implementar streaming de dados em tempo real para casos de uso críticos": {
    esforco: "Alto", prazo: "6+ meses", tipo: "Tecnologia",
  },
  "Criar uma plataforma de dados self-service para equipes de negócio": {
    esforco: "Alto", prazo: "6+ meses", tipo: "Tecnologia",
  },
  "Automatizar provisionamento de infraestrutura de dados com IaC": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Tecnologia",
  },

  // ─── GESTÃO DE DADOS ─────────────────────────────────────────────────────

  // Nível 1
  "Criar um inventário dos principais ativos de dados da organização": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Processo",
  },
  "Definir responsáveis (owners) para os domínios de dados mais críticos": {
    esforco: "Baixo", prazo: "< 1 mês", tipo: "Governança",
  },
  "Implementar controle de acesso básico com princípio do menor privilégio": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Tecnologia",
  },
  // Nível 2
  "Implementar um Data Catalog (ex: DataHub, Amundsen ou Alation)": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Tecnologia",
  },
  "Criar processos de onboarding de novos datasets com metadados obrigatórios": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Processo",
  },
  "Estabelecer SLAs de disponibilidade para dados críticos": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Processo",
  },
  // Nível 3
  "Implementar linhagem de dados end-to-end para relatórios críticos": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Tecnologia",
  },
  "Criar processos automatizados de detecção e correção de anomalias": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Tecnologia",
  },
  "Estabelecer um programa formal de Data Quality com métricas mensuráveis": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Processo",
  },
  // Nível 4
  "Implementar gestão de dados mestres (MDM) para entidades críticas": {
    esforco: "Alto", prazo: "6+ meses", tipo: "Tecnologia",
  },
  "Automatizar ciclo de vida de dados com políticas de retenção e arquivamento": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Processo",
  },
  "Criar um programa de certificação de dados para relatórios executivos": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Governança",
  },

  // ─── QUALIDADE DE DADOS ───────────────────────────────────────────────────

  // Nível 1
  "Identificar os 10 datasets mais críticos e medir sua qualidade atual": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Processo",
  },
  "Criar um dashboard simples de monitoramento de qualidade de dados": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Tecnologia",
  },
  "Estabelecer um processo de reporte e resolução de problemas de qualidade": {
    esforco: "Baixo", prazo: "< 1 mês", tipo: "Processo",
  },
  // Nível 2
  "Implementar validações automáticas na ingestão de dados (Great Expectations ou dbt tests)": {
    esforco: "Alto", prazo: "1–3 meses", tipo: "Tecnologia",
  },
  "Criar SLAs de qualidade para dados que alimentam decisões executivas": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Processo",
  },
  "Treinar equipes de negócio para reportar e classificar problemas de qualidade": {
    esforco: "Baixo", prazo: "< 1 mês", tipo: "Cultura",
  },
  // Nível 3
  "Implementar monitoramento contínuo de qualidade com alertas automáticos": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Tecnologia",
  },
  "Criar scorecard de qualidade por domínio de dados com metas trimestrais": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Processo",
  },
  "Implementar processos de data profiling automatizados em novos datasets": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Tecnologia",
  },
  // Nível 4
  "Implementar data observability end-to-end (ex: Monte Carlo, Bigeye)": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Tecnologia",
  },
  "Criar modelos preditivos para antecipar degradação de qualidade": {
    esforco: "Alto", prazo: "6+ meses", tipo: "Tecnologia",
  },
  "Vincular métricas de qualidade de dados a bonificações de equipes": {
    esforco: "Médio", prazo: "3–6 meses", tipo: "Cultura",
  },

  // ─── ANALYTICS & VALOR ───────────────────────────────────────────────────

  // Nível 1
  "Implementar uma ferramenta de BI centralizada (Power BI, Tableau ou Metabase)": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Tecnologia",
  },
  "Criar um dashboard executivo com os 5 KPIs mais importantes do negócio": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Processo",
  },
  "Treinar líderes de negócio para consumir e interpretar dados": {
    esforco: "Baixo", prazo: "1–3 meses", tipo: "Cultura",
  },
  // Nível 2
  "Criar uma camada semântica padronizada para métricas de negócio": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Tecnologia",
  },
  "Implementar self-service analytics para áreas de negócio": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Tecnologia",
  },
  "Estabelecer um processo de revisão mensal de KPIs com liderança": {
    esforco: "Baixo", prazo: "< 1 mês", tipo: "Processo",
  },
  // Nível 3
  "Implementar análises preditivas básicas para os principais processos de negócio": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Tecnologia",
  },
  "Criar um programa de Analytics Champions em cada área de negócio": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Cultura",
  },
  "Integrar dados externos (mercado, concorrência) às análises internas": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Tecnologia",
  },
  // Nível 4
  "Implementar analytics em tempo real para decisões operacionais críticas": {
    esforco: "Alto", prazo: "6+ meses", tipo: "Tecnologia",
  },
  "Criar modelos de atribuição e causalidade para campanhas e iniciativas": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Tecnologia",
  },
  "Desenvolver produtos de dados para clientes ou parceiros externos": {
    esforco: "Alto", prazo: "6+ meses", tipo: "Processo",
  },

  // ─── CULTURA & LITERACY ──────────────────────────────────────────────────

  // Nível 1
  "Realizar diagnóstico de letramento em dados com todos os colaboradores": {
    esforco: "Baixo", prazo: "< 1 mês", tipo: "Cultura",
  },
  "Criar um programa básico de treinamento em dados para líderes": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Cultura",
  },
  "Comunicar internamente a importância estratégica dos dados": {
    esforco: "Baixo", prazo: "< 1 mês", tipo: "Cultura",
  },
  // Nível 2
  "Implementar trilha de aprendizado em dados por nível (executivo, gerencial, técnico)": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Cultura",
  },
  "Criar casos de uso internos de sucesso com dados e comunicar amplamente": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Cultura",
  },
  "Estabelecer métricas de adoção de ferramentas de dados por área": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Processo",
  },
  // Nível 3
  "Criar um programa formal de Data Champions com certificação interna": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Cultura",
  },
  "Integrar competências em dados ao processo de avaliação de desempenho": {
    esforco: "Médio", prazo: "3–6 meses", tipo: "Processo",
  },
  "Promover hackathons e desafios internos com dados para engajamento": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Cultura",
  },
  // Nível 4
  "Tornar o letramento em dados critério de promoção para cargos de liderança": {
    esforco: "Médio", prazo: "3–6 meses", tipo: "Cultura",
  },
  "Criar comunidade de prática em dados com eventos regulares": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Cultura",
  },
  "Publicar externamente cases de sucesso para atrair talentos data-driven": {
    esforco: "Baixo", prazo: "1–3 meses", tipo: "Cultura",
  },

  // ─── IA & ADVANCED ANALYTICS ─────────────────────────────────────────────

  // Nível 1
  "Identificar 3 casos de uso de IA com alto potencial de ROI para o negócio": {
    esforco: "Baixo", prazo: "< 1 mês", tipo: "Processo",
  },
  "Contratar ou desenvolver internamente competências básicas em ML/IA": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Cultura",
  },
  "Realizar um projeto-piloto de IA em uma área de baixo risco": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Tecnologia",
  },
  // Nível 2
  "Implementar um processo estruturado de desenvolvimento e validação de modelos": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Processo",
  },
  "Criar uma plataforma básica de MLOps para gerenciar modelos em produção": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Tecnologia",
  },
  "Estabelecer critérios de ética e governança para uso de IA": {
    esforco: "Médio", prazo: "1–3 meses", tipo: "Governança",
  },
  // Nível 3
  "Escalar modelos de ML para múltiplos casos de uso em produção": {
    esforco: "Alto", prazo: "6+ meses", tipo: "Tecnologia",
  },
  "Implementar monitoramento de drift e retreinamento automático de modelos": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Tecnologia",
  },
  "Criar um repositório centralizado de features (Feature Store)": {
    esforco: "Alto", prazo: "3–6 meses", tipo: "Tecnologia",
  },
  // Nível 4
  "Implementar GenAI em produtos e processos internos com governança clara": {
    esforco: "Alto", prazo: "6+ meses", tipo: "Tecnologia",
  },
  "Criar capacidade de pesquisa aplicada em IA para vantagem competitiva": {
    esforco: "Alto", prazo: "6+ meses", tipo: "Tecnologia",
  },
  "Desenvolver produtos de IA para clientes ou como diferencial de mercado": {
    esforco: "Alto", prazo: "6+ meses", tipo: "Tecnologia",
  },
};

// ─── HELPERS DE ESTILO ────────────────────────────────────────────────────────

export function getEsforcoStyle(esforco: Esforco) {
  switch (esforco) {
    case "Baixo":  return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" };
    case "Médio":  return { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-500"   };
    case "Alto":   return { bg: "bg-red-50",      text: "text-red-700",     border: "border-red-200",     dot: "bg-red-500"     };
  }
}

export function getPrazoStyle(prazo: Prazo) {
  switch (prazo) {
    case "< 1 mês":    return { bg: "bg-sky-50",    text: "text-sky-700",    border: "border-sky-200"    };
    case "1–3 meses":  return { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200"   };
    case "3–6 meses":  return { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" };
    case "6+ meses":   return { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" };
  }
}

export function getTipoStyle(tipo: TipoIniciativa) {
  switch (tipo) {
    case "Processo":    return { bg: "bg-gray-50",   text: "text-gray-600",   border: "border-gray-200"   };
    case "Tecnologia":  return { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" };
    case "Cultura":     return { bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200"   };
    case "Governança":  return { bg: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200"   };
  }
}
