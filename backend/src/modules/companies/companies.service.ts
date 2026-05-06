import { eq } from "drizzle-orm";
import { db } from "../../db/client.js";
import { companies } from "../../db/schema.js";
import type { CreateCompanyInput } from "./companies.validators.js";

export async function listCompanies() {
  return db.query.companies.findMany({
    with: {
      jobs: true,
    },
  });
}

export async function listMyCompanies(ownerId: number) {
  return db.query.companies.findMany({
    where: eq(companies.ownerId, ownerId),
    with: {
      jobs: true,
    },
  });
}

export async function createCompany(input: CreateCompanyInput, ownerId: number) {
  const [company] = await db
    .insert(companies)
    .values({
      ...input,
      ownerId,
    })
    .returning();

  return company;
}
