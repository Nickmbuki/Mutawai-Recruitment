import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import * as companiesService from "./companies.service.js";
import { createCompanySchema } from "./companies.validators.js";

export const listCompanies = asyncHandler(async (_req: Request, res: Response) => {
  const companies = await companiesService.listCompanies();
  res.json({ companies });
});

export const listMyCompanies = asyncHandler(async (req: Request, res: Response) => {
  const companies = await companiesService.listMyCompanies(req.user!.id);
  res.json({ companies });
});

export const createCompany = asyncHandler(async (req: Request, res: Response) => {
  const input = createCompanySchema.parse(req.body);
  const company = await companiesService.createCompany(input, req.user!.id);
  res.status(201).json({ company });
});
