import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { z } from "zod";
import { createApplication, getJob } from "../api/jobs";
import { PageTransition } from "../components/layout/PageTransition";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

const applicationSchema = z.object({
  resumeUrl: z.string().url("Enter a valid resume URL"),
  coverLetter: z.string().min(20, "Cover letter must be at least 20 characters"),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export function JobDetailsPage() {
  const { id = "1" } = useParams();
  const { data: job, isLoading } = useQuery({ queryKey: ["job", id], queryFn: () => getJob(id) });
  const form = useForm<ApplicationForm>({ resolver: zodResolver(applicationSchema) });
  const mutation = useMutation({
    mutationFn: (payload: ApplicationForm) =>
      createApplication({ ...payload, jobId: Number(id) }),
  });

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
                <form
                  className="mt-6 grid gap-4"
                  onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
                >
                  <div>
                    <Input placeholder="Resume URL" {...form.register("resumeUrl")} />
                    {form.formState.errors.resumeUrl && (
                      <p className="mt-1 text-xs font-semibold text-coral">
                        {form.formState.errors.resumeUrl.message}
                      </p>
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
                  <Button type="submit" disabled={mutation.isPending}>
                    <Send size={18} />
                    Submit Application
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
              </Card>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
