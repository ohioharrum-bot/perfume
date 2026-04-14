import Stripe from "stripe";
import { supabase } from "../../lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ error: "User ID required" });
  }

  try {
    // Get user's stripe account id
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_account_id")
      .eq("id", user_id)
      .single();

    if (!profile?.stripe_account_id) {
      return res.status(200).json({ connected: false, status: "not_connected" });
    }

    // Check account status with Stripe
    const account = await stripe.accounts.retrieve(profile.stripe_account_id);

    // For Express accounts, charges_enabled might not be immediately true
    // Consider connected if details are submitted (onboarding completed)
    const connected = account.details_submitted;

    res.status(200).json({
      connected,
      status: connected ? "connected" : "incomplete",
      account_id: profile.stripe_account_id,
      charges_enabled: account.charges_enabled,
      details_submitted: account.details_submitted,
      requirements: account.requirements,
    });
  } catch (err) {
    console.error("Stripe status check error:", err.message);
    res.status(500).json({ error: "Unable to check Stripe status" });
  }
}