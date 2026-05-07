import { z } from "zod";

export const createApplicationSchema = z.object({
  jobId: z.number().int().positive(),
  resumeUrl: z.string().url(),
  coverLetter: z.string().min(20).max(4000),
});

export const updateApplicationSchema = z.object({
  status: z
    .enum(["submitted", "reviewing", "shortlisted", "processing", "approved", "prequalified", "rejected", "hired"])
    .optional(),
  adminComment: z.string().max(4000).optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
