import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { db } from "../../db/client.js";
import { users } from "../../db/schema.js";
import { AppError } from "../../utils/app-error.js";
import type { LoginInput, RegisterInput } from "./auth.validators.js";

export function serializeUser(user: typeof users.$inferSelect) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    nationalIdOrPassport: user.nationalIdOrPassport,
    role: user.role,
    candidateStatus: user.candidateStatus,
    paymentMethod: user.paymentMethod,
    paymentReference: user.paymentReference,
    paymentStatus: user.paymentStatus,
    adminComment: user.adminComment,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function signAccessToken(user: typeof users.$inferSelect) {
  return jwt.sign(
    {
      role: user.role,
      email: user.email,
    },
    env.JWT_SECRET,
    {
      subject: String(user.id),
      expiresIn: "1h",
    },
  );
}

export async function register(input: RegisterInput) {
  const existing = await db.query.users.findFirst({
    where: eq(users.email, input.email.toLowerCase()),
  });

  if (existing) {
    throw new AppError("Email is already registered", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const [user] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone,
      nationalIdOrPassport: input.nationalIdOrPassport,
      passwordHash,
      role: "candidate",
      paymentMethod: input.paymentMethod,
      paymentReference: input.paymentReference,
      paymentStatus: "pending",
      candidateStatus: "processing",
    })
    .returning();

  return {
    user: serializeUser(user),
    accessToken: signAccessToken(user),
  };
}

export async function login(input: LoginInput) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, input.email.toLowerCase()),
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

  return {
    user: serializeUser(user),
    accessToken: signAccessToken(user),
  };
}

export async function me(userId: number) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return serializeUser(user);
}
