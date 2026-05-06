import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import * as adminController from "./admin.controller.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("admin"));
adminRouter.get("/users", adminController.listUsers);
adminRouter.get("/jobs", adminController.listJobs);
