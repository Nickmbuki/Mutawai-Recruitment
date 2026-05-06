import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import * as applicationsService from "./applications.service.js";
import { createApplicationSchema } from "./applications.validators.js";

export const createApplication = asyncHandler(async (req: Request, res: Response) => {
  const input = createApplicationSchema.parse(req.body);
  const application = await applicationsService.createApplication(input, req.user!.id);
  res.status(201).json({ application });
});

export const listMyApplications = asyncHandler(async (req: Request, res: Response) => {
  const applications = await applicationsService.listMyApplications(req.user!.id);
  res.json({ applications });
});
