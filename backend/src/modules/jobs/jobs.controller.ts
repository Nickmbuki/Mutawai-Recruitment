import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import * as jobsService from "./jobs.service.js";
import { createJobSchema, jobParamsSchema, updateJobSchema } from "./jobs.validators.js";

export const listJobs = asyncHandler(async (_req: Request, res: Response) => {
  const jobs = await jobsService.listJobs();
  res.json({ jobs });
});

export const getJob = asyncHandler(async (req: Request, res: Response) => {
  const { id } = jobParamsSchema.parse(req.params);
  const job = await jobsService.getJob(id);
  res.json({ job });
});

export const createJob = asyncHandler(async (req: Request, res: Response) => {
  const input = createJobSchema.parse(req.body);
  const job = await jobsService.createJob(input, req.user!.id, req.user!.role === "admin");
  res.status(201).json({ job });
});

export const updateJob = asyncHandler(async (req: Request, res: Response) => {
  const { id } = jobParamsSchema.parse(req.params);
  const input = updateJobSchema.parse(req.body);
  const job = await jobsService.updateJob(id, input, req.user!.id, req.user!.role === "admin");
  res.json({ job });
});

export const deleteJob = asyncHandler(async (req: Request, res: Response) => {
  const { id } = jobParamsSchema.parse(req.params);
  await jobsService.deleteJob(id, req.user!.id, req.user!.role === "admin");
  res.status(204).send();
});
