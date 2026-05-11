CREATE TABLE "cv_generations" (
	"id" serial PRIMARY KEY NOT NULL,
	"payment_id" integer NOT NULL,
	"candidate_id" integer NOT NULL,
	"format_id" varchar(40) NOT NULL,
	"generic_cv_name" varchar(255) NOT NULL,
	"generated_cv" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cv_service_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"candidate_id" integer NOT NULL,
	"method" "payment_method" NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"provider_reference" varchar(220),
	"checkout_request_id" varchar(220),
	"amount" varchar(40) NOT NULL,
	"currency" varchar(12) NOT NULL,
	"generation_limit" integer DEFAULT 3 NOT NULL,
	"generation_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cv_generations" ADD CONSTRAINT "cv_generations_payment_id_cv_service_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."cv_service_payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_generations" ADD CONSTRAINT "cv_generations_candidate_id_users_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_service_payments" ADD CONSTRAINT "cv_service_payments_candidate_id_users_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;