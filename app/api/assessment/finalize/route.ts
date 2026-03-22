import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { DIMENSIONS } from "@/lib/assessment/questions";
import {
  calculateDimensionResults,
  calculateOverallScore,
} from "@/lib/assessment/utils";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json();

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { message: "Respostas inválidas" },
        { status: 400 }
      );
    }

    // Obter todas as perguntas
    const allQuestions = DIMENSIONS.flatMap((dim) => dim.questions);

    // Calcular scores por dimensão
    const dimensionResults = calculateDimensionResults(allQuestions, answers);

    // Calcular score geral
    const overallScore = calculateOverallScore(answers);

    // Determinar nível geral
    const getLevelFromScore = (score: number): string => {
      if (score < 2) return "Inexistente";
      if (score < 3) return "Inicial";
      if (score < 4) return "Estruturado";
      if (score < 4.5) return "Gerenciado";
      return "Otimizado";
    };

    const overallLevel = getLevelFromScore(overallScore);

    // Preparar dados para salvar
    const dimensionScores = dimensionResults.reduce(
      (acc, result) => {
        acc[result.dimension] = {
          score: result.score,
          level: result.level,
        };
        return acc;
      },
      {} as Record<string, { score: number; level: string }>
    );

    // Obter user_id da sessão
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    // Salvar no Supabase
    const { data, error } = await supabase
      .from("assessment_results")
      .insert([
        {
          overall_score: overallScore,
          level: overallLevel,
          dimension_scores: dimensionScores,
          user_id: session.user.id,
          created_at: new Date().toISOString(),
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { message: "Erro ao salvar resultado: " + error.message },
        { status: 500 }
      );
    }

    if (!data?.id) {
      return NextResponse.json(
        { message: "Erro: ID não retornado do banco de dados" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: data.id,
      overallScore,
      level: overallLevel,
      dimensionScores,
    });
  } catch (error) {
    console.error("Finalize error:", error);
    return NextResponse.json(
      { message: "Erro ao processar requisição: " + String(error) },
      { status: 500 }
    );
  }
}