import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
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

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;

        // Obter user_id do customer metadata
        const customer = await stripe.customers.retrieve(subscription.customer);
        const userId = customer.metadata?.user_id;

        if (!userId) {
          console.error("No user_id found in customer metadata");
          return new Response("No user_id found", { status: 400 });
        }

        // Mapear Stripe price ID para plano
        const priceIdToPlan: Record<string, string> = {
          [process.env.STRIPE_PRICE_BRONZE || ""]: "bronze",
          [process.env.STRIPE_PRICE_SILVER || ""]: "silver",
          [process.env.STRIPE_PRICE_GOLD || ""]: "gold",
        };

        const items = subscription.items.data;
        const priceId = items[0]?.price.id;
        const plan = priceIdToPlan[priceId] || "starter";

        // Atualizar ou criar subscription
        const { error: upsertError } = await supabase
          .from("subscriptions")
          .upsert(
            {
              user_id: userId,
              plan,
              status: subscription.status === "active" ? "active" : "pending",
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer,
              current_period_start: new Date(
                subscription.current_period_start * 1000
              ).toISOString(),
              current_period_end: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
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
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        const userId = customer.metadata?.user_id;

        if (!userId) {
          return new Response("No user_id found", { status: 400 });
        }

        // Atualizar subscription para cancelled
        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({
            status: "cancelled",
            plan: "starter",
          })
          .eq("user_id", userId);

        if (updateError) {
          console.error("Error updating subscription:", updateError);
          return new Response("Error updating subscription", { status: 500 });
        }

        // Atualizar plano na tabela users para starter
        const { error: updateUserError } = await supabase
          .from("users")
          .update({ plan: "starter" })
          .eq("id", userId);

        if (updateUserError) {
          console.error("Error updating user plan:", updateUserError);
        }

        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        const customer = await stripe.customers.retrieve(invoice.customer);
        const userId = customer.metadata?.user_id;

        if (!userId) {
          return new Response("No user_id found", { status: 400 });
        }

        // Obter subscription para pegar o plano
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("plan")
          .eq("user_id", userId)
          .single();

        // Criar registro de invoice
        const { error: invoiceError } = await supabase
          .from("invoices")
          .insert({
            user_id: userId,
            subscription_id: subscription?.id,
            stripe_invoice_id: invoice.id,
            amount_paid: invoice.amount_paid,
            currency: invoice.currency,
            status: "paid",
            period_start: new Date(invoice.period_start * 1000).toISOString(),
            period_end: new Date(invoice.period_end * 1000).toISOString(),
            paid_at: new Date(invoice.paid_at * 1000).toISOString(),
          });

        if (invoiceError) {
          console.error("Error creating invoice record:", invoiceError);
        }

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return new Response(`Webhook handler error: ${error.message}`, {
      status: 500,
    });
  }
}
