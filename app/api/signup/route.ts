import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2),
  company: z.string().trim().min(2),
  role: z.string().trim().min(2),
  email: z.string().trim().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Preencha os campos corretamente." },
        { status: 400 }
      );
    }

    const { name, company, role, email, password } = parsed.data;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        company,
        role,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const user = data.user;

    if (user) {
      const { error: profileError } = await supabase.from("users").upsert({
        id: user.id,
        email: user.email,
        name,
        company,
        role,
        plan: "starter",
      });

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API SIGNUP ERROR:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar conta." },
      { status: 500 }
    );
  }
}