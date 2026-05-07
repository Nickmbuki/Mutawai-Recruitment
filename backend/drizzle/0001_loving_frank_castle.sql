CREATE TYPE "public"."candidate_status" AS ENUM('processing', 'approved', 'prequalified', 'rejected', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('mpesa', 'paypal');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'verified', 'rejected');--> statement-breakpoint
ALTER TYPE "public"."application_status" ADD VALUE 'processing' BEFORE 'rejected';--> statement-breakpoint
ALTER TYPE "public"."application_status" ADD VALUE 'approved' BEFORE 'rejected';--> statement-breakpoint
ALTER TYPE "public"."application_status" ADD VALUE 'prequalified' BEFORE 'rejected';--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "admin_comment" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" varchar(40);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "national_id_or_passport" varchar(120);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "candidate_status" "candidate_status" DEFAULT 'processing' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "payment_method" "payment_method";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "payment_reference" varchar(180);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "payment_status" "payment_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "admin_comment" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;