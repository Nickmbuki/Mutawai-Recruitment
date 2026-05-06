import bcrypt from "bcrypt";
import { db, pool } from "./client.js";
import { applications, companies, jobs, users } from "./schema.js";

async function seed() {
  const passwordHash = await bcrypt.hash("MutawaiSecure123!", 12);

  await db.delete(applications);
  await db.delete(jobs);
  await db.delete(companies);
  await db.delete(users);

  const [admin, employer, candidate] = await db
    .insert(users)
    .values([
      {
        name: "Mutawai Admin",
        email: "admin@mutawai.co.ke",
        passwordHash,
        role: "admin",
      },
      {
        name: "Grace Wanjiku",
        email: "employer@mutawai.co.ke",
        passwordHash,
        role: "employer",
      },
      {
        name: "Daniel Otieno",
        email: "candidate@mutawai.co.ke",
        passwordHash,
        role: "candidate",
      },
    ])
    .returning();

  const [company] = await db
    .insert(companies)
    .values({
      name: "Mutawai Consultants Limited",
      description:
        "A premium recruitment and executive search partner connecting ambitious companies with high-performing talent.",
      logoUrl: "https://mutawai.example/logo.png",
      ownerId: employer.id,
    })
    .returning();

  const createdJobs = await db
    .insert(jobs)
    .values([
      {
        title: "Senior Finance Manager",
        description:
          "Lead finance operations, reporting, and stakeholder advisory for a regional enterprise client.",
        salaryRange: "KES 450,000 - 650,000",
        location: "Nairobi, Kenya",
        companyId: company.id,
      },
      {
        title: "People Operations Lead",
        description:
          "Build people systems, hiring processes, and employee engagement programs for a scaling organization.",
        salaryRange: "KES 300,000 - 420,000",
        location: "Hybrid",
        companyId: company.id,
      },
      {
        title: "Enterprise Account Executive",
        description:
          "Own strategic client relationships and growth opportunities across East African markets.",
        salaryRange: "KES 250,000 - 380,000 + commission",
        location: "Nairobi, Kenya",
        companyId: company.id,
      },
    ])
    .returning();

  await db.insert(applications).values({
    jobId: createdJobs[0].id,
    candidateId: candidate.id,
    resumeUrl: "https://mutawai.example/resumes/daniel-otieno.pdf",
    coverLetter: "I bring deep finance leadership experience across complex regional teams.",
    status: "reviewing",
  });

  console.log(`Seeded users including ${admin.email}. Default password: MutawaiSecure123!`);
}

seed()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    void pool.end();
  });
