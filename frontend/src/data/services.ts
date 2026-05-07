import {
  BriefcaseBusiness,
  ClipboardCheck,
  Compass,
  FileSearch,
  PlaneTakeoff,
  ScrollText,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  icon: LucideIcon;
  title: string;
  body: string;
  image: string;
};

export const services: Service[] = [
  {
    icon: BriefcaseBusiness,
    title: "Job Placement",
    body: "Candidate placement for service, logistics, healthcare, hospitality, domestic, and operations roles.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: PlaneTakeoff,
    title: "Air Ticket Booking",
    body: "Travel coordination support for candidates and clients who require smooth, documented flight booking assistance.",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: ScrollText,
    title: "Professional CV Writing Services",
    body: "Well-structured CV writing and profile presentation support for candidates applying to competitive roles.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: UsersRound,
    title: "Candidate Screening",
    body: "Profile review, identity capture, document review, payment review, and admin-managed approval status.",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: FileSearch,
    title: "Document Review",
    body: "CVs, certificates, IDs, passports, and supporting files are collected for organized application review.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: ClipboardCheck,
    title: "Admin Placement Desk",
    body: "Administrators can create candidates, manage jobs, update statuses, and send candidate-facing comments.",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: Compass,
    title: "Candidate Portal",
    body: "Candidates can search jobs, upload documents, apply, and track application messages from their account.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  },
];
