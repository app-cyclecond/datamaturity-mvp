import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

  // Cliente Supabase com service role para operações administrativas
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

  // Mapeamento de price_id → plano
  const priceIdToPlan: Record<string, string> = {
    [process.env.STRIPE_PRICE_BRONZE || ""]: "bronze",
    [process.env.STRIPE_PRICE_SILVER || ""]: "silver",
  };

  try {
    switch (event.type) {
      // ─── Pagamento avulso confirmado ───────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object;

        // Apenas processar sessões de pagamento (não subscription)
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
        expiresAt.setFullYear(expiresAt.getFullYear() + 1); // +12 meses

        // Upsert na tabela subscriptions
        const { error: upsertError } = await supabase
          .from("subscriptions")
          .upsert(
            {
              user_id: userId,
              plan,
              status: "active",
              stripe_customer_id: session.customer || null,
              stripe_subscription_id: session.id, // checkout session ID como referência
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

        // Atualizar plano na tabela users
        const { error: updateUserError } = await supabase
          .from("users")
          .update({ plan })
          .eq("id", userId);

        if (updateUserError) {
          console.error("Error updating user plan:", updateUserError);
          return new Response("Error updating user plan", { status: 500 });
        }

        // Registrar invoice
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
          // Não crítico — logar mas não falhar
          console.error("Error creating invoice record:", invoiceError);
        }

        console.log(`Plano ${plan} ativado para user ${userId} ate ${expiresAt.toISOString()}`);
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
