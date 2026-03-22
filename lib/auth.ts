"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { z } from "zod";

// ============================================
// SCHEMAS DE VALIDAÇÃO
// ============================================

const signUpSchema = z.object({
  name: z.string().trim().min(2, "Nome precisa ter pelo menos 2 caracteres"),
  company: z.string().trim().min(2, "Empresa precisa ter pelo menos 2 caracteres"),
  role: z.string().trim().min(2, "Cargo precisa ter pelo menos 2 caracteres"),
  email: z.string().trim().email("Email inválido"),
  password: z.string().min(6, "Senha precisa ter pelo menos 6 caracteres"),
});

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

function getField(formData: any, field: string ) {
  if (typeof formData?.get === "function") {
    return String(formData.get(field) ?? "").trim();
  }
  return String(formData?.[field] ?? "").trim();
}

function getPassword(formData: any, field: string) {
  if (typeof formData?.get === "function") {
    return String(formData.get(field) ?? "");
  }
  return String(formData?.[field] ?? "");
}

// ============================================
// AUTENTICAÇÃO - PEGAR USUÁRIO
// ============================================

/**
 * Pega o usuário autenticado atual
 * Retorna null se não estiver autenticado
 */
export async function getAuthenticatedUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Erro ao pegar usuário autenticado:", error);
    return null;
  }
}

// ============================================
// AUTENTICAÇÃO - SIGN UP
// ============================================

export async function signUpAction(formData: any) {
  const values = {
    name: getField(formData, "name"),
    company: getField(formData, "company"),
    role: getField(formData, "role"),
    email: getField(formData, "email"),
    password: getPassword(formData, "password"),
  };

  const parsed = signUpSchema.safeParse(values);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError =
      fieldErrors.name?.[0] ||
      fieldErrors.company?.[0] ||
      fieldErrors.role?.[0] ||
      fieldErrors.email?.[0] ||
      fieldErrors.password?.[0] ||
      "Preencha os campos corretamente.";
    return { error: firstError };
  }

  const { name, company, role, email, password } = parsed.data;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getBaseUrl()}/auth/callback`,
      data: {
        name,
        company,
        role,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const { error: profileError } = await supabaseAdmin.from("users").upsert({
      id: data.user.id,
      email: data.user.email,
      name,
      company,
      role,
      plan: "starter",
    });

    if (profileError) {
      return { error: profileError.message };
    }
  }

  redirect("/login");
}

// ============================================
// AUTENTICAÇÃO - SIGN IN
// ============================================

export async function signInAction(formData: any) {
  const email = getField(formData, "email");
  const password = getPassword(formData, "password");

  if (!email || !password) {
    return { error: "Informe email e senha." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Email ou senha inválidos." };
  }

  redirect("/dashboard");
}

// ============================================
// AUTENTICAÇÃO - MAGIC LINK
// ============================================

export async function magicLinkAction(formData: any) {
  const email = getField(formData, "email");

  if (!email) {
    return { error: "Informe um email válido." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getBaseUrl()}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Magic link enviada para seu email." };
}

// ============================================
// AUTENTICAÇÃO - SIGN OUT
// ============================================

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}