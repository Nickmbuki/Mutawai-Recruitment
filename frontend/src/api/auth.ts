import { apiClient } from "../lib/api-client";
import type { User } from "../types/api";

type AuthResponse = {
  user: User;
  accessToken: string;
};

export async function login(payload: { email: string; password: string }) {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  localStorage.setItem("mutawai_access_token", data.accessToken);
  return data;
}

export async function register(payload: {
  name: string;
  email: string;
  phone: string;
  nationalIdOrPassport: string;
  password: string;
  paymentMethod: "mpesa" | "paypal";
  paymentReference: string;
}) {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
  localStorage.setItem("mutawai_access_token", data.accessToken);
  return data;
}

export async function getMe() {
  const { data } = await apiClient.get<{ user: User }>("/auth/me");
  return data.user;
}
