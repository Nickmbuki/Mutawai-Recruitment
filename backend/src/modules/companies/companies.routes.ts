import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import * as companiesController from "./companies.controller.js";

export const companiesRouter = Router();

companiesRouter.get("/", companiesController.listCompanies);
companiesRouter.get("/my", requireAuth, requireRole("employer"), companiesController.listMyCompanies);
companiesRouter.post("/", requireAuth, requireRole("employer"), companiesController.createCompany);
