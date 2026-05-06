import { apiClient } from "../lib/api-client";
import type { Job, User } from "../types/api";

export async function listAdminUsers() {
  const { data } = await apiClient.get<{ users: User[] }>("/admin/users");
  return data.users;
}

export async function listAdminJobs() {
  const { data } = await apiClient.get<{ jobs: Job[] }>("/admin/jobs");
  return data.jobs;
}
