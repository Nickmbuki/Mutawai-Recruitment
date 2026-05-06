export type UserRole = "admin" | "employer" | "candidate";

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type Company = {
  id: number;
  name: string;
  description: string;
  logoUrl?: string | null;
  ownerId: number;
};

export type Job = {
  id: number;
  title: string;
  description: string;
  salaryRange: string;
  location: string;
  companyId: number;
  createdAt: string;
  company?: Company;
};

export type Application = {
  id: number;
  jobId: number;
  candidateId: number;
  resumeUrl: string;
  coverLetter: string;
  status: "submitted" | "reviewing" | "shortlisted" | "rejected" | "hired";
  createdAt: string;
  job?: Job;
};
