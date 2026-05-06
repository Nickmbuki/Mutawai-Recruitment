import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import * as authService from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.validators.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = registerSchema.parse(req.body);
  const result = await authService.register(input);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);
  const result = await authService.login(input);
  res.json(result);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.me(req.user!.id);
  res.json({ user });
});
