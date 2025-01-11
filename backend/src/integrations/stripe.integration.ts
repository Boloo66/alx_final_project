import getEnv from "../config/env.config";
import stripe, { Stripe } from "stripe";
const { STRIPE_SECRET_KEY: sk } = getEnv();

const stripeSdk = new Stripe(sk);

export const createPaymentIntent = async (
  amount: number,
  { sdk = stripeSdk } = {}
) => {
  const amountInCents = Math.round(amount * 100);

  const { client_secret } = await sdk.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
  });

  return client_secret as string;
};
