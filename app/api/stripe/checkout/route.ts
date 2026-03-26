import { createClient } from "@supabase/supabase-js";

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

    // Obter usuário autenticado
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Validar que o priceId é um dos configurados
    const validPriceIds = [
      process.env.NEXT_PUBLIC_STRIPE_PRICE_BRONZE,
      process.env.NEXT_PUBLIC_STRIPE_PRICE_SILVER,
      process.env.NEXT_PUBLIC_STRIPE_PRICE_GOLD,
    ];

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
      .single();

    if (subscription?.stripe_customer_id) {
      customerId = subscription.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      });
      customerId = customer.id;
    }

    // Criar checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/planos?checkout=cancelled`,
      metadata: {
        user_id: user.id,
        price_id: priceId,
      },
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
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
