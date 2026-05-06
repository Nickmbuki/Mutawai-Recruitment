import { desc } from "drizzle-orm";
import { db } from "../../db/client.js";
import { jobs, users } from "../../db/schema.js";
import { serializeUser } from "../auth/auth.service.js";

export async function listUsers() {
  const result = await db.query.users.findMany({
    orderBy: [desc(users.createdAt)],
  });
  return result.map(serializeUser);
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
