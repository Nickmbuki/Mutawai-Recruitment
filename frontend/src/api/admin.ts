import { apiClient } from "../lib/api-client";
import type { Application, CandidateWithApplications, Job, User } from "../types/api";

export async function listAdminUsers() {
  const { data } = await apiClient.get<{ users: User[] }>("/admin/users");
  return data.users;
}

export async function listAdminJobs() {
  const { data } = await apiClient.get<{ jobs: Job[] }>("/admin/jobs");
  return data.jobs;
}

export async function listAdminCandidates() {
  const { data } = await apiClient.get<{ candidates: CandidateWithApplications[] }>(
    "/admin/candidates",
  );
  return data.candidates;
}

export async function updateAdminCandidate(payload: {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  nationalIdOrPassport?: string;
  candidateStatus?: User["candidateStatus"];
  paymentStatus?: User["paymentStatus"];
  adminComment?: string;
}) {
  const { id, ...body } = payload;
  const { data } = await apiClient.put<{ candidate: User }>(`/admin/candidates/${id}`, body);
  return data.candidate;
}

export async function deleteAdminCandidate(id: number) {
  await apiClient.delete(`/admin/candidates/${id}`);
}

export async function updateAdminApplication(payload: {
  id: number;
  status?: Application["status"];
  adminComment?: string;
}) {
  const { id, ...body } = payload;
  const { data } = await apiClient.put<{ application: Application }>(
    `/admin/applications/${id}`,
    body,
  );
  return data.application;
}
