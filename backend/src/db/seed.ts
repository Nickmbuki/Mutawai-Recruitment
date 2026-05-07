import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db, pool } from "./client.js";
import { companies, jobs, users } from "./schema.js";

const jobCatalog = [
  {
    title: "Bike Rider",
    description:
      "Responsible for timely dispatch, client deliveries, route discipline, basic delivery records, and professional customer-facing conduct.",
    location: "Nairobi and surrounding areas",
  },
  {
    title: "Cleaner",
    description:
      "Maintains office, residential, hospitality, or commercial spaces through scheduled cleaning, hygiene checks, and responsible handling of cleaning materials.",
    location: "Nairobi, Kenya",
  },
  {
    title: "Security Officer",
    description:
      "Provides access control, patrols, incident reporting, visitor screening, and protection of people, property, and assigned premises.",
    location: "Multiple client sites",
  },
  {
    title: "Waitress",
    description:
      "Supports restaurant and hospitality service through guest reception, order handling, table service, cleanliness, and customer care.",
    location: "Hospitality placements",
  },
  {
    title: "Cashier",
    description:
      "Handles customer payments, receipts, daily cash reconciliation, POS operations, and professional front-desk service.",
    location: "Retail and hospitality placements",
  },
  {
    title: "Driver",
    description:
      "Provides safe transport, vehicle care, trip records, route planning, and professional support for private, corporate, or logistics assignments.",
    location: "Nairobi and regional assignments",
  },
  {
    title: "Housemaid",
    description:
      "Supports household cleaning, laundry, basic meal preparation, home organization, and respectful day-to-day domestic assistance.",
    location: "Private household placements",
  },
  {
    title: "House-to-House Support Staff",
    description:
      "Provides scheduled home support services across client residences, including cleaning, errands, organization, and basic household assistance.",
    location: "Client residences",
  },
  {
    title: "Caregiver",
    description:
      "Assists elderly, recovering, or dependent clients with personal care, companionship, mobility support, medication reminders, and daily routines.",
    location: "Home care placements",
  },
  {
    title: "Nurse",
    description:
      "Provides professional patient care, monitoring, care documentation, medication support within scope, and coordination with families or facilities.",
    location: "Clinical and home care placements",
  },
  {
    title: "Kitchen Helper",
    description:
      "Supports food preparation, dishwashing, kitchen hygiene, stock movement, and chef assistance in busy hospitality or institutional kitchens.",
    location: "Hospitality and institutional kitchens",
  },
  {
    title: "Chef",
    description:
      "Prepares meals, manages kitchen sections, supports menu execution, maintains hygiene standards, and controls kitchen workflow.",
    location: "Hospitality placements",
  },
  {
    title: "Warehouse Packaging Assistant",
    description:
      "Handles sorting, packaging, labeling, inventory support, loading assistance, and compliance with warehouse safety procedures.",
    location: "Warehouse and logistics sites",
  },
];

async function seed() {
  const passwordHash = await bcrypt.hash("MutawaiSecure123!", 12);

  let admin = await db.query.users.findFirst({
    where: eq(users.email, "admin@mutawai.co.ke"),
  });

  if (!admin) {
    [admin] = await db
      .insert(users)
      .values({
        name: "Mutawai HR Admin",
        email: "admin@mutawai.co.ke",
        phone: "+254700000000",
        nationalIdOrPassport: "ADMIN-MUTAWAI",
        passwordHash,
        role: "admin",
        paymentStatus: "verified",
        candidateStatus: "approved",
      })
      .returning();
  }

  let company = await db.query.companies.findFirst({
    where: eq(companies.name, "Mutawai HR Consultants Limited"),
  });

  if (!company) {
    [company] = await db
      .insert(companies)
      .values({
        name: "Mutawai HR Consultants Limited",
        description:
          "A single-employer recruitment and HR placement platform for vetted service, hospitality, domestic, healthcare, and logistics roles.",
        logoUrl: "https://mutawai.example/logo.png",
        ownerId: admin.id,
      })
      .returning();
  }

  await db.delete(jobs).where(eq(jobs.companyId, company.id));
  await db.insert(jobs).values(
    jobCatalog.map((job) => ({
      ...job,
      salaryRange: "Not disclosed",
      companyId: company.id,
    })),
  );

  console.log("Seeded Mutawai HR Consultants Limited admin account and job catalog.");
  console.log("Admin login: admin@mutawai.co.ke / MutawaiSecure123!");
}

seed()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    void pool.end();
  });
