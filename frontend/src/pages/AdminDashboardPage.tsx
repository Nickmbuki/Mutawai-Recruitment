import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BriefcaseBusiness, Plus, Save, Search, Trash2, UserPlus, UsersRound } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  createAdminCandidate,
  deleteAdminCandidate,
  listAdminCandidates,
  listAdminJobs,
  updateAdminCandidate,
} from "../api/admin";
import { createAdminJob, deleteAdminJob } from "../api/jobs";
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

function CreateCandidatePanel() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    phone: "",
    nationalIdOrPassport: "",
    password: "",
    paymentMethod: "mpesa" as "mpesa" | "paypal",
    paymentReference: "",
    paymentStatus: "pending" as NonNullable<User["paymentStatus"]>,
    candidateStatus: "processing" as NonNullable<User["candidateStatus"]>,
    adminComment: "",
  });
  const mutation = useMutation({
    mutationFn: createAdminCandidate,
    onSuccess: () => {
      setDraft({
        name: "",
        email: "",
        phone: "",
        nationalIdOrPassport: "",
        password: "",
        paymentMethod: "mpesa",
        paymentReference: "",
        paymentStatus: "pending",
        candidateStatus: "processing",
        adminComment: "",
      });
      void queryClient.invalidateQueries({ queryKey: ["admin-candidates"] });
    },
  });

  return (
    <Card className="mt-12">
      <div className="flex items-center gap-3">
        <UserPlus className="text-teal" />
        <h2 className="font-display text-2xl font-extrabold">Register candidate directly</h2>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <Input
          value={draft.name}
          onChange={(event) => setDraft({ ...draft, name: event.target.value })}
          placeholder="Full name"
        />
        <Input
          value={draft.email}
          onChange={(event) => setDraft({ ...draft, email: event.target.value })}
          placeholder="Email"
        />
        <Input
          value={draft.phone}
          onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
          placeholder="Phone"
        />
        <Input
          value={draft.nationalIdOrPassport}
          onChange={(event) => setDraft({ ...draft, nationalIdOrPassport: event.target.value })}
          placeholder="ID or passport number"
        />
        <Input
          value={draft.password}
          type="password"
          onChange={(event) => setDraft({ ...draft, password: event.target.value })}
          placeholder="Password, default Candidate123!"
        />
        <Input
          value={draft.paymentReference}
          onChange={(event) => setDraft({ ...draft, paymentReference: event.target.value })}
          placeholder="Payment reference"
        />
        <select
          className="h-11 rounded-md border border-ink/15 bg-white px-3 text-sm outline-none focus:border-teal"
          value={draft.paymentMethod}
          onChange={(event) =>
            setDraft({ ...draft, paymentMethod: event.target.value as "mpesa" | "paypal" })
          }
        >
          <option value="mpesa">M-Pesa</option>
          <option value="paypal">PayPal</option>
        </select>
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
      </div>
      <Textarea
        className="mt-3"
        value={draft.adminComment}
        onChange={(event) => setDraft({ ...draft, adminComment: event.target.value })}
        placeholder="Admin comment or candidate message"
      />
      <Button
        type="button"
        className="mt-4"
        disabled={
          mutation.isPending ||
          draft.name.trim().length < 2 ||
          draft.email.trim().length < 5 ||
          draft.phone.trim().length < 7 ||
          draft.nationalIdOrPassport.trim().length < 4
        }
        onClick={() =>
          mutation.mutate({
            ...draft,
            name: draft.name.trim(),
            email: draft.email.trim(),
            phone: draft.phone.trim(),
            nationalIdOrPassport: draft.nationalIdOrPassport.trim(),
            password: draft.password.trim() || undefined,
            paymentReference: draft.paymentReference.trim() || undefined,
            adminComment: draft.adminComment.trim() || undefined,
          })
        }
      >
        <UserPlus size={18} />
        {mutation.isPending ? "Registering..." : "Register Candidate"}
      </Button>
      {mutation.isSuccess && (
        <p className="mt-3 text-sm font-semibold text-teal">Candidate registered successfully.</p>
      )}
      {mutation.isError && (
        <p className="mt-3 text-sm font-semibold text-coral">
          Candidate registration failed. Check duplicate email or required fields.
        </p>
      )}
    </Card>
  );
}

function JobAdminPanel() {
  const queryClient = useQueryClient();
  const jobsQuery = useQuery({ queryKey: ["admin-jobs"], queryFn: listAdminJobs, retry: false });
  const [draft, setDraft] = useState({
    title: "",
    location: "",
    description: "",
  });
  const createMutation = useMutation({
    mutationFn: createAdminJob,
    onSuccess: () => {
      setDraft({ title: "", location: "", description: "" });
      void queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteAdminJob,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  return (
    <section className="mt-12">
      <h2 className="font-display text-3xl font-extrabold">Job Listings</h2>
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <h3 className="font-display text-2xl font-extrabold">Add job</h3>
          <div className="mt-5 grid gap-4">
            <Input
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              placeholder="Job title"
            />
            <Input
              value={draft.location}
              onChange={(event) => setDraft({ ...draft, location: event.target.value })}
              placeholder="Location"
            />
            <Textarea
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              placeholder="Professional job description"
            />
            <Button
              type="button"
              disabled={
                createMutation.isPending ||
                draft.title.trim().length < 3 ||
                draft.location.trim().length < 2 ||
                draft.description.trim().length < 20
              }
              onClick={() =>
                createMutation.mutate({
                  title: draft.title.trim(),
                  location: draft.location.trim(),
                  description: draft.description.trim(),
                  salaryRange: "Not disclosed",
                })
              }
            >
              <Plus size={18} />
              {createMutation.isPending ? "Adding..." : "Add Job"}
            </Button>
            {createMutation.isSuccess && (
              <p className="text-sm font-semibold text-teal">Job added successfully.</p>
            )}
            {createMutation.isError && (
              <p className="text-sm font-semibold text-coral">
                Unable to add job. Confirm admin login.
              </p>
            )}
          </div>
        </Card>

        <div className="grid gap-4">
          {jobsQuery.data?.map((job) => (
            <Card key={job.id}>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <h3 className="font-display text-xl font-extrabold">{job.title}</h3>
                  <p className="mt-2 text-sm font-semibold text-graphite">{job.location}</p>
                  <p className="mt-3 text-sm leading-6 text-graphite">{job.description}</p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => deleteMutation.mutate(job.id)}
                  disabled={deleteMutation.isPending}
                  className="shrink-0"
                >
                  <Trash2 size={18} />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
          {jobsQuery.data?.length === 0 && (
            <Card>
              <p className="text-sm text-graphite">No jobs listed yet.</p>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}

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
  const [candidateQuery, setCandidateQuery] = useState("");
  const candidatesQuery = useQuery({
    queryKey: ["admin-candidates"],
    queryFn: listAdminCandidates,
    retry: false,
  });
  const jobsQuery = useQuery({ queryKey: ["admin-jobs"], queryFn: listAdminJobs, retry: false });
  const filteredCandidates = (candidatesQuery.data ?? []).filter((candidate) =>
    `${candidate.name} ${candidate.email} ${candidate.nationalIdOrPassport ?? ""}`
      .toLowerCase()
      .includes(candidateQuery.toLowerCase()),
  );

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

          <JobAdminPanel />
          <CreateCandidatePanel />

          <section className="mt-12">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2 className="font-display text-3xl font-extrabold">Candidate Records</h2>
              <label className="relative block w-full md:max-w-md">
                <Search className="absolute left-3 top-3 text-graphite" size={18} />
                <Input
                  className="pl-10"
                  placeholder="Search by name or ID/passport"
                  value={candidateQuery}
                  onChange={(event) => setCandidateQuery(event.target.value)}
                />
              </label>
            </div>
            <div className="mt-6 grid gap-5">
              {filteredCandidates.map((candidate) => (
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
