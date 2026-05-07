import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BriefcaseBusiness, Save, Trash2, UsersRound } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteAdminCandidate,
  listAdminCandidates,
  listAdminJobs,
  updateAdminCandidate,
} from "../api/admin";
import { PageTransition } from "../components/layout/PageTransition";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import type { CandidateWithApplications, User } from "../types/api";

const candidateStatuses: NonNullable<User["candidateStatus"]>[] = [
  "processing",
  "approved",
  "prequalified",
  "rejected",
  "blocked",
];

const paymentStatuses: NonNullable<User["paymentStatus"]>[] = ["pending", "verified", "rejected"];

function CandidateAdminCard({ candidate }: { candidate: CandidateWithApplications }) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState({
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone ?? "",
    nationalIdOrPassport: candidate.nationalIdOrPassport ?? "",
    candidateStatus: candidate.candidateStatus ?? "processing",
    paymentStatus: candidate.paymentStatus ?? "pending",
    adminComment: candidate.adminComment ?? "",
  });

  const updateMutation = useMutation({
    mutationFn: updateAdminCandidate,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-candidates"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteAdminCandidate,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-candidates"] });
    },
  });

  return (
    <Card>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            />
            <Input
              value={draft.email}
              onChange={(event) => setDraft({ ...draft, email: event.target.value })}
            />
            <Input
              value={draft.phone}
              onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
              placeholder="Phone"
            />
            <Input
              value={draft.nationalIdOrPassport}
              onChange={(event) =>
                setDraft({ ...draft, nationalIdOrPassport: event.target.value })
              }
              placeholder="National ID or passport"
            />
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <select
              className="h-11 rounded-md border border-ink/15 bg-white px-3 text-sm outline-none focus:border-teal"
              value={draft.candidateStatus}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  candidateStatus: event.target.value as NonNullable<User["candidateStatus"]>,
                })
              }
            >
              {candidateStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              className="h-11 rounded-md border border-ink/15 bg-white px-3 text-sm outline-none focus:border-teal"
              value={draft.paymentStatus}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  paymentStatus: event.target.value as NonNullable<User["paymentStatus"]>,
                })
              }
            >
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  payment {status}
                </option>
              ))}
            </select>
          </div>
          <Textarea
            className="mt-3"
            value={draft.adminComment}
            onChange={(event) => setDraft({ ...draft, adminComment: event.target.value })}
            placeholder='Candidate message, e.g. "You have been prequalified for job offer and you need to submit required payment via office."'
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              onClick={() => updateMutation.mutate({ id: candidate.id, ...draft })}
              disabled={updateMutation.isPending}
            >
              <Save size={18} />
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={() => deleteMutation.mutate(candidate.id)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 size={18} />
              Delete
            </Button>
          </div>
        </div>
        <div className="rounded-lg bg-porcelain p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Applications</p>
          <div className="mt-3 grid gap-3">
            {candidate.applications.length ? (
              candidate.applications.map((application) => (
                <div key={application.id} className="rounded-md bg-white p-3 text-sm">
                  <p className="font-bold text-ink">{application.job?.title}</p>
                  <p className="mt-1 text-graphite">Status: {application.status}</p>
                  {application.adminComment && (
                    <p className="mt-2 text-ink">{application.adminComment}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-graphite">No applications yet.</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function AdminDashboardPage() {
  const candidatesQuery = useQuery({
    queryKey: ["admin-candidates"],
    queryFn: listAdminCandidates,
    retry: false,
  });
  const jobsQuery = useQuery({ queryKey: ["admin-jobs"], queryFn: listAdminJobs, retry: false });

  return (
    <PageTransition>
      <section className="bg-white py-20">
        <div className="section-shell">
          <p className="eyebrow">Admin Dashboard</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-ink md:text-5xl">
            Mutawai HR candidate oversight.
          </h1>
          {(candidatesQuery.isLoading || jobsQuery.isLoading) && (
            <Card className="mt-8">
              <p className="text-sm font-semibold text-graphite">Loading admin dashboard...</p>
            </Card>
          )}
          {candidatesQuery.isError && (
            <Card className="mt-8 border-coral/30 bg-coral/5">
              <p className="text-sm font-semibold text-coral">
                Admin access is required. Login with the admin account, then open the dashboard.
              </p>
              <Link to="/login" className="mt-3 inline-flex text-sm font-bold text-teal">
                Go to login
              </Link>
            </Card>
          )}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card>
              <UsersRound className="text-teal" size={30} />
              <h2 className="mt-4 font-display text-2xl font-extrabold">Candidates</h2>
              <p className="mt-2 text-4xl font-extrabold text-ink">
                {candidatesQuery.data?.length ?? 0}
              </p>
              {candidatesQuery.isError && (
                <p className="mt-3 text-sm font-semibold text-coral">
                  Login as the admin account to load candidate records.
                </p>
              )}
            </Card>
            <Card>
              <BriefcaseBusiness className="text-brass" size={30} />
              <h2 className="mt-4 font-display text-2xl font-extrabold">Available Jobs</h2>
              <p className="mt-2 text-4xl font-extrabold text-ink">
                {jobsQuery.data?.length ?? 0}
              </p>
            </Card>
          </div>

          <section className="mt-12">
            <h2 className="font-display text-3xl font-extrabold">Candidate Records</h2>
            <div className="mt-6 grid gap-5">
              {candidatesQuery.data?.map((candidate) => (
                <CandidateAdminCard key={candidate.id} candidate={candidate} />
              ))}
              {candidatesQuery.data?.length === 0 && (
                <Card>
                  <p className="text-sm text-graphite">No candidate records yet.</p>
                </Card>
              )}
            </div>
          </section>
        </div>
      </section>
    </PageTransition>
  );
}
