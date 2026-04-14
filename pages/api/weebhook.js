import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);


export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const rawBody = await getRawBody(req);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return res.status(400).json({ error: "Webhook signature verification failed" });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const { listing_id, buyer_id, seller_id } = paymentIntent.metadata;

      // Update order status to paid
      await supabaseAdmin
        .from("orders")
        .update({
          status: "paid",
          stripe_transfer_id: paymentIntent.transfer_data?.destination,
        })
        .eq("stripe_payment_intent_id", paymentIntent.id);

      // Mark listing as sold
      await supabaseAdmin
        .from("listings")
        .update({ status: "sold" })
        .eq("id", listing_id);

      console.log(`Payment succeeded — listing ${listing_id} sold to ${buyer_id}`);
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;

      // Update order status to failed
      await supabaseAdmin
        .from("orders")
        .update({ status: "failed" })
        .eq("stripe_payment_intent_id", paymentIntent.id);

      console.log(`Payment failed for intent ${paymentIntent.id}`);
    }

    if (event.type === "account.updated") {
      const account = event.data.object;
      console.log(`Stripe account updated: ${account.id}`);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}