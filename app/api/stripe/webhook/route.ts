import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

const planLabels: Record<string, string> = {
  bronze: "Bronze",
  silver: "Silver",
};

const planFeatures: Record<string, string[]> = {
  bronze: [
    "2 diagnósticos completos por ano",
    "Score em 7 dimensões de maturidade",
    "Relatório em PDF",
    "Roadmap de ação personalizado",
  ],
  silver: [
    "4 diagnósticos completos por ano",
    "Score em 7 dimensões de maturidade",
    "Relatório avançado em PDF",
    "Roadmap de ação personalizado",
    "Benchmarking setorial",
    "Acesso à Biblioteca de recursos",
  ],
};

async function sendWelcomeEmail(
  toEmail: string,
  userName: string,
  plan: string,
  expiresAt: Date
) {
  const planLabel = planLabels[plan] || plan;
  const features = planFeatures[plan] || [];
  const expiresFormatted = expiresAt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const featuresHtml = features
    .map((f) => `<li style="margin-bottom:8px;padding-left:8px;">✅ ${f}</li>`)
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bem-vindo ao DataMaturity ${planLabel}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#db2777);padding:40px 40px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">DataMaturity</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Plataforma de Diagnóstico de Maturidade de Dados</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#1e1b4b;font-size:22px;">Pagamento confirmado! 🎉</h2>
              <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Olá, <strong>${userName}</strong>! Seu plano <strong>DataMaturity ${planLabel}</strong> está ativo e pronto para uso.</p>
              <div style="background:linear-gradient(135deg,#7c3aed,#db2777);border-radius:10px;padding:24px;margin-bottom:28px;text-align:center;">
                <p style="margin:0 0 4px;color:rgba(255,255,255,0.8);font-size:13px;text-transform:uppercase;letter-spacing:1px;">Plano Ativo</p>
                <p style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">DataMaturity ${planLabel}</p>
                <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">Válido até ${expiresFormatted}</p>
              </div>
              <h3 style="margin:0 0 16px;color:#1e1b4b;font-size:16px;">O que está incluído no seu plano:</h3>
              <ul style="margin:0 0 28px;padding:0;list-style:none;color:#374151;font-size:14px;line-height:1.6;">
                ${featuresHtml}
              </ul>
              <div style="text-align:center;margin-bottom:28px;">
                <a href="https://datamaturity.com.br/dashboard" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#db2777);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:16px;font-weight:600;">
                  Acessar meu Dashboard →
                </a>
              </div>
              <p style="margin:0;color:#9ca3af;font-size:13px;text-align:center;">
                Dúvidas? Entre em contato pelo <a href="mailto:suporte@datamaturity.com.br" style="color:#7c3aed;text-decoration:none;">suporte@datamaturity.com.br</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © ${new Date().getFullYear()} DataMaturity · CNPJ 54.730.434/0001-92<br/>
                <a href="https://datamaturity.com.br/privacidade" style="color:#9ca3af;">Política de Privacidade</a> · 
                <a href="https://datamaturity.com.br/termos" style="color:#9ca3af;">Termos de Uso</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const { error } = await resend.emails.send({
      from: "DataMaturity <noreply@datamaturity.com.br>",
      to: [toEmail],
      subject: `✅ Plano ${planLabel} ativado — Bem-vindo ao DataMaturity!`,
      html,
    });
    if (error) {
      console.error("Resend error (welcome):", error);
    } else {
      console.log(`E-mail de boas-vindas enviado para ${toEmail}`);
    }
  } catch (err) {
    console.error("Erro ao enviar e-mail de boas-vindas:", err);
  }
}

async function sendRefundEmail(
  toEmail: string,
  userName: string,
  canceledPlan: string,
  refundAmount: number
) {
  const planLabel = planLabels[canceledPlan] || canceledPlan;
  const amountFormatted = (refundAmount / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reembolso processado — DataMaturity</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#374151,#6b7280);padding:40px 40px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">DataMaturity</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Plataforma de Diagnóstico de Maturidade de Dados</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#1e1b4b;font-size:22px;">Reembolso processado</h2>
              <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Olá, <strong>${userName}</strong>. O reembolso do plano <strong>DataMaturity ${planLabel}</strong> foi processado com sucesso.</p>

              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:24px;margin-bottom:28px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color:#6b7280;font-size:14px;">Plano cancelado</td>
                    <td style="color:#1e1b4b;font-size:14px;font-weight:600;text-align:right;">DataMaturity ${planLabel}</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280;font-size:14px;padding-top:12px;">Valor reembolsado</td>
                    <td style="color:#059669;font-size:16px;font-weight:700;text-align:right;padding-top:12px;">${amountFormatted}</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280;font-size:14px;padding-top:12px;">Prazo para crédito</td>
                    <td style="color:#1e1b4b;font-size:14px;text-align:right;padding-top:12px;">Até 5 dias úteis</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280;font-size:14px;padding-top:12px;">Plano atual</td>
                    <td style="color:#1e1b4b;font-size:14px;text-align:right;padding-top:12px;">Gratuito</td>
                  </tr>
                </table>
              </div>

              <p style="margin:0 0 20px;color:#6b7280;font-size:14px;">
                Sua conta foi rebaixada para o plano gratuito. Você ainda pode acessar a plataforma e realizar um diagnóstico gratuito a qualquer momento.
              </p>

              <div style="text-align:center;margin-bottom:28px;">
                <a href="https://datamaturity.com.br/planos" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#db2777);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:16px;font-weight:600;">
                  Ver Planos Disponíveis
                </a>
              </div>

              <p style="margin:0;color:#9ca3af;font-size:13px;text-align:center;">
                Alguma dúvida? Fale com o suporte em <a href="mailto:suporte@datamaturity.com.br" style="color:#7c3aed;text-decoration:none;">suporte@datamaturity.com.br</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © ${new Date().getFullYear()} DataMaturity · CNPJ 54.730.434/0001-92<br/>
                <a href="https://datamaturity.com.br/privacidade" style="color:#9ca3af;">Política de Privacidade</a> · 
                <a href="https://datamaturity.com.br/termos" style="color:#9ca3af;">Termos de Uso</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const { error } = await resend.emails.send({
      from: "DataMaturity <noreply@datamaturity.com.br>",
      to: [toEmail],
      subject: `Reembolso processado — Plano ${planLabel} cancelado`,
      html,
    });
    if (error) {
      console.error("Resend error (refund):", error);
    } else {
      console.log(`E-mail de reembolso enviado para ${toEmail}`);
    }
  } catch (err) {
    console.error("Erro ao enviar e-mail de reembolso:", err);
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const priceIdToPlan: Record<string, string> = {
    [process.env.STRIPE_PRICE_BRONZE || ""]: "bronze",
    [process.env.STRIPE_PRICE_SILVER || ""]: "silver",
  };

  try {
    switch (event.type) {
      // ─── Pagamento confirmado ──────────────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object;

        if (session.mode !== "payment") break;
        if (session.payment_status !== "paid") break;

        const userId = session.metadata?.user_id;
        const priceId = session.metadata?.price_id;

        if (!userId || !priceId) {
          console.error("Missing metadata in checkout.session.completed", { userId, priceId });
          return new Response("Missing metadata", { status: 400 });
        }

        const plan = priceIdToPlan[priceId];
        if (!plan) {
          console.error("Unknown price_id:", priceId);
          return new Response("Unknown price_id", { status: 400 });
        }

        const now = new Date();
        const expiresAt = new Date(now);
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);

        const { error: upsertError } = await supabase
          .from("subscriptions")
          .upsert(
            {
              user_id: userId,
              plan,
              status: "active",
              stripe_customer_id: session.customer || null,
              stripe_subscription_id: session.id,
              current_period_start: now.toISOString(),
              current_period_end: expiresAt.toISOString(),
              cancel_at_period_end: false,
            },
            { onConflict: "user_id" }
          );

        if (upsertError) {
          console.error("Error upserting subscription:", upsertError);
          return new Response("Error upserting subscription", { status: 500 });
        }

        const { data: userData } = await supabase
          .from("users")
          .select("name, email")
          .eq("id", userId)
          .single();

        const { error: updateUserError } = await supabase
          .from("users")
          .update({ plan })
          .eq("id", userId);

        if (updateUserError) {
          console.error("Error updating user plan:", updateUserError);
          return new Response("Error updating user plan", { status: 500 });
        }

        const amountTotal = session.amount_total || 0;
        const { error: invoiceError } = await supabase
          .from("invoices")
          .insert({
            user_id: userId,
            stripe_subscription_id: session.id,
            stripe_invoice_id: session.payment_intent || session.id,
            amount_paid: amountTotal,
            currency: session.currency || "brl",
            status: "paid",
            period_start: now.toISOString(),
            period_end: expiresAt.toISOString(),
            paid_at: now.toISOString(),
          });

        if (invoiceError) {
          console.error("Error creating invoice record:", invoiceError);
        }

        const userEmail = userData?.email || session.customer_email || session.customer_details?.email;
        const userName = userData?.name || session.customer_details?.name || "Cliente";

        if (userEmail) {
          await sendWelcomeEmail(userEmail, userName, plan, expiresAt);
        } else {
          console.warn("E-mail do usuário não encontrado para envio de confirmação");
        }

        console.log(`Plano ${plan} ativado para user ${userId} ate ${expiresAt.toISOString()}`);
        break;
      }

      // ─── Reembolso processado → rebaixar para free ────────────────────────
      case "charge.refunded": {
        const charge = event.data.object;

        // Buscar o checkout session original via payment_intent
        const paymentIntentId = charge.payment_intent;
        if (!paymentIntentId) {
          console.warn("charge.refunded sem payment_intent, ignorando");
          break;
        }

        // Buscar a checkout session pelo payment_intent para obter o user_id
        let userId: string | null = null;
        let canceledPlan: string = "free";

        try {
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: paymentIntentId,
            limit: 1,
          });
          const session = sessions.data[0];
          if (session) {
            userId = session.metadata?.user_id || null;
          }
        } catch (err) {
          console.error("Erro ao buscar checkout session pelo payment_intent:", err);
        }

        if (!userId) {
          // Tentar buscar pelo stripe_customer_id
          const customerId = charge.customer;
          if (customerId) {
            const { data: sub } = await supabase
              .from("subscriptions")
              .select("user_id, plan")
              .eq("stripe_customer_id", customerId)
              .single();
            if (sub) {
              userId = sub.user_id;
              canceledPlan = sub.plan;
            }
          }
        }

        if (!userId) {
          console.warn("charge.refunded: não foi possível identificar o usuário");
          break;
        }

        // Buscar plano atual antes de rebaixar
        const { data: currentSub } = await supabase
          .from("subscriptions")
          .select("plan")
          .eq("user_id", userId)
          .single();

        if (currentSub?.plan) {
          canceledPlan = currentSub.plan;
        }

        // Rebaixar para free
        await supabase
          .from("subscriptions")
          .update({ plan: "starter", status: "cancelled", cancel_at_period_end: false })
          .eq("user_id", userId);

        await supabase
          .from("users")
          .update({ plan: "starter" })
          .eq("id", userId);

        // Atualizar invoice como reembolsado
        await supabase
          .from("invoices")
          .update({ status: "refunded" })
          .eq("stripe_invoice_id", paymentIntentId);

        // Buscar e-mail do usuário para notificação
        const { data: userData } = await supabase
          .from("users")
          .select("name, email")
          .eq("id", userId)
          .single();

        const refundAmount = charge.amount_refunded || charge.amount || 0;

        if (userData?.email) {
          await sendRefundEmail(
            userData.email,
            userData.name || "Cliente",
            canceledPlan,
            refundAmount
          );
        }

        console.log(`Plano rebaixado para starter após reembolso — user ${userId}`);
        break;
      }

      // ─── Falha no pagamento ────────────────────────────────────────────────
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata?.user_id;
        console.warn(`Pagamento falhou para user ${userId || "desconhecido"}:`, paymentIntent.last_payment_error?.message);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return new Response(`Webhook handler error: ${error.message}`, {
      status: 500,
    });
  }
}
