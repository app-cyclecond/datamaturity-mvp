import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Erro ao buscar usuário:", userError);
    return NextResponse.json(
      { error: "Erro ao buscar usuário autenticado" },
      { status: 401 }
    );
  }

  if (!user?.id) {
    console.error("Usuário não encontrado na sessão");
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  const { score, level, dimensionScores } = await req.json();

  const { data, error } = await supabase
    .from("assessment_results")
    .insert({
      user_id: user.id,
      overall_score: score,
      level,
      dimension_scores: dimensionScores,
    })
    .select();

  if (error) {
    console.error("Erro ao salvar assessment:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    user_id: user.id,
    inserted: data,
  });
}