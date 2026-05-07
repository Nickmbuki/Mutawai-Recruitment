export type UserRole = "admin" | "employer" | "candidate";

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  nationalIdOrPassport?: string | null;
  role: UserRole;
  candidateStatus?: "processing" | "approved" | "prequalified" | "rejected" | "blocked";
  paymentMethod?: "mpesa" | "paypal" | null;
  paymentReference?: string | null;
  paymentStatus?: "pending" | "verified" | "rejected";
  adminComment?: string | null;
  createdAt: string;
  updatedAt?: string;
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
  documentUrls?: string | null;
  coverLetter: string;
  status:
    | "submitted"
    | "reviewing"
    | "shortlisted"
    | "processing"
    | "approved"
    | "prequalified"
    | "rejected"
    | "hired";
  adminComment?: string | null;
  createdAt: string;
  job?: Job;
};

export type CandidateWithApplications = User & {
  applications: Application[];
};
