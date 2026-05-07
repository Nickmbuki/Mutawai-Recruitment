import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Banknote, BriefcaseBusiness, FileText, Link as LinkIcon, Send, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { getMe } from "../api/auth";
import { createApplication, listJobs, listMyApplications } from "../api/jobs";
import { PageTransition } from "../components/layout/PageTransition";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

const applicationSchema = z.object({
  jobId: z.coerce.number().int().positive(),
  resumeUrl: z.string().url(),
  coverLetter: z.string().min(20),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const statusLabel: Record<string, string> = {
  processing: "Processing",
  approved: "Approved",
  prequalified: "Prequalified",
  rejected: "Rejected",
  blocked: "Blocked",
  pending: "Pending",
  verified: "Verified",
};

export function CandidatePortalPage() {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({ queryKey: ["me"], queryFn: getMe, retry: false });
  const jobsQuery = useQuery({ queryKey: ["jobs"], queryFn: listJobs });
  const applicationsQuery = useQuery({
    queryKey: ["my-applications"],
    queryFn: listMyApplications,
    retry: false,
  });
  const form = useForm<ApplicationForm>({ resolver: zodResolver(applicationSchema) });
  const mutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      form.reset();
      void queryClient.invalidateQueries({ queryKey: ["my-applications"] });
    },
  });

  return (
    <PageTransition>
      <section className="bg-white py-20">
        <div className="section-shell">
          <p className="eyebrow">Candidate Dashboard</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-extrabold text-ink">
            Your Mutawai HR job account.
          </h1>

          {profileQuery.data ? (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <Card>
                <ShieldCheck className="text-teal" />
                <h2 className="mt-4 font-display text-xl font-extrabold">Profile Status</h2>
                <Badge className="mt-3">
                  {statusLabel[profileQuery.data.candidateStatus ?? "processing"]}
                </Badge>
                {profileQuery.data.adminComment && (
                  <p className="mt-4 text-sm leading-6 text-graphite">
                    {profileQuery.data.adminComment}
                  </p>
                )}
              </Card>
              <Card>
                <Banknote className="text-brass" />
                <h2 className="mt-4 font-display text-xl font-extrabold">Payment Review</h2>
                <Badge className="mt-3">
                  {statusLabel[profileQuery.data.paymentStatus ?? "pending"]}
                </Badge>
                <p className="mt-4 text-sm text-graphite">
                  Reference: {profileQuery.data.paymentReference ?? "Not submitted"}
                </p>
              </Card>
              <Card>
                <FileText className="text-coral" />
                <h2 className="mt-4 font-display text-xl font-extrabold">Applications</h2>
                <p className="mt-3 text-4xl font-extrabold">
                  {applicationsQuery.data?.length ?? 0}
                </p>
              </Card>
            </div>
          ) : (
            <Card className="mt-8">
              <p className="text-sm font-semibold text-coral">
                Login as a candidate to view your profile, messages, and applications.
              </p>
            </Card>
          )}

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="flex items-center gap-3">
                <BriefcaseBusiness className="text-teal" />
                <h2 className="font-display text-3xl font-extrabold">Available Jobs</h2>
              </div>
              <div className="mt-6 grid gap-5">
                {jobsQuery.data?.map((job) => (
                  <Card key={job.id}>
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                      <div>
                        <h3 className="font-display text-2xl font-extrabold">{job.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-graphite">{job.description}</p>
                        <p className="mt-3 text-sm font-semibold text-ink">{job.location}</p>
                      </div>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-teal"
                      >
                        <LinkIcon size={16} />
                        Details
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Card>
              <h2 className="font-display text-2xl font-extrabold">Apply to a job</h2>
              <form
                className="mt-6 grid gap-4"
                onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
              >
                <select
                  className="h-11 rounded-md border border-ink/15 bg-white px-3 text-sm outline-none focus:border-teal"
                  {...form.register("jobId")}
                >
                  <option value="">Select available job</option>
                  {jobsQuery.data?.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
                <Input placeholder="Resume URL" {...form.register("resumeUrl")} />
                <Textarea placeholder="Cover letter" {...form.register("coverLetter")} />
                <Button type="submit" disabled={mutation.isPending || !profileQuery.data}>
                  <Send size={18} />
                  Submit Application
                </Button>
                {mutation.isSuccess && (
                  <p className="text-sm font-semibold text-teal">Application submitted.</p>
                )}
                {mutation.isError && (
                  <p className="text-sm font-semibold text-coral">
                    Login as a candidate before applying.
                  </p>
                )}
              </form>
            </Card>
          </div>

          <section className="mt-12">
            <h2 className="font-display text-3xl font-extrabold">Your application links</h2>
            <div className="mt-6 grid gap-5">
              {applicationsQuery.data?.map((application) => (
                <Card key={application.id}>
                  <div className="flex flex-col justify-between gap-4 md:flex-row">
                    <div>
                      <h3 className="font-display text-xl font-extrabold">
                        {application.job?.title}
                      </h3>
                      <p className="mt-2 text-sm text-graphite">
                        Status: <span className="font-bold">{application.status}</span>
                      </p>
                      {application.adminComment && (
                        <p className="mt-3 text-sm leading-6 text-ink">
                          {application.adminComment}
                        </p>
                      )}
                    </div>
                    <Link
                      className="inline-flex items-center gap-2 text-sm font-bold text-teal"
                      to={`/jobs/${application.jobId}`}
                    >
                      <LinkIcon size={16} />
                      Open job
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </section>
    </PageTransition>
  );
}
