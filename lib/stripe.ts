import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia" as any,
  typescript: true,
});

export async function createPaymentIntent(amount: number, currency: string = "usd") {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
}

export async function createCheckoutSession(
  lineItems: Array<{ price_data: { currency: string; product_data: { name: string; images?: string[] }; unit_amount: number }; quantity: number }>,
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>
) {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  } as any);

  return session;
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}

export async function refundPayment(paymentIntentId: string, amount?: number) {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined,
  });

  return refund;
}
