import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import * as jobsController from "./jobs.controller.js";

export const jobsRouter = Router();

jobsRouter.get("/", jobsController.listJobs);
jobsRouter.post("/", requireAuth, requireRole("admin"), jobsController.createJob);
jobsRouter.get("/:id", jobsController.getJob);
jobsRouter.put("/:id", requireAuth, requireRole("admin"), jobsController.updateJob);
jobsRouter.delete("/:id", requireAuth, requireRole("admin"), jobsController.deleteJob);
