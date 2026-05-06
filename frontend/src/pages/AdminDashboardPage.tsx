import { useQuery } from "@tanstack/react-query";
import { BriefcaseBusiness, UsersRound } from "lucide-react";
import { listAdminJobs, listAdminUsers } from "../api/admin";
import { PageTransition } from "../components/layout/PageTransition";
import { Card } from "../components/ui/card";

export function AdminDashboardPage() {
  const usersQuery = useQuery({ queryKey: ["admin-users"], queryFn: listAdminUsers });
  const jobsQuery = useQuery({ queryKey: ["admin-jobs"], queryFn: listAdminJobs });

  return (
    <PageTransition>
      <section className="bg-white py-20">
        <div className="section-shell">
          <p className="eyebrow">Admin Dashboard</p>
          <h1 className="mt-3 font-display text-5xl font-extrabold text-ink">
            Platform oversight.
          </h1>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card>
              <UsersRound className="text-teal" size={30} />
              <h2 className="mt-4 font-display text-2xl font-extrabold">Users</h2>
              <p className="mt-2 text-4xl font-extrabold text-ink">
                {usersQuery.data?.length ?? 0}
              </p>
              {usersQuery.isError && (
                <p className="mt-3 text-sm font-semibold text-coral">
                  Login as admin to load live users.
                </p>
              )}
            </Card>
            <Card>
              <BriefcaseBusiness className="text-brass" size={30} />
              <h2 className="mt-4 font-display text-2xl font-extrabold">Jobs</h2>
              <p className="mt-2 text-4xl font-extrabold text-ink">
                {jobsQuery.data?.length ?? 0}
              </p>
              {jobsQuery.isError && (
                <p className="mt-3 text-sm font-semibold text-coral">
                  Login as admin to load live jobs.
                </p>
              )}
            </Card>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
