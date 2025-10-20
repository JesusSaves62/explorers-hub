exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const { priceId, mode, quantity = 1, metadata = {} } = JSON.parse(event.body || "{}");

    if (!priceId) return { statusCode: 400, body: "Missing priceId" };
    if (mode !== "payment" && mode !== "subscription") {
      return { statusCode: 400, body: "Invalid mode (use 'payment' or 'subscription')" };
    }

    const origin = event.headers.origin || `https://${event.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity }],
      allow_promotion_codes: true,
      success_url: `${origin}/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancelled/`,
      metadata
      // shipping_address_collection: { allowed_countries: ['US'] }, // enable if shipping
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: session.id, url: session.url })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
