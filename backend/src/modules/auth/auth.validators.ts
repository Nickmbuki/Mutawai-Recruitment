import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(160),
  email: z.string().email().max(255),
  phone: z.string().min(7).max(40),
  nationalIdOrPassport: z.string().min(4).max(120),
  password: z.string().min(8).max(128),
  paymentMethod: z.enum(["mpesa", "paypal"]),
  paymentReference: z.string().min(4).max(180),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
