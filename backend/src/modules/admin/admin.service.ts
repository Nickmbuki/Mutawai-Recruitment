import bcrypt from "bcrypt";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db/client.js";
import { applications, jobs, users } from "../../db/schema.js";
import { AppError } from "../../utils/app-error.js";
import { serializeUser } from "../auth/auth.service.js";
import type {
  CreateCandidateInput,
  UpdateApplicationAdminInput,
  UpdateCandidateInput,
} from "./admin.validators.js";

export async function listUsers() {
  const result = await db.query.users.findMany({
    orderBy: [desc(users.createdAt)],
  });
  return result.map(serializeUser);
}

export async function listCandidates() {
  const result = await db.query.users.findMany({
    where: eq(users.role, "candidate"),
    orderBy: [desc(users.createdAt)],
    with: {
      applications: {
        with: {
          job: {
            with: {
              company: true,
            },
          },
        },
      },
    },
  });

  return result.map((candidate) => ({
    ...serializeUser(candidate),
    applications: candidate.applications,
  }));
}

export async function createCandidate(input: CreateCandidateInput) {
  const existing = await db.query.users.findFirst({
    where: eq(users.email, input.email.toLowerCase()),
  });

  if (existing) {
    throw new AppError("Email is already registered", 409);
  }

  const passwordHash = await bcrypt.hash(input.password ?? "Candidate123!", 12);
  const [candidate] = await db
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
      paymentStatus: input.paymentStatus,
      candidateStatus: input.candidateStatus,
      adminComment: input.adminComment,
    })
    .returning();

  return serializeUser(candidate);
}

export async function updateCandidate(id: number, input: UpdateCandidateInput) {
  const existing = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!existing || existing.role !== "candidate") {
    throw new AppError("Candidate not found", 404);
  }

  const [candidate] = await db
    .update(users)
    .set({
      ...input,
      email: input.email?.toLowerCase(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  return serializeUser(candidate);
}

export async function deleteCandidate(id: number) {
  const existing = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!existing || existing.role !== "candidate") {
    throw new AppError("Candidate not found", 404);
  }

  await db.delete(users).where(eq(users.id, id));
}

export async function listJobs() {
  return db.query.jobs.findMany({
    orderBy: [desc(jobs.createdAt)],
    with: {
      company: true,
      applications: true,
    },
  });
}

export async function updateApplication(id: number, input: UpdateApplicationAdminInput) {
  const existing = await db.query.applications.findFirst({
    where: eq(applications.id, id),
  });

  if (!existing) {
    throw new AppError("Application not found", 404);
  }

  const [application] = await db
    .update(applications)
    .set(input)
    .where(eq(applications.id, id))
    .returning();

  return application;
}
