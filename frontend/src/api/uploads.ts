import { apiClient } from "../lib/api-client";

export type UploadedFile = {
  url: string;
  publicId: string;
  originalName: string;
  mimeType: string;
};

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<{ file: UploadedFile }>("/uploads/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.file;
}
