import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { listing_id, buyer_id, conversation_id } = req.body;

  if (!listing_id || !buyer_id || !conversation_id) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Get listing details
    const { data: listing, error: listingError } = await supabaseAdmin
      .from("listings")
      .select("*, profiles!listings_seller_id_fkey(id, full_name, stripe_account_id)")
      .eq("id", listing_id)
      .single();

    if (listingError || !listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (listing.status !== "active") {
      return res.status(400).json({ error: "Listing is no longer available" });
    }

    if (listing.seller_id === buyer_id) {
      return res.status(400).json({ error: "You cannot buy your own listing" });
    }

    const sellerStripeId = listing.profiles?.stripe_account_id;
    if (!sellerStripeId) {
      return res.status(400).json({ error: "Seller has not set up payments yet" });
    }

    // Calculate amounts in cents
    const totalAmount = Math.round(listing.price * 100);
    const platformFee = Math.round(totalAmount * 0.03); // 3% platform cut
    const sellerAmount = totalAmount - platformFee;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: listing.title,
              description: `Payment for listing ${listing.title}`,
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: {
          destination: sellerStripeId,
        },
        metadata: {
          listing_id,
          buyer_id,
          seller_id: listing.seller_id,
          conversation_id,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/messages?id=${conversation_id}&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/messages?id=${conversation_id}&canceled=true`,
      metadata: {
        listing_id,
        buyer_id,
        seller_id: listing.seller_id,
        conversation_id,
      },
    });

    const orderPayload = {
      listing_id,
      buyer_id,
      seller_id: listing.seller_id,
      conversation_id,
      amount: listing.price,
      platform_fee: platformFee / 100,
      seller_amount: sellerAmount / 100,
      stripe_payment_intent_id: session.payment_intent,
      status: "pending",
    };

    await supabaseAdmin.from("orders").insert(orderPayload);

    return res.status(200).json({
      url: session.url,
      listing,
    });
  } catch (err) {
    console.error("Checkout error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}