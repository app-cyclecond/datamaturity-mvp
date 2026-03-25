import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Verificar se as variáveis de ambiente estão disponíveis
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

const SAMPLE_CONTENT = [
  // TÉCNICO - BRONZE
  {
    title: "Guia de Arquitetura de Dados Moderna",
    description: "Estrutura recomendada para implementar uma arquitetura de dados escalável",
    pillar: "técnico",
    required_plan: "bronze",
    content_url: "https://example.com/arquitetura-dados",
  },
  {
    title: "Pipeline de ETL - Melhores Práticas",
    description: "Como construir pipelines robustos e eficientes",
    pillar: "técnico",
    required_plan: "bronze",
    content_url: "https://example.com/etl-praticas",
  },

  // TÉCNICO - SILVER
  {
    title: "Implementação de Data Warehouse",
    description: "Passo a passo para implementar um data warehouse empresarial",
    pillar: "técnico",
    required_plan: "silver",
    content_url: "https://example.com/data-warehouse",
  },
  {
    title: "Otimização de Queries SQL",
    description: "Técnicas avançadas para otimizar performance de queries",
    pillar: "técnico",
    required_plan: "silver",
    content_url: "https://example.com/sql-optimization",
  },

  // TÉCNICO - GOLD
  {
    title: "Machine Learning em Produção",
    description: "Guia completo para colocar modelos de ML em produção",
    pillar: "técnico",
    required_plan: "gold",
    content_url: "https://example.com/ml-producao",
  },
  {
    title: "Arquitetura de Data Lake Avançada",
    description: "Implementação de data lakes em escala enterprise",
    pillar: "técnico",
    required_plan: "gold",
    content_url: "https://example.com/data-lake-advanced",
  },

  // REGULATÓRIO - SILVER
  {
    title: "Conformidade com LGPD",
    description: "Checklist de conformidade com a Lei Geral de Proteção de Dados",
    pillar: "regulatório",
    required_plan: "silver",
    content_url: "https://example.com/lgpd-compliance",
  },
  {
    title: "Governança de Dados - Regulamentações",
    description: "Frameworks regulatórios para governança de dados",
    pillar: "regulatório",
    required_plan: "silver",
    content_url: "https://example.com/governance-regulations",
  },

  // REGULATÓRIO - GOLD
  {
    title: "Segurança e Compliance Avançado",
    description: "Implementação de segurança em nível enterprise",
    pillar: "regulatório",
    required_plan: "gold",
    content_url: "https://example.com/security-compliance",
  },
  {
    title: "Auditoria de Dados e Conformidade",
    description: "Processos de auditoria e conformidade regulatória",
    pillar: "regulatório",
    required_plan: "gold",
    content_url: "https://example.com/data-audit",
  },

  // CULTURA - GOLD
  {
    title: "Mudança Organizacional para Data-Driven",
    description: "Como transformar a cultura da organização para ser data-driven",
    pillar: "cultura",
    required_plan: "gold",
    content_url: "https://example.com/data-driven-culture",
  },
  {
    title: "Treinamento de Times em Analytics",
    description: "Programa de capacitação para times de dados",
    pillar: "cultura",
    required_plan: "gold",
    content_url: "https://example.com/analytics-training",
  },
];

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.SEED_SECRET_KEY || "seed-secret";

    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verificar se supabaseAdmin está disponível
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    // Limpar dados existentes (opcional)
    const { error: deleteError } = await supabaseAdmin
      .from("content_library")
      .delete()
      .gt("id", "00000000-0000-0000-0000-000000000000");

    if (deleteError && !deleteError.message.includes("no rows")) {
      console.error("Delete error:", deleteError);
    }

    // Inserir novos dados
    const { data, error } = await supabaseAdmin
      .from("content_library")
      .insert(SAMPLE_CONTENT);

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "Failed to seed content", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${SAMPLE_CONTENT.length} content items`,
      count: SAMPLE_CONTENT.length,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error during seeding" },
      { status: 500 }
    );
  }
}

// GET endpoint para verificar conteúdo
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("content_library")
      .select("*");

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch content", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      data,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}
