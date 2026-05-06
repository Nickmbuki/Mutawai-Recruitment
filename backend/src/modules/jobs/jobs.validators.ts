import { z } from "zod";

export const jobParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createJobSchema = z.object({
  title: z.string().min(3).max(180),
  description: z.string().min(20),
  salaryRange: z.string().min(3).max(120),
  location: z.string().min(2).max(160),
  companyId: z.number().int().positive(),
});

export const updateJobSchema = createJobSchema.partial();

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
