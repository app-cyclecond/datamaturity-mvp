import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export type PlanType = "starter" | "bronze" | "silver" | "gold";

export interface SubscriptionInfo {
  hasActiveSubscription: boolean;
  plan: PlanType;
  status: "active" | "cancelled" | "expired" | "pending";
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  stripeSubscriptionId?: string;
}

/**
 * Obtém informações de assinatura do usuário
 */
export async function getSubscriptionInfo(userId: string): Promise<SubscriptionInfo> {
  try {
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !subscription) {
      // Se não tiver assinatura, retorna starter padrão
      return {
        hasActiveSubscription: false,
        plan: "starter",
        status: "pending",
      };
    }

    // Verificar se a assinatura expirou
    const now = new Date();
    const periodEnd = subscription.current_period_end ? new Date(subscription.current_period_end) : null;
    
    const isExpired = periodEnd && now > periodEnd && subscription.status === "active";

    return {
      hasActiveSubscription: subscription.status === "active" && !isExpired,
      plan: subscription.plan,
      status: isExpired ? "expired" : subscription.status,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      stripeSubscriptionId: subscription.stripe_subscription_id,
    };
  } catch (error) {
    console.error("Erro ao obter informações de assinatura:", error);
    return {
      hasActiveSubscription: false,
      plan: "starter",
      status: "pending",
    };
  }
}

/**
 * Verifica se o usuário tem acesso a um recurso específico
 */
export async function hasAccessToFeature(
  userId: string,
  requiredPlan: PlanType
): Promise<boolean> {
  const subscription = await getSubscriptionInfo(userId);

  if (!subscription.hasActiveSubscription) {
    return requiredPlan === "starter";
  }

  // Hierarquia de planos
  const planHierarchy: Record<PlanType, number> = {
    starter: 0,
    bronze: 1,
    silver: 2,
    gold: 3,
  };

  return planHierarchy[subscription.plan] >= planHierarchy[requiredPlan];
}

/**
 * Formata informações de assinatura para exibição
 */
export function formatSubscriptionInfo(info: SubscriptionInfo): string {
  if (!info.hasActiveSubscription) {
    return "Sem assinatura ativa";
  }

  const planNames: Record<PlanType, string> = {
    starter: "Plano Gratuito",
    bronze: "Plano Bronze",
    silver: "Plano Silver",
    gold: "Plano Gold",
  };

  let message = `${planNames[info.plan]} - ${info.status}`;

  if (info.currentPeriodEnd) {
    const endDate = new Date(info.currentPeriodEnd);
    message += ` (até ${endDate.toLocaleDateString("pt-BR")})`;
  }

  if (info.cancelAtPeriodEnd) {
    message += " - Será cancelado ao final do período";
  }

  return message;
}

/**
 * Obtém o preço de um plano em centavos
 */
export function getPlanPrice(plan: PlanType): number {
  const prices: Record<PlanType, number> = {
    starter: 0, // Gratuito
    bronze: 9900, // R$ 99,00
    silver: 19900, // R$ 199,00
    gold: 49900, // R$ 499,00
  };

  return prices[plan];
}

/**
 * Formata preço para exibição
 */
export function formatPrice(cents: number): string {
  const reais = cents / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(reais);
}

/**
 * Obtém descrição do plano
 */
export function getPlanDescription(plan: PlanType): string {
  const descriptions: Record<PlanType, string> = {
    starter: "Perfeito para começar. 1 diagnóstico por mês.",
    bronze: "Para empresas em crescimento. 3 diagnósticos por mês.",
    silver: "Para empresas em expansão. 10 diagnósticos por mês.",
    gold: "Para empresas que querem tudo. Diagnósticos ilimitados.",
  };

  return descriptions[plan];
}

/**
 * Obtém features de cada plano
 */
export function getPlanFeatures(plan: PlanType): string[] {
  const features: Record<PlanType, string[]> = {
    starter: [
      "1 diagnóstico por mês",
      "Acesso básico à biblioteca",
      "Relatórios em PDF",
      "Suporte por email",
    ],
    bronze: [
      "3 diagnósticos por mês",
      "Acesso completo à biblioteca",
      "Relatórios em PDF",
      "Comparação com benchmarks",
      "Suporte prioritário",
    ],
    silver: [
      "10 diagnósticos por mês",
      "Acesso completo à biblioteca",
      "Relatórios em PDF e Excel",
      "Comparação com benchmarks",
      "Suporte prioritário",
      "Análise de tendências",
    ],
    gold: [
      "Diagnósticos ilimitados",
      "Acesso completo à biblioteca",
      "Relatórios em PDF, Excel e PowerPoint",
      "Comparação com benchmarks",
      "Suporte VIP 24/7",
      "Análise de tendências",
      "Consultoria estratégica",
      "API access",
    ],
  };

  return features[plan];
}
