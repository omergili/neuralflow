import Stripe from "stripe";

// Stripe is optional until payment is enabled
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-03-25.dahlia",
      typescript: true,
    })
  : null;

// Stripe Price ID for Pro plan (€49/month) — set in .env
export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID ?? "";
