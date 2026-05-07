import { z } from "zod";

export const candidateParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const applicationParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateCandidateSchema = z.object({
  name: z.string().min(2).max(160).optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().min(7).max(40).optional(),
  nationalIdOrPassport: z.string().min(4).max(120).optional(),
  candidateStatus: z
    .enum(["processing", "approved", "prequalified", "rejected", "blocked"])
    .optional(),
  paymentStatus: z.enum(["pending", "verified", "rejected"]).optional(),
  adminComment: z.string().max(4000).optional(),
});

export const createCandidateSchema = z.object({
  name: z.string().min(2).max(160),
  email: z.string().email().max(255),
  phone: z.string().min(7).max(40),
  nationalIdOrPassport: z.string().min(4).max(120),
  password: z.string().min(8).max(128).optional(),
  paymentMethod: z.enum(["mpesa", "paypal"]).optional(),
  paymentReference: z.string().max(180).optional(),
  paymentStatus: z.enum(["pending", "verified", "rejected"]).default("pending"),
  candidateStatus: z
    .enum(["processing", "approved", "prequalified", "rejected", "blocked"])
    .default("processing"),
  adminComment: z.string().max(4000).optional(),
});

export const updateApplicationAdminSchema = z.object({
  status: z
    .enum([
      "submitted",
      "reviewing",
      "shortlisted",
      "processing",
      "approved",
      "prequalified",
      "rejected",
      "hired",
    ])
    .optional(),
  adminComment: z.string().max(4000).optional(),
});

export type UpdateCandidateInput = z.infer<typeof updateCandidateSchema>;
export type CreateCandidateInput = z.infer<typeof createCandidateSchema>;
export type UpdateApplicationAdminInput = z.infer<typeof updateApplicationAdminSchema>;
