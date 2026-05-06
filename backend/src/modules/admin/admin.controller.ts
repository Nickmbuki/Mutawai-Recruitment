import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import * as adminService from "./admin.service.js";

export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await adminService.listUsers();
  res.json({ users });
});

export const listJobs = asyncHandler(async (_req: Request, res: Response) => {
  const jobs = await adminService.listJobs();
  res.json({ jobs });
});
