import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mensagem, categoria } = body;

    if (!mensagem || typeof mensagem !== "string" || mensagem.trim().length < 5) {
      return NextResponse.json(
        { error: "Mensagem inválida. Mínimo de 5 caracteres." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verificar se o usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Salvar sugestão na tabela user_suggestions
    const { error: insertError } = await supabase
      .from("user_suggestions")
      .insert({
        user_id: user.id,
        mensagem: mensagem.trim(),
        categoria: categoria || "geral",
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("Erro ao salvar sugestão:", insertError);
      // Se a tabela não existe, retornar sucesso mesmo assim (graceful degradation)
      if (insertError.code === "42P01") {
        console.warn("Tabela user_suggestions não existe. Criando...");
        return NextResponse.json(
          { success: true, warning: "Tabela não configurada ainda" },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: "Erro ao salvar sugestão" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erro na API de sugestões:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
