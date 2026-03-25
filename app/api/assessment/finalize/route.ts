import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { DIMENSIONS } from "@/lib/assessment/questions";

export async function POST(request: NextRequest) {
  try {
    console.log("🔵 [FINALIZE] Iniciando finalização...");

    // 1. Pegar usuário autenticado
    const user = await getAuthenticatedUser();
    console.log("👤 [FINALIZE] Usuário:", user?.id);

    if (!user) {
      console.error("❌ [FINALIZE] Usuário não autenticado");
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    // 2. Parse do body
    const body = await request.json();
    const { answers } = body;
    console.log("📝 [FINALIZE] Respostas recebidas:", Object.keys(answers).length);
    console.log("📝 [FINALIZE] Valores das respostas:", answers);

    if (!answers || typeof answers !== "object") {
      console.error("❌ [FINALIZE] Respostas inválidas");
      return NextResponse.json(
        { error: "Respostas inválidas" },
        { status: 400 }
      );
    }

    // 3. Calcular scores por dimensão
    const dimensionScores: Record<string, number> = {};
    let totalScore = 0;
    let totalQuestions = 0;

    console.log("📊 [FINALIZE] Calculando scores...");

    DIMENSIONS.forEach((dimension) => {
      // Pegar todas as perguntas da dimensão
      const dimensionQuestions = dimension.questions;
      console.log(
        `  📌 ${dimension.name}: ${dimensionQuestions.length} perguntas`
      );

      // Pegar as respostas para as perguntas da dimensão
      const dimensionAnswers = dimensionQuestions
        .map((q) => {
          const answer = answers[q.id];
          const numAnswer = typeof answer === 'number' ? answer : (answer ? parseInt(String(answer)) : undefined);
          console.log(
            `    ✓ ${q.id}: raw=${answer}, parsed=${numAnswer}, type=${typeof answer}`
          );
          return numAnswer;
        })
        .filter((a) => a !== undefined && !isNaN(a));

      console.log(
        `  ✅ ${dimension.name}: ${dimensionAnswers.length} respostas`
      );

      if (dimensionAnswers.length > 0) {
        const sum = dimensionAnswers.reduce((a: number, b: number | undefined) => a + (b || 0), 0);
        const avg = sum / dimensionAnswers.length;
        const rounded = Math.round(avg * 10) / 10;
        dimensionScores[dimension.name] = rounded;
        console.log(`  📈 ${dimension.name}: ${rounded}`);
        totalScore += avg;
        totalQuestions += dimensionAnswers.length;
      }
    });

    // 4. Calcular score geral
    // Dividir pela quantidade de dimensões respondidas, não pelo total de respostas
    const dimensionsWithAnswers = Object.keys(dimensionScores).length;
    const overallScore =
      dimensionsWithAnswers > 0
        ? Math.round((Object.values(dimensionScores).reduce((a, b) => a + b, 0) / dimensionsWithAnswers) * 10) / 10
        : 0;
    console.log("🎯 [FINALIZE] Score geral:", overallScore);
    console.log("📊 [FINALIZE] Dimensões respondidas:", dimensionsWithAnswers);
    console.log("📊 [FINALIZE] Scores por dimensão:", dimensionScores);

    // 5. Determinar nível
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
    console.log("🏆 [FINALIZE] Nível:", level);

    // 6. Criar cliente Supabase
    const supabase = await createClient();

    // 7. Salvar no Supabase
    console.log("💾 [FINALIZE] Salvando no Supabase...");
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
      console.error("❌ [FINALIZE] Erro ao salvar:", error);
      return NextResponse.json(
        { error: "Erro ao salvar resultado", details: error.message },
        { status: 500 }
      );
    }

    console.log("✅ [FINALIZE] Resultado salvo com ID:", data.id);

    return NextResponse.json({
      success: true,
      resultId: data.id,
      overallScore,
      level,
      dimensionScores,
    });
  } catch (error) {
    console.error("❌ [FINALIZE] Erro geral:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}