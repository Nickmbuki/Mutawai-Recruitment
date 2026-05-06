CREATE TYPE "user_role" AS ENUM ('admin', 'employer', 'candidate');
CREATE TYPE "application_status" AS ENUM ('submitted', 'reviewing', 'shortlisted', 'rejected', 'hired');

CREATE TABLE "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(160) NOT NULL,
  "email" varchar(255) NOT NULL UNIQUE,
  "password_hash" text NOT NULL,
  "role" "user_role" DEFAULT 'candidate' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "companies" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(180) NOT NULL,
  "description" text NOT NULL,
  "logo_url" text,
  "owner_id" integer NOT NULL REFERENCES "users"("id") ON DELETE cascade
);

CREATE TABLE "jobs" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" varchar(180) NOT NULL,
  "description" text NOT NULL,
  "salary_range" varchar(120) NOT NULL,
  "location" varchar(160) NOT NULL,
  "company_id" integer NOT NULL REFERENCES "companies"("id") ON DELETE cascade,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "applications" (
  "id" serial PRIMARY KEY NOT NULL,
  "job_id" integer NOT NULL REFERENCES "jobs"("id") ON DELETE cascade,
  "candidate_id" integer NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "resume_url" text NOT NULL,
  "cover_letter" text NOT NULL,
  "status" "application_status" DEFAULT 'submitted' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
