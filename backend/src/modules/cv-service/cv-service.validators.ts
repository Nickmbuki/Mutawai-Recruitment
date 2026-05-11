import { z } from "zod";

export const mpesaInitiateSchema = z.object({
  phone: z.string().min(9).max(20),
});

export const paypalCaptureSchema = z.object({
  orderId: z.string().min(6).max(120),
});

export const cvGenerateSchema = z.object({
  paymentId: z.coerce.number().int().positive(),
  formatId: z.enum(["format-1", "format-2"]),
});

export type MpesaInitiateInput = z.infer<typeof mpesaInitiateSchema>;
export type PaypalCaptureInput = z.infer<typeof paypalCaptureSchema>;
export type CvGenerateInput = z.infer<typeof cvGenerateSchema>;
