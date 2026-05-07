import { apiClient } from "../lib/api-client";
import type { Application, Job } from "../types/api";

export async function listJobs() {
  const { data } = await apiClient.get<{ jobs: Job[] }>("/jobs");
  return data.jobs;
}

export async function getJob(id: string) {
  const { data } = await apiClient.get<{ job: Job }>(`/jobs/${id}`);
  return data.job;
}

export async function createApplication(payload: {
  jobId: number;
  resumeUrl: string;
  coverLetter: string;
}) {
  const { data } = await apiClient.post("/applications", payload);
  return data;
}

export async function listMyApplications() {
  const { data } = await apiClient.get<{ applications: Application[] }>("/applications/my");
  return data.applications;
}

export async function createAdminJob(payload: {
  title: string;
  description: string;
  location: string;
  salaryRange?: string;
}) {
  const { data } = await apiClient.post<{ job: Job }>("/jobs", {
    ...payload,
    salaryRange: payload.salaryRange ?? "Not disclosed",
  });
  return data.job;
}

export async function deleteAdminJob(id: number) {
  await apiClient.delete(`/jobs/${id}`);
}
