import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { DIMENSIONS } from "@/lib/assessment/questions";

export async function POST(request: NextRequest) {
  try {
    // Pegar o usuário autenticado
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    // Parse do body
    const body = await request.json();
    const { answers } = body;

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Respostas inválidas" },
        { status: 400 }
      );
    }

    // Calcular scores por dimensão
    const dimensionScores: Record<string, number> = {};
    let totalScore = 0;
    let totalQuestions = 0;

    DIMENSIONS.forEach((dimension) => {
      const dimensionAnswers = dimension.questions
        .map((q) => answers[q.id])
        .filter((a) => a !== undefined);

      if (dimensionAnswers.length > 0) {
        const avg =
          dimensionAnswers.reduce((a, b) => a + b, 0) /
          dimensionAnswers.length;
        dimensionScores[dimension.name] = Math.round(avg * 10) / 10;
        totalScore += avg;
        totalQuestions += dimensionAnswers.length;
      }
    });

    // Calcular score geral
    const overallScore =
      totalQuestions > 0
        ? Math.round((totalScore / totalQuestions) * 10) / 10
        : 0;

    // Determinar nível
    const levels = [
      { min: 0, max: 1.5, label: "Inexistente" },
      { min: 1.5, max: 2.5, label: "Inicial" },
      { min: 2.5, max: 3.5, label: "Intermediário" },
      { min: 3.5, max: 4.5, label: "Avançado" },
      { min: 4.5, max: 5, label: "Otimizado" },
    ];

    const level =
      levels.find((l) => overallScore >= l.min && overallScore <= l.max)
        ?.label || "Inexistente";

    // Criar cliente Supabase
    const supabase = await createClient();

    // Salvar no Supabase
    const { data, error } = await supabase
      .from("assessment_results")
      .insert([
        {
          user_id: user.id,
          overall_score: overallScore,
          level: level,
          dimension_scores: dimensionScores,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Erro ao salvar resultado:", error);
      return NextResponse.json(
        { error: "Erro ao salvar resultado" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      resultId: data.id,
      overallScore,
      level,
      dimensionScores,
    });
  } catch (error) {
    console.error("Erro na API de finalização:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}