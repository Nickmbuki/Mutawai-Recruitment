import { apiClient } from "../lib/api-client";

export type CvPayment = {
  id: number;
  method: "mpesa" | "paypal";
  status: "pending" | "verified" | "rejected";
  providerReference?: string | null;
  checkoutRequestId?: string | null;
  amount: string;
  currency: string;
  generationLimit: number;
  generationCount: number;
  remainingGenerations: number;
  createdAt: string;
};

export type CvGeneration = {
  id: number;
  paymentId: number;
  candidateId: number;
  formatId: "format-1" | "format-2";
  genericCvName: string;
  generatedCv: string;
  createdAt: string;
};

export async function getCvServiceStatus() {
  const { data } = await apiClient.get<{
    activePayment: CvPayment | null;
    recentPayments: CvPayment[];
    generationLimit: number;
  }>("/cv-service/status");
  return data;
}

export async function initiateMpesaCvPayment(payload: { phone: string }) {
  const { data } = await apiClient.post<{
    payment: CvPayment;
    checkoutRequestId: string;
    message: string;
  }>("/cv-service/mpesa/initiate", payload);
  return data;
}

export async function createPaypalCvOrder() {
  const { data } = await apiClient.post<{
    payment: CvPayment;
    orderId: string;
    approveUrl?: string;
  }>("/cv-service/paypal/create-order");
  return data;
}

export async function capturePaypalCvOrder(orderId: string) {
  const { data } = await apiClient.post<{ payment: CvPayment }>("/cv-service/paypal/capture", {
    orderId,
  });
  return data.payment;
}

export async function generatePaidCv(payload: {
  paymentId: number;
  formatId: "format-1" | "format-2";
  file: File;
}) {
  const formData = new FormData();
  formData.append("paymentId", String(payload.paymentId));
  formData.append("formatId", payload.formatId);
  formData.append("file", payload.file);

  const { data } = await apiClient.post<{
    generation: CvGeneration;
    payment: CvPayment;
  }>("/cv-service/generate", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
