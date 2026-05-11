import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import * as cvService from "./cv-service.service.js";
import { cvGenerateSchema, mpesaInitiateSchema, paypalCaptureSchema } from "./cv-service.validators.js";

export const status = asyncHandler(async (req: Request, res: Response) => {
  const result = await cvService.getStatus(req.user!.id);
  res.json(result);
});

export const initiateMpesa = asyncHandler(async (req: Request, res: Response) => {
  const input = mpesaInitiateSchema.parse(req.body);
  const result = await cvService.initiateMpesa(input, req.user!.id);
  res.status(201).json(result);
});

export const mpesaCallback = asyncHandler(async (req: Request, res: Response) => {
  await cvService.handleMpesaCallback(req.body);
  res.json({ ResultCode: 0, ResultDesc: "Accepted" });
});

export const createPaypalOrder = asyncHandler(async (req: Request, res: Response) => {
  const result = await cvService.createPaypalOrder(req.user!.id);
  res.status(201).json(result);
});

export const capturePaypalOrder = asyncHandler(async (req: Request, res: Response) => {
  const input = paypalCaptureSchema.parse(req.body);
  const payment = await cvService.capturePaypalOrder(input, req.user!.id);
  res.json({ payment });
});

export const generateCv = asyncHandler(async (req: Request, res: Response) => {
  const input = cvGenerateSchema.parse(req.body);
  const result = await cvService.generateCv(input, req.user!.id, req.file);
  res.status(201).json(result);
});
