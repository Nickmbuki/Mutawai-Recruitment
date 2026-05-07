import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import * as adminService from "./admin.service.js";
import {
  applicationParamsSchema,
  candidateParamsSchema,
  createCandidateSchema,
  updateApplicationAdminSchema,
  updateCandidateSchema,
} from "./admin.validators.js";

export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await adminService.listUsers();
  res.json({ users });
});

export const listJobs = asyncHandler(async (_req: Request, res: Response) => {
  const jobs = await adminService.listJobs();
  res.json({ jobs });
});

export const listCandidates = asyncHandler(async (_req: Request, res: Response) => {
  const candidates = await adminService.listCandidates();
  res.json({ candidates });
});

export const createCandidate = asyncHandler(async (req: Request, res: Response) => {
  const input = createCandidateSchema.parse(req.body);
  const candidate = await adminService.createCandidate(input);
  res.status(201).json({ candidate });
});

export const updateCandidate = asyncHandler(async (req: Request, res: Response) => {
  const { id } = candidateParamsSchema.parse(req.params);
  const input = updateCandidateSchema.parse(req.body);
  const candidate = await adminService.updateCandidate(id, input);
  res.json({ candidate });
});

export const deleteCandidate = asyncHandler(async (req: Request, res: Response) => {
  const { id } = candidateParamsSchema.parse(req.params);
  await adminService.deleteCandidate(id);
  res.status(204).send();
});

export const updateApplication = asyncHandler(async (req: Request, res: Response) => {
  const { id } = applicationParamsSchema.parse(req.params);
  const input = updateApplicationAdminSchema.parse(req.body);
  const application = await adminService.updateApplication(id, input);
  res.json({ application });
});
