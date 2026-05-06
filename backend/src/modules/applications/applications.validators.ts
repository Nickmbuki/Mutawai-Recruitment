import { z } from "zod";

export const createApplicationSchema = z.object({
  jobId: z.number().int().positive(),
  resumeUrl: z.string().url(),
  coverLetter: z.string().min(20).max(4000),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
