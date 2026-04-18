import { createClient } from "@/lib/supabase/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json();

    // Validar priceId
    if (!priceId) {
      return new Response(JSON.stringify({ error: "Price ID is required" }), {
        status: 400,
      });
    }

    // Obter usuário autenticado via cookies (server-side)
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Validar que o priceId é um dos configurados (variáveis server-side)
    const validPriceIds = [
      process.env.STRIPE_PRICE_BRONZE,
      process.env.STRIPE_PRICE_SILVER,
    ].filter(Boolean);

    if (!validPriceIds.includes(priceId)) {
      return new Response(
        JSON.stringify({ error: "Invalid price ID" }),
        { status: 400 }
      );
    }

    // Obter ou criar customer Stripe
    let customerId: string;

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (subscription?.stripe_customer_id) {
      customerId = subscription.stripe_customer_id;
    } else {
      // Buscar nome do usuário
      const { data: userData } = await supabase
        .from("users")
        .select("name, company")
        .eq("id", user.id)
        .maybeSingle();

      const customer = await stripe.customers.create({
        email: user.email,
        name: userData?.name || undefined,
        metadata: {
          user_id: user.id,
          company: userData?.company || "",
        },
      });
      customerId = customer.id;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://datamaturity.com.br";

    // Criar checkout session — mode: "payment" para pagamento avulso (one-time)
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/planos?checkout=cancelled`,
      metadata: {
        user_id: user.id,
        price_id: priceId,
      },
      payment_intent_data: {
        metadata: {
          user_id: user.id,
          price_id: priceId,
        },
      },
    });

    return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Checkout error" }),
      { status: 500 }
    );
  }
}
