import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Informe email e senha válidos." },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, publishableKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: "Email ou senha inválidos." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API LOGIN ERROR:", error);
    return NextResponse.json(
      { error: "Erro interno ao fazer login." },
      { status: 500 }
    );
  }
}