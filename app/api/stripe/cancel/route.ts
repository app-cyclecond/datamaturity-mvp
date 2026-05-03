import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const { reason } = await request.json();

    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authData.user.id;

    // Buscar dados do usuário e assinatura
    const { data: userData } = await supabase
      .from("users")
      .select("name, email, plan")
      .eq("id", userId)
      .single();

    const { data: subData } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!subData) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    // Registrar o motivo de cancelamento no banco
    await supabase.from("subscriptions").update({
      cancel_at_period_end: true,
      status: "cancelled",
    }).eq("user_id", userId);

    // Rebaixar o plano para starter imediatamente
    await supabase.from("users").update({ plan: "starter" }).eq("id", userId);

    // Cancelar no Stripe se houver ID de assinatura
    if (subData.stripe_subscription_id && subData.stripe_subscription_id.startsWith("sub_")) {
      try {
        await stripe.subscriptions.cancel(subData.stripe_subscription_id);
      } catch (stripeError) {
        console.error("Stripe cancel error:", stripeError);
        // Não falha se o Stripe der erro — o banco já foi atualizado
      }
    }

    // Enviar e-mail de confirmação de cancelamento
    const userEmail = userData?.email || authData.user.email || "";
    const userName = userData?.name || "Cliente";
    const planLabel = userData?.plan === "silver" ? "Silver" : "Bronze";

    if (userEmail) {
      await resend.emails.send({
        from: "DataMaturity <noreply@datamaturity.com.br>",
        to: userEmail,
        subject: "Sua assinatura foi cancelada — DataMaturity",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-block; background: #4f46e5; color: white; font-weight: bold; font-size: 18px; padding: 10px 20px; border-radius: 8px;">DM DataMaturity</div>
            </div>
            <h2 style="color: #111827;">Assinatura cancelada</h2>
            <p>Olá, ${userName}.</p>
            <p>Confirmamos o cancelamento da sua assinatura <strong>${planLabel}</strong>. Sentimos muito em ver você partir.</p>
            <p style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; font-size: 14px; color: #6b7280;">
              <strong>Motivo informado:</strong> ${reason}
            </p>
            <p>Seu acesso ao plano gratuito permanece ativo. Você pode fazer um novo diagnóstico a qualquer momento e retornar quando quiser.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://datamaturity.com.br/planos" style="background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Reativar Assinatura</a>
            </div>
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">DataMaturity · contato@datamaturity.com.br</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
