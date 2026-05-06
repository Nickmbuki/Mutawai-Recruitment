import type { UserRole } from "../db/schema.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: UserRole;
        email: string;
      };
    }
  }
}

export {};
