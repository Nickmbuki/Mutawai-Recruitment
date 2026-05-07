import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import * as adminController from "./admin.controller.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("admin"));
adminRouter.get("/users", adminController.listUsers);
adminRouter.get("/candidates", adminController.listCandidates);
adminRouter.post("/candidates", adminController.createCandidate);
adminRouter.put("/candidates/:id", adminController.updateCandidate);
adminRouter.delete("/candidates/:id", adminController.deleteCandidate);
adminRouter.get("/jobs", adminController.listJobs);
adminRouter.put("/applications/:id", adminController.updateApplication);
