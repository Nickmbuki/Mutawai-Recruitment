import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { UserRole } from "../db/schema.js";
import { AppError } from "../utils/app-error.js";

type AccessTokenPayload = {
  sub: number;
  role: UserRole;
  email: string;
};

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    next(new AppError("Authentication required", 401));
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as unknown as AccessTokenPayload;
    req.user = {
      id: Number(payload.sub),
      role: payload.role,
      email: payload.email,
    };
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError("Authentication required", 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError("Insufficient permissions", 403));
      return;
    }

    next();
  };
}
