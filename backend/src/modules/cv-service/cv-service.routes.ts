import { Router } from "express";
import multer from "multer";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import * as cvServiceController from "./cv-service.controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

export const cvServiceRouter = Router();

cvServiceRouter.post("/mpesa/callback", cvServiceController.mpesaCallback);

cvServiceRouter.use(requireAuth, requireRole("candidate"));
cvServiceRouter.get("/status", cvServiceController.status);
cvServiceRouter.post("/mpesa/initiate", cvServiceController.initiateMpesa);
cvServiceRouter.post("/paypal/create-order", cvServiceController.createPaypalOrder);
cvServiceRouter.post("/paypal/capture", cvServiceController.capturePaypalOrder);
cvServiceRouter.post("/generate", upload.single("file"), cvServiceController.generateCv);
