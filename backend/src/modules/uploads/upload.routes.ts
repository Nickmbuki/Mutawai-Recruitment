import { Router } from "express";
import multer from "multer";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { uploadDocument } from "./upload.service.js";

export const uploadRouter = Router();

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new Error("Only PDF, DOC, DOCX, JPG, PNG, and WEBP files are allowed"));
      return;
    }

    callback(null, true);
  },
});

uploadRouter.post(
  "/documents",
  requireAuth,
  requireRole("candidate", "admin"),
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400).json({ message: "File is required" });
      return;
    }

    const uploaded = await uploadDocument(req.file);
    res.status(201).json({ file: uploaded });
  }),
);
