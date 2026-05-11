import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(24, "JWT_SECRET must be at least 24 characters"),
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  CV_SERVICE_AMOUNT_KES: z.string().default("1000"),
  CV_SERVICE_AMOUNT_USD: z.string().default("10.00"),
  MPESA_ENV: z.enum(["sandbox", "production"]).default("sandbox"),
  MPESA_CONSUMER_KEY: z.string().optional(),
  MPESA_CONSUMER_SECRET: z.string().optional(),
  MPESA_SHORTCODE: z.string().default("111999"),
  MPESA_ACCOUNT_REFERENCE: z.string().default("237633"),
  MPESA_PASSKEY: z.string().optional(),
  MPESA_CALLBACK_URL: z.string().url().optional(),
  PAYPAL_ENV: z.enum(["sandbox", "production"]).default("sandbox"),
  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),
  PAYPAL_RETURN_URL: z.string().url().optional(),
  PAYPAL_CANCEL_URL: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);
