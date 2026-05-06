import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(2).max(180),
  description: z.string().min(20),
  logoUrl: z.string().url().optional(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
