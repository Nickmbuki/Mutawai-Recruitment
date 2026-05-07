import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Banknote,
  BriefcaseBusiness,
  FileText,
  FileUp,
  Link as LinkIcon,
  Plus,
  Search,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { getMe } from "../api/auth";
import { createApplication, listJobs, listMyApplications } from "../api/jobs";
import { uploadDocument, type UploadedFile } from "../api/uploads";
import { PageTransition } from "../components/layout/PageTransition";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

const applicationSchema = z.object({
  jobId: z.coerce.number().int().positive(),
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
  const [jobQuery, setJobQuery] = useState("");
  const [cvFile, setCvFile] = useState<UploadedFile | null>(null);
  const [documents, setDocuments] = useState<UploadedFile[]>([]);
  const documentInputRef = useRef<HTMLInputElement | null>(null);
  const profileQuery = useQuery({ queryKey: ["me"], queryFn: getMe, retry: false });
  const jobsQuery = useQuery({ queryKey: ["jobs"], queryFn: listJobs });
  const applicationsQuery = useQuery({
    queryKey: ["my-applications"],
    queryFn: listMyApplications,
    retry: false,
  });
  const form = useForm<ApplicationForm>({ resolver: zodResolver(applicationSchema) });
  const uploadMutation = useMutation({ mutationFn: uploadDocument });
  const mutation = useMutation({
    mutationFn: (values: ApplicationForm) => {
      if (!cvFile) {
        throw new Error("CV upload is required");
      }

      return createApplication({
        ...values,
        resumeUrl: cvFile.url,
        documentUrls: documents.map((document) => document.url),
      });
    },
    onSuccess: () => {
      form.reset();
      setCvFile(null);
      setDocuments([]);
      void queryClient.invalidateQueries({ queryKey: ["my-applications"] });
    },
  });
  const filteredJobs = useMemo(
    () =>
      (jobsQuery.data ?? []).filter((job) =>
        `${job.title} ${job.location} ${job.description}`
          .toLowerCase()
          .includes(jobQuery.toLowerCase()),
      ),
    [jobQuery, jobsQuery.data],
  );

  async function handleUpload(files: FileList | null, type: "cv" | "documents") {
    const selectedFiles = Array.from(files ?? []);
    if (!selectedFiles.length) {
      return;
    }

    const uploaded = await Promise.all(selectedFiles.map((file) => uploadMutation.mutateAsync(file)));

    if (type === "cv") {
      setCvFile(uploaded[0]);
      return;
    }

    setDocuments((current) => [...current, ...uploaded]);
  }

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
              <label className="relative mt-5 block">
                <Search className="absolute left-3 top-3 text-graphite" size={18} />
                <Input
                  className="pl-10"
                  placeholder="Search job by name"
                  value={jobQuery}
                  onChange={(event) => setJobQuery(event.target.value)}
                />
              </label>
              <div className="mt-6 grid gap-5">
                {filteredJobs.map((job) => (
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
                <div>
                  <label className="text-sm font-bold text-ink">Upload CV</label>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,image/png,image/jpeg,image/webp"
                    onChange={(event) => void handleUpload(event.target.files, "cv")}
                  />
                  {cvFile && (
                    <p className="mt-1 text-xs font-semibold text-teal">
                      CV uploaded: {cvFile.originalName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-bold text-ink">Other documents</label>
                  <input
                    ref={documentInputRef}
                    className="hidden"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,image/png,image/jpeg,image/webp"
                    onChange={(event) => {
                      void handleUpload(event.target.files, "documents");
                      event.currentTarget.value = "";
                    }}
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => documentInputRef.current?.click()}
                      disabled={uploadMutation.isPending}
                    >
                      <Plus size={18} />
                      {documents.length ? "Add more documents" : "Choose documents"}
                    </Button>
                  </div>
                  {documents.length > 0 && (
                    <div className="mt-3 grid gap-2">
                      {documents.map((document, index) => (
                        <div
                          key={`${document.url}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-md bg-mist px-3 py-2 text-xs font-semibold text-ink"
                        >
                          <span className="truncate">{document.originalName}</span>
                          <button
                            type="button"
                            className="shrink-0 text-coral transition hover:text-ink"
                            aria-label={`Remove ${document.originalName}`}
                            onClick={() =>
                              setDocuments((current) =>
                                current.filter((_, documentIndex) => documentIndex !== index),
                              )
                            }
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Textarea placeholder="Cover letter" {...form.register("coverLetter")} />
                {uploadMutation.isError && (
                  <p className="text-sm font-semibold text-coral">
                    Upload failed. Confirm Cloudinary variables are configured.
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={
                    mutation.isPending || uploadMutation.isPending || !profileQuery.data || !cvFile
                  }
                >
                  <FileUp size={18} />
                  <Send size={18} />
                  {mutation.isPending ? "Submitting..." : "Submit Application"}
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
