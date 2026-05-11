import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileUp, MapPin, Plus, Send, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { z } from "zod";
import { getMe } from "../api/auth";
import { createApplication, getJob } from "../api/jobs";
import { uploadDocument, type UploadedFile } from "../api/uploads";
import { PageTransition } from "../components/layout/PageTransition";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

const applicationSchema = z.object({
  coverLetter: z.string().min(20, "Cover letter must be at least 20 characters"),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export function JobDetailsPage() {
  const { id = "1" } = useParams();
  const { data: job, isLoading } = useQuery({ queryKey: ["job", id], queryFn: () => getJob(id) });
  const profileQuery = useQuery({ queryKey: ["me"], queryFn: getMe, retry: false });
  const [cvFile, setCvFile] = useState<UploadedFile | null>(null);
  const [documents, setDocuments] = useState<UploadedFile[]>([]);
  const documentInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<ApplicationForm>({ resolver: zodResolver(applicationSchema) });
  const uploadMutation = useMutation({ mutationFn: uploadDocument });
  const mutation = useMutation({
    mutationFn: (payload: ApplicationForm) => {
      if (!cvFile) {
        throw new Error("CV upload is required");
      }

      return createApplication({
        ...payload,
        jobId: Number(id),
        resumeUrl: cvFile.url,
        documentUrls: documents.map((document) => document.url),
      });
    },
  });

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
          <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-teal">
            <ArrowLeft size={18} />
            Back to jobs
          </Link>

          {isLoading ? (
            <div className="mt-8 h-96 animate-pulse rounded-lg bg-mist" />
          ) : (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="eyebrow">{job?.company?.name ?? "Mutawai Partner"}</p>
                <h1 className="mt-3 font-display text-5xl font-extrabold text-ink">
                  {job?.title ?? "Recruitment Opportunity"}
                </h1>
                <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-graphite">
                  <span className="flex items-center gap-2">
                    <MapPin size={18} className="text-coral" />
                    {job?.location ?? "Nairobi, Kenya"}
                  </span>
                </div>
                <p className="mt-8 max-w-3xl text-lg leading-8 text-graphite">
                  {job?.description ??
                    "This role is managed by Mutawai HR Consultants Limited. Apply with a current resume and targeted cover letter."}
                </p>
              </div>

              <Card>
                <h2 className="font-display text-2xl font-extrabold">Apply for this role</h2>
                {!profileQuery.data ? (
                  <div className="mt-6 rounded-md border border-brass/30 bg-brass/10 p-4">
                    <p className="text-sm font-semibold text-ink">
                      Register or login as a candidate before applying for this job.
                    </p>
                    <Link to="/login" className="mt-4 inline-flex">
                      <Button type="button">
                        <FileUp size={18} />
                        Register / Login to Apply
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <form
                    className="mt-6 grid gap-4"
                    onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
                  >
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
                  <div>
                    <Textarea placeholder="Cover letter" {...form.register("coverLetter")} />
                    {form.formState.errors.coverLetter && (
                      <p className="mt-1 text-xs font-semibold text-coral">
                        {form.formState.errors.coverLetter.message}
                      </p>
                    )}
                  </div>
                  {uploadMutation.isError && (
                    <p className="text-sm font-semibold text-coral">
                      Upload failed. Confirm Cloudinary variables are configured.
                    </p>
                  )}
                  <Button type="submit" disabled={mutation.isPending || uploadMutation.isPending || !cvFile}>
                    <FileUp size={18} />
                    <Send size={18} />
                    {mutation.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                  {mutation.isSuccess && (
                    <p className="text-sm font-semibold text-teal">Application submitted.</p>
                  )}
                  {mutation.isError && (
                    <p className="text-sm font-semibold text-coral">
                      Sign in as a candidate before applying.
                    </p>
                  )}
                  </form>
                )}
              </Card>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
