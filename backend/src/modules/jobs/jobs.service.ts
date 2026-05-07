import { and, desc, eq } from "drizzle-orm";
import { db } from "../../db/client.js";
import { companies, jobs } from "../../db/schema.js";
import { AppError } from "../../utils/app-error.js";
import type { CreateJobInput, UpdateJobInput } from "./jobs.validators.js";

export async function listJobs() {
  return db.query.jobs.findMany({
    orderBy: [desc(jobs.createdAt)],
    with: {
      company: true,
    },
  });
}

export async function getJob(id: number) {
  const job = await db.query.jobs.findFirst({
    where: eq(jobs.id, id),
    with: {
      company: true,
    },
  });

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  return job;
}

export async function createJob(input: CreateJobInput, ownerId: number, isAdmin: boolean) {
  const companyId = input.companyId;
  const company = await db.query.companies.findFirst({
    where: isAdmin
      ? companyId
        ? eq(companies.id, companyId)
        : eq(companies.name, "Mutawai HR Consultants Limited")
      : and(eq(companies.id, companyId ?? 0), eq(companies.ownerId, ownerId)),
  });

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  const [job] = await db
    .insert(jobs)
    .values({
      ...input,
      companyId: company.id,
    })
    .returning();
  return job;
}

export async function updateJob(id: number, input: UpdateJobInput, ownerId: number, isAdmin: boolean) {
  const existing = await db.query.jobs.findFirst({
    where: eq(jobs.id, id),
    with: {
      company: true,
    },
  });

  if (!existing) {
    throw new AppError("Job not found", 404);
  }

  if (!isAdmin && existing.company.ownerId !== ownerId) {
    throw new AppError("You can only edit jobs for your company", 403);
  }

  const [job] = await db.update(jobs).set(input).where(eq(jobs.id, id)).returning();
  return job;
}

export async function deleteJob(id: number, ownerId: number, isAdmin: boolean) {
  const existing = await db.query.jobs.findFirst({
    where: eq(jobs.id, id),
    with: {
      company: true,
    },
  });

  if (!existing) {
    throw new AppError("Job not found", 404);
  }

  if (!isAdmin && existing.company.ownerId !== ownerId) {
    throw new AppError("You can only delete jobs for your company", 403);
  }

  await db.delete(jobs).where(eq(jobs.id, id));
}
