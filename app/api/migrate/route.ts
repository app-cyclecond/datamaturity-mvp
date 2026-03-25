import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Criar cliente Supabase com service role key para operações administrativas
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(request: NextRequest) {
  // Verificar autenticação (apenas admin pode executar migrações)
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.MIGRATION_SECRET_KEY;

  if (!authHeader || !expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { data, error } = await supabaseAdmin.rpc("exec_sql", {
      sql: `
        -- Add industry column to users table
        ALTER TABLE public.users 
        ADD COLUMN IF NOT EXISTS industry TEXT DEFAULT 'Tech' 
        CHECK (industry IN ('Tech', 'Financeiro', 'Retail', 'Saúde', 'Manufatura', 'Outro'));

        -- Update plan column constraint
        ALTER TABLE public.users 
        DROP CONSTRAINT IF EXISTS users_plan_check;

        ALTER TABLE public.users 
        ADD CONSTRAINT users_plan_check 
        CHECK (plan IN ('bronze', 'silver', 'gold', 'starter'));

        -- Create content_library table
        CREATE TABLE IF NOT EXISTS public.content_library (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          description TEXT,
          pillar TEXT NOT NULL CHECK (pillar IN ('técnico', 'regulatório', 'cultura')),
          content_url TEXT,
          required_plan TEXT NOT NULL CHECK (required_plan IN ('bronze', 'silver', 'gold')),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Enable RLS
        ALTER TABLE public.content_library ENABLE ROW LEVEL SECURITY;

        -- Create policy
        CREATE POLICY IF NOT EXISTS "Users can view content based on their plan"
          ON public.content_library FOR SELECT
          USING (
            EXISTS (
              SELECT 1 FROM public.users u
              WHERE u.id = auth.uid()
              AND (
                u.plan = 'gold'
                OR (u.plan = 'silver' AND required_plan IN ('bronze', 'silver'))
                OR (u.plan = 'bronze' AND required_plan = 'bronze')
              )
            )
          );
      `,
    });

    if (error) {
      console.error("Migration error:", error);
      return NextResponse.json(
        { error: "Migration failed", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Database migration completed successfully",
      data,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error during migration" },
      { status: 500 }
    );
  }
}
