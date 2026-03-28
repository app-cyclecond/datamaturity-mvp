export type InsightTier = "low" | "mid" | "high";

export type DimensionInsight = {
  strength: string;
  gap: string;
  action: string;
  questions: Array<{
    text: string;
    interpretation: string;
  }>;
};

export const DIMENSION_INSIGHTS: Record<string, Record<InsightTier, DimensionInsight>> = {
  "Estratégia & Governança": {
    low: {
      strength: "Há consciência inicial sobre a importância de dados para o negócio",
      gap: "Falta uma estratégia formal de dados alinhada aos objetivos corporativos",
      action: "Elaborar um Data Strategy Canvas com visão, objetivos e KPIs de dados",
      questions: [
        { text: "Estratégia de dados alinhada ao negócio", interpretation: "Não existe ou é informal — dados não têm papel estratégico definido" },
        { text: "Papéis e responsabilidades de dados", interpretation: "Sem data owners ou stewards formalizados — responsabilidade é difusa" },
        { text: "Governança com rituais e comitês", interpretation: "Sem estrutura de governança ativa — decisões sobre dados são ad hoc" },
        { text: "Políticas de dados definidas", interpretation: "Sem políticas formais de acesso, qualidade ou segurança de dados" },
      ],
    },
    mid: {
      strength: "Estratégia de dados existe e está parcialmente comunicada na organização",
      gap: "Governança ainda é inconsistente — falta ritmo e accountability claros",
      action: "Estabelecer um Data Council com reuniões mensais e donos por domínio",
      questions: [
        { text: "Estratégia de dados alinhada ao negócio", interpretation: "Estratégia existe mas não está totalmente integrada às decisões do negócio" },
        { text: "Priorização por impacto no negócio", interpretation: "Projetos de dados são priorizados parcialmente por valor — ainda há demandas técnicas" },
        { text: "Políticas de dados definidas", interpretation: "Políticas existem mas não são seguidas de forma consistente" },
        { text: "Governança com rituais e comitês", interpretation: "Comitê existe mas com frequência irregular e baixo engajamento" },
      ],
    },
    high: {
      strength: "Governança madura com papéis claros, rituais estabelecidos e estratégia integrada",
      gap: "Oportunidade de evoluir para governança preditiva e orientada a valor",
      action: "Implementar data products e medir ROI de cada iniciativa de dados",
      questions: [
        { text: "Estratégia de dados alinhada ao negócio", interpretation: "Estratégia bem definida e revisada regularmente com o C-level" },
        { text: "Governança com rituais e comitês", interpretation: "Data Council ativo com accountability e métricas de sucesso" },
        { text: "Políticas de dados definidas", interpretation: "Políticas formalizadas, auditadas e seguidas pela organização" },
        { text: "Priorização por impacto no negócio", interpretation: "Todas as iniciativas de dados têm business case e ROI esperado definidos" },
      ],
    },
  },
  "Arquitetura & Engenharia": {
    low: {
      strength: "Dados existem e são acessíveis, mesmo que de forma manual ou fragmentada",
      gap: "Infraestrutura legada, silos isolados e sem pipelines automatizados",
      action: "Mapear todas as fontes de dados e criar um plano de modernização da stack",
      questions: [
        { text: "Infraestrutura de dados moderna", interpretation: "Stack legada ou inexistente — dados em planilhas e sistemas isolados" },
        { text: "Pipelines de ingestão automatizados", interpretation: "Sem ETL/ELT estruturado — movimentação de dados é manual e propensa a erros" },
        { text: "Repositório centralizado de dados", interpretation: "Sem data warehouse ou data lake — cada área tem sua própria fonte da verdade" },
        { text: "Documentação técnica da arquitetura", interpretation: "Sem documentação — conhecimento da infraestrutura está concentrado em poucas pessoas" },
      ],
    },
    mid: {
      strength: "Stack de dados moderna parcialmente implementada com pipelines funcionais",
      gap: "Observabilidade e qualidade dos pipelines ainda são limitadas",
      action: "Implementar data observability nos pipelines críticos para detectar falhas proativamente",
      questions: [
        { text: "Pipelines de ingestão automatizados", interpretation: "ETL/ELT existe mas com cobertura parcial e manutenção manual frequente" },
        { text: "Monitoramento de pipelines", interpretation: "Alertas básicos existem mas sem SLA ou gestão proativa de incidentes" },
        { text: "Documentação técnica da arquitetura", interpretation: "Documentação existe mas está desatualizada ou incompleta" },
        { text: "Escalabilidade da infraestrutura", interpretation: "Infraestrutura funciona mas tem gargalos em volumes maiores de dados" },
      ],
    },
    high: {
      strength: "Arquitetura moderna, escalável e com pipelines confiáveis e monitorados",
      gap: "Oportunidade de evoluir para arquitetura orientada a eventos e processamento em tempo real",
      action: "Avaliar adoção de streaming (Kafka, Flink) para casos de uso em tempo real",
      questions: [
        { text: "Infraestrutura de dados moderna", interpretation: "Stack moderna e bem documentada — cloud-native com separação de storage e compute" },
        { text: "Pipelines de ingestão automatizados", interpretation: "Pipelines automatizados com monitoramento, alertas e SLAs definidos" },
        { text: "Observabilidade de dados", interpretation: "Data observability implementada com detecção proativa de anomalias" },
        { text: "Escalabilidade da infraestrutura", interpretation: "Infraestrutura escala automaticamente conforme demanda — sem gargalos" },
      ],
    },
  },
  "Gestão de Dados": {
    low: {
      strength: "Dados críticos do negócio foram identificados mesmo sem catalogação formal",
      gap: "Sem catálogo de dados — descoberta e entendimento dos dados é lento e manual",
      action: "Criar um inventário básico de dados críticos com dono, descrição e localização",
      questions: [
        { text: "Catálogo de dados ativo", interpretation: "Sem catálogo — analistas perdem horas procurando e entendendo dados" },
        { text: "Metadados documentados", interpretation: "Sem documentação de metadados — conhecimento está na cabeça das pessoas" },
        { text: "Gestão do ciclo de vida dos dados", interpretation: "Sem política de retenção ou arquivamento — dados acumulam sem controle" },
        { text: "Data lineage rastreado", interpretation: "Sem rastreamento de origem e transformações — impossível auditar dados" },
      ],
    },
    mid: {
      strength: "Catálogo de dados existe com cobertura parcial dos domínios críticos",
      gap: "Adoção do catálogo ainda é baixa — equipes não consultam antes de criar novos datasets",
      action: "Criar programa de Data Stewardship com responsáveis por domínio e metas de cobertura",
      questions: [
        { text: "Catálogo de dados ativo", interpretation: "Catálogo existe mas com cobertura parcial e atualização irregular" },
        { text: "Metadados documentados", interpretation: "Metadados documentados para dados críticos mas não para toda a organização" },
        { text: "Data lineage rastreado", interpretation: "Lineage parcialmente mapeado — difícil rastrear impacto de mudanças" },
        { text: "Adoção do catálogo pelas equipes", interpretation: "Equipes de dados usam o catálogo mas áreas de negócio ainda não" },
      ],
    },
    high: {
      strength: "Catálogo abrangente com metadados, lineage e stewardship bem estabelecidos",
      gap: "Oportunidade de automatizar enriquecimento de metadados com IA",
      action: "Implementar auto-discovery de metadados e sugestões automáticas de classificação",
      questions: [
        { text: "Catálogo de dados ativo", interpretation: "Catálogo completo e adotado — é o ponto de entrada para qualquer análise" },
        { text: "Data lineage rastreado", interpretation: "Lineage end-to-end rastreado automaticamente — impacto de mudanças é previsível" },
        { text: "Gestão do ciclo de vida dos dados", interpretation: "Políticas de retenção e arquivamento implementadas e auditadas" },
        { text: "Adoção do catálogo pelas equipes", interpretation: "Catálogo é usado por todas as equipes — incluindo negócio e produto" },
      ],
    },
  },
  "Qualidade de Dados": {
    low: {
      strength: "Problemas de qualidade já foram identificados e há consciência do impacto no negócio",
      gap: "Sem processos formais de validação — erros chegam ao usuário final sem detecção",
      action: "Implementar validações básicas nos 3 datasets mais críticos do negócio",
      questions: [
        { text: "Regras de qualidade definidas", interpretation: "Sem regras formais — qualidade depende de checagem manual e esporádica" },
        { text: "Monitoramento de qualidade", interpretation: "Sem alertas ou dashboards de qualidade — problemas são descobertos pelos usuários" },
        { text: "Processo de remediação de problemas", interpretation: "Sem processo estruturado para corrigir problemas — correções são reativas" },
        { text: "Score de qualidade por domínio", interpretation: "Sem métricas de qualidade — impossível saber o estado real dos dados" },
      ],
    },
    mid: {
      strength: "Regras de qualidade definidas para dados críticos com monitoramento básico",
      gap: "Cobertura de qualidade ainda é parcial e remediação é lenta",
      action: "Expandir cobertura de data quality checks e criar SLA de resolução de incidentes",
      questions: [
        { text: "Regras de qualidade definidas", interpretation: "Regras existem para dados críticos mas não cobrem toda a organização" },
        { text: "Monitoramento de qualidade", interpretation: "Monitoramento existe mas com cobertura parcial e alertas manuais" },
        { text: "Score de qualidade por domínio", interpretation: "Métricas de qualidade existem mas não são acompanhadas regularmente" },
        { text: "Processo de remediação de problemas", interpretation: "Processo existe mas sem SLA ou responsáveis claros por domínio" },
      ],
    },
    high: {
      strength: "Qualidade monitorada continuamente com SLAs, alertas automáticos e remediação ágil",
      gap: "Oportunidade de implementar qualidade preditiva com ML para detectar anomalias antecipadamente",
      action: "Avaliar ferramentas de ML-based anomaly detection para qualidade proativa",
      questions: [
        { text: "Regras de qualidade definidas", interpretation: "Regras abrangentes cobrindo completude, consistência, precisão e atualidade" },
        { text: "Monitoramento de qualidade", interpretation: "Monitoramento automatizado com alertas em tempo real e SLAs definidos" },
        { text: "Processo de remediação de problemas", interpretation: "Processo estruturado com responsáveis, prazos e rastreamento de incidentes" },
        { text: "Score de qualidade por domínio", interpretation: "Score de qualidade por domínio publicado e acompanhado pelo negócio" },
      ],
    },
  },
  "Analytics & Valor": {
    low: {
      strength: "Relatórios básicos existem e há demanda crescente por análises mais avançadas",
      gap: "Analytics limitado a relatórios descritivos — sem análise preditiva ou prescritiva",
      action: "Criar um BI Center of Excellence com casos de uso priorizados por impacto no negócio",
      questions: [
        { text: "Self-service analytics", interpretation: "Sem self-service — analistas são gargalo para qualquer análise ad hoc" },
        { text: "Dashboards e KPIs de negócio", interpretation: "Sem dashboards confiáveis — decisões baseadas em planilhas manuais" },
        { text: "Analytics preditivo em produção", interpretation: "Sem modelos preditivos — organização reage a problemas em vez de antecipá-los" },
        { text: "Medição de ROI de analytics", interpretation: "Sem medição de valor gerado — difícil justificar investimentos em dados" },
      ],
    },
    mid: {
      strength: "Dashboards de negócio estabelecidos com adoção crescente nas áreas",
      gap: "Analytics ainda é majoritariamente descritivo — falta capacidade preditiva",
      action: "Desenvolver os primeiros modelos preditivos para os casos de uso de maior impacto",
      questions: [
        { text: "Self-service analytics", interpretation: "Self-service parcial — algumas áreas são autônomas, outras dependem de TI" },
        { text: "Dashboards e KPIs de negócio", interpretation: "Dashboards existem mas com inconsistências entre áreas (métricas diferentes)" },
        { text: "Medição de ROI de analytics", interpretation: "Valor gerado por analytics não é medido sistematicamente" },
        { text: "Analytics preditivo em produção", interpretation: "Primeiros experimentos com ML mas sem modelos em produção" },
      ],
    },
    high: {
      strength: "Analytics avançado com capacidade preditiva, prescritiva e self-service maduro",
      gap: "Oportunidade de democratizar analytics generativo com LLMs para usuários de negócio",
      action: "Pilotar analytics conversacional (NL2SQL, AI assistants) para líderes de negócio",
      questions: [
        { text: "Self-service analytics", interpretation: "Self-service maduro — líderes de negócio respondem suas próprias perguntas" },
        { text: "Analytics preditivo em produção", interpretation: "Modelos preditivos em produção gerando valor mensurável e revisados regularmente" },
        { text: "Medição de ROI de analytics", interpretation: "ROI de cada iniciativa de analytics é medido e reportado ao C-level" },
        { text: "Dashboards e KPIs de negócio", interpretation: "Fonte única da verdade para KPIs — sem conflito de métricas entre áreas" },
      ],
    },
  },
  "Cultura & Literacy": {
    low: {
      strength: "Liderança reconhece a importância dos dados — há abertura para mudança cultural",
      gap: "Baixo letramento em dados — maioria dos colaboradores não usa dados no dia a dia",
      action: "Lançar programa de Data Literacy com trilhas por nível (básico, intermediário, avançado)",
      questions: [
        { text: "Programa de treinamento em dados", interpretation: "Sem programa formal — conhecimento de dados é autodidata e fragmentado" },
        { text: "Cultura data-driven na liderança", interpretation: "Líderes tomam decisões por intuição — dados são usados para confirmar, não decidir" },
        { text: "Comunidade interna de dados", interpretation: "Sem comunidade ou fórum interno — silos de conhecimento entre equipes" },
        { text: "Métricas de adoção de dados", interpretation: "Sem métricas de uso de dados — impossível medir progresso cultural" },
      ],
    },
    mid: {
      strength: "Iniciativas de letramento em andamento com engajamento crescente nas equipes",
      gap: "Cultura data-driven ainda é concentrada em equipes de dados — não permeia o negócio",
      action: "Criar programa de Data Champions: embaixadores de dados em cada área de negócio",
      questions: [
        { text: "Programa de treinamento em dados", interpretation: "Treinamentos existem mas com baixa adesão ou cobertura parcial das áreas" },
        { text: "Cultura data-driven na liderança", interpretation: "Alguns líderes usam dados ativamente, mas não é prática uniforme" },
        { text: "Métricas de adoção de dados", interpretation: "Sem métricas claras de adoção — difícil medir progresso da cultura" },
        { text: "Comunidade interna de dados", interpretation: "Comunidade existe mas com participação limitada e eventos esporádicos" },
      ],
    },
    high: {
      strength: "Cultura data-driven enraizada — dados são parte natural das decisões em todos os níveis",
      gap: "Oportunidade de evoluir para cultura de experimentação e aprendizado contínuo com dados",
      action: "Implementar A/B testing e cultura de experimentação em todas as áreas de negócio",
      questions: [
        { text: "Programa de treinamento em dados", interpretation: "Programa estruturado com trilhas, certificações e métricas de progresso" },
        { text: "Cultura data-driven na liderança", interpretation: "C-level e líderes são modelos de uso de dados — cultura permeia toda a organização" },
        { text: "Comunidade interna de dados", interpretation: "Comunidade ativa com eventos regulares, compartilhamento de casos e reconhecimento" },
        { text: "Métricas de adoção de dados", interpretation: "Adoção de dados medida por área — metas de letramento no plano de desenvolvimento" },
      ],
    },
  },
  "IA & Advanced Analytics": {
    low: {
      strength: "Interesse em IA existe — há casos de uso identificados para explorar",
      gap: "Sem modelos de ML em produção — capacidade de IA é experimental ou inexistente",
      action: "Identificar 1-2 casos de uso de alto impacto e baixa complexidade para um primeiro piloto de ML",
      questions: [
        { text: "Modelos de ML em produção", interpretation: "Sem modelos em produção — IA é tema de discussão, não de execução" },
        { text: "Infraestrutura de MLOps", interpretation: "Sem MLOps — modelos desenvolvidos em notebooks sem processo de deploy" },
        { text: "Dados rotulados para treinamento", interpretation: "Sem datasets rotulados — treinamento de modelos supervisionados é inviável" },
        { text: "Competências de IA na equipe", interpretation: "Sem cientistas de dados ou engenheiros de ML dedicados" },
      ],
    },
    mid: {
      strength: "Primeiros modelos de ML em produção com impacto mensurável no negócio",
      gap: "MLOps ainda é manual — deploy, monitoramento e retraining são processos lentos",
      action: "Implementar plataforma de MLOps (ex: MLflow, Vertex AI) para acelerar ciclo de vida dos modelos",
      questions: [
        { text: "Modelos de ML em produção", interpretation: "Alguns modelos em produção mas sem processo padronizado de deploy" },
        { text: "Infraestrutura de MLOps", interpretation: "MLOps básico — versionamento de modelos mas sem monitoramento de drift" },
        { text: "Monitoramento de modelos em produção", interpretation: "Sem monitoramento de performance — degradação dos modelos não é detectada" },
        { text: "Competências de IA na equipe", interpretation: "Time de dados com habilidades básicas de ML mas sem especialistas em produção" },
      ],
    },
    high: {
      strength: "IA em produção com MLOps maduro, monitoramento e retraining automatizado",
      gap: "Oportunidade de integrar GenAI e LLMs para casos de uso de linguagem natural",
      action: "Criar estratégia de GenAI com casos de uso priorizados e framework de governança de IA",
      questions: [
        { text: "Modelos de ML em produção", interpretation: "Múltiplos modelos em produção com impacto mensurável e revisão regular" },
        { text: "Infraestrutura de MLOps", interpretation: "MLOps maduro com CI/CD para modelos, versionamento e monitoramento automático" },
        { text: "Governança de IA", interpretation: "Framework de ética e governança de IA implementado e auditado" },
        { text: "Competências de IA na equipe", interpretation: "Time especializado com cientistas de dados, MLEs e arquitetos de IA" },
      ],
    },
  },
};

export const getInsightTier = (score: number): InsightTier => {
  if (score < 2.5) return "low";
  if (score < 3.5) return "mid";
  return "high";
};
