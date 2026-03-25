import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export type UserPlan = "starter" | "bronze" | "silver" | "gold";

export interface AccessCheckResult {
  hasAccess: boolean;
  reason?: string;
  plan?: UserPlan;
  attemptsUsed?: number;
  attemptsLimit?: number;
  nextResetDate?: string;
}

// Limites de tentativas por plano (por mês)
const ATTEMPT_LIMITS: Record<UserPlan, number> = {
  starter: 1, // Plano gratuito: 1 tentativa por mês
  bronze: 3, // Bronze: 3 tentativas por mês
  silver: 10, // Silver: 10 tentativas por mês
  gold: 999, // Gold: ilimitado (praticamente)
};

/**
 * Verifica se o usuário tem acesso ao assessment completo
 */
export async function checkAssessmentAccess(userId: string): Promise<AccessCheckResult> {
  try {
    // Buscar dados do usuário
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("plan")
      .eq("id", userId)
      .single();

    if (userError || !userData) {
      return {
        hasAccess: false,
        reason: "Usuário não encontrado",
      };
    }

    const userPlan = (userData.plan as UserPlan) || "starter";

    // Se for Gold, tem acesso ilimitado
    if (userPlan === "gold") {
      return {
        hasAccess: true,
        plan: userPlan,
        attemptsLimit: ATTEMPT_LIMITS.gold,
      };
    }

    // Verificar tentativas do mês atual
    const { data: attempts, error: attemptsError } = await supabase
      .from("assessment_results")
      .select("created_at")
      .eq("user_id", userId)
      .gte("created_at", getMonthStart().toISOString());

    if (attemptsError) {
      return {
        hasAccess: false,
        reason: "Erro ao verificar tentativas",
      };
    }

    const attemptsUsed = attempts?.length || 0;
    const attemptsLimit = ATTEMPT_LIMITS[userPlan];

    // Se atingiu o limite
    if (attemptsUsed >= attemptsLimit) {
      return {
        hasAccess: false,
        reason: `Você atingiu o limite de ${attemptsLimit} diagnóstico(s) por mês. Tente novamente em ${getMonthEnd().toLocaleDateString("pt-BR")}`,
        plan: userPlan,
        attemptsUsed,
        attemptsLimit,
        nextResetDate: getMonthEnd().toISOString(),
      };
    }

    // Tem acesso
    return {
      hasAccess: true,
      plan: userPlan,
      attemptsUsed,
      attemptsLimit,
    };
  } catch (error) {
    console.error("Erro ao verificar acesso:", error);
    return {
      hasAccess: false,
      reason: "Erro ao verificar acesso",
    };
  }
}

/**
 * Verifica se o usuário tem um plano válido (não é starter/gratuito)
 */
export function hasValidPlan(plan: UserPlan): boolean {
  return plan !== "starter";
}

/**
 * Retorna o primeiro dia do mês atual
 */
function getMonthStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

/**
 * Retorna o último dia do mês atual
 */
function getMonthEnd(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0);
}

/**
 * Formata mensagem de limite de tentativas
 */
export function formatAttemptMessage(result: AccessCheckResult): string {
  if (!result.attemptsLimit) return "";
  
  const remaining = result.attemptsLimit - (result.attemptsUsed || 0);
  
  if (remaining <= 0) {
    return `Você atingiu o limite de ${result.attemptsLimit} diagnóstico(s) este mês.`;
  }
  
  if (remaining === 1) {
    return `Você tem ${remaining} diagnóstico restante este mês.`;
  }
  
  return `Você tem ${remaining} diagnósticos restantes este mês.`;
}
