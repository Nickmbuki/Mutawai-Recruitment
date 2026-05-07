import { desc, eq } from "drizzle-orm";
import { db } from "../../db/client.js";
import { applications, jobs } from "../../db/schema.js";
import { AppError } from "../../utils/app-error.js";
import type { CreateApplicationInput, UpdateApplicationInput } from "./applications.validators.js";

export async function createApplication(input: CreateApplicationInput, candidateId: number) {
  const job = await db.query.jobs.findFirst({
    where: eq(jobs.id, input.jobId),
  });

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  const [application] = await db
    .insert(applications)
    .values({
      jobId: input.jobId,
      candidateId,
      resumeUrl: input.resumeUrl,
      documentUrls: JSON.stringify(input.documentUrls),
      coverLetter: input.coverLetter,
    })
    .returning();

  return application;
}

export async function listMyApplications(candidateId: number) {
  return db.query.applications.findMany({
    where: eq(applications.candidateId, candidateId),
    orderBy: [desc(applications.createdAt)],
    with: {
      job: {
        with: {
          company: true,
        },
      },
    },
  });
}

export async function updateApplication(id: number, input: UpdateApplicationInput) {
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
