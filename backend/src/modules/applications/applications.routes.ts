import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import * as applicationsController from "./applications.controller.js";

export const applicationsRouter = Router();

applicationsRouter.post(
  "/",
  requireAuth,
  requireRole("candidate"),
  applicationsController.createApplication,
);
applicationsRouter.get(
  "/my",
  requireAuth,
  requireRole("candidate"),
  applicationsController.listMyApplications,
);
