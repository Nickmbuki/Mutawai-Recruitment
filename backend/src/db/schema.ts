import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "employer", "candidate"]);
export const candidateStatusEnum = pgEnum("candidate_status", [
  "processing",
  "approved",
  "prequalified",
  "rejected",
  "blocked",
]);
export const paymentMethodEnum = pgEnum("payment_method", ["mpesa", "paypal"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "verified", "rejected"]);
export const applicationStatusEnum = pgEnum("application_status", [
  "submitted",
  "reviewing",
  "shortlisted",
  "processing",
  "approved",
  "prequalified",
  "rejected",
  "hired",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 40 }),
  nationalIdOrPassport: varchar("national_id_or_passport", { length: 120 }),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("candidate"),
  candidateStatus: candidateStatusEnum("candidate_status").notNull().default("processing"),
  paymentMethod: paymentMethodEnum("payment_method"),
  paymentReference: varchar("payment_reference", { length: 180 }),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("pending"),
  adminComment: text("admin_comment"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  description: text("description").notNull(),
  logoUrl: text("logo_url"),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull(),
  salaryRange: varchar("salary_range", { length: 120 }).notNull(),
  location: varchar("location", { length: 160 }).notNull(),
  companyId: integer("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  candidateId: integer("candidate_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  resumeUrl: text("resume_url").notNull(),
  documentUrls: text("document_urls"),
  coverLetter: text("cover_letter").notNull(),
  status: applicationStatusEnum("status").notNull().default("submitted"),
  adminComment: text("admin_comment"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  companies: many(companies),
  applications: many(applications),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  owner: one(users, {
    fields: [companies.ownerId],
    references: [users.id],
  }),
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  company: one(companies, {
    fields: [jobs.companyId],
    references: [companies.id],
  }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  candidate: one(users, {
    fields: [applications.candidateId],
    references: [users.id],
  }),
}));

export type UserRole = (typeof userRoleEnum.enumValues)[number];
export type ApplicationStatus = (typeof applicationStatusEnum.enumValues)[number];
export type CandidateStatus = (typeof candidateStatusEnum.enumValues)[number];
export type PaymentMethod = (typeof paymentMethodEnum.enumValues)[number];
export type PaymentStatus = (typeof paymentStatusEnum.enumValues)[number];
