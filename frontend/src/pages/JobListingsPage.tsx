import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { listJobs } from "../api/jobs";
import { JobCard } from "../components/jobs/JobCard";
import { PageTransition } from "../components/layout/PageTransition";
import { Reveal } from "../components/sections/Reveal";
import { Input } from "../components/ui/input";
import type { Job } from "../types/api";

const fallbackJobs: Job[] = [
  {
    id: 1,
    title: "Senior Finance Manager",
    description:
      "Lead finance operations, reporting, and stakeholder advisory for a regional enterprise client.",
    salaryRange: "KES 450,000 - 650,000",
    location: "Nairobi, Kenya",
    companyId: 1,
    createdAt: new Date().toISOString(),
    company: { id: 1, name: "Mutawai Partner", description: "", ownerId: 1 },
  },
  {
    id: 2,
    title: "People Operations Lead",
    description:
      "Build people systems, hiring processes, and employee engagement programs for a scaling organization.",
    salaryRange: "KES 300,000 - 420,000",
    location: "Hybrid",
    companyId: 1,
    createdAt: new Date().toISOString(),
    company: { id: 1, name: "Mutawai Partner", description: "", ownerId: 1 },
  },
];

export function JobListingsPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["jobs"], queryFn: listJobs });
  const jobs = data?.length ? data : fallbackJobs;

  return (
    <PageTransition>
      <section className="bg-white py-20">
        <div className="section-shell">
          <Reveal>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">Job Listings</p>
                <h1 className="mt-3 font-display text-5xl font-extrabold text-ink">
                  Current opportunities.
                </h1>
              </div>
              <label className="relative block w-full md:max-w-sm">
                <Search className="absolute left-3 top-3 text-graphite" size={18} />
                <Input className="pl-10" placeholder="Search role or location" />
              </label>
            </div>
          </Reveal>

          {isError && (
            <p className="mt-6 rounded-md bg-coral/10 p-4 text-sm font-semibold text-coral">
              Live API unavailable. Showing seeded sample roles.
            </p>
          )}

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-72 animate-pulse rounded-lg bg-mist" />
                ))
              : jobs.map((job) => (
                  <Reveal key={job.id}>
                    <JobCard job={job} />
                  </Reveal>
                ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
