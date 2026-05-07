import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  ClipboardCheck,
  Compass,
  FileSearch,
  PlaneTakeoff,
  ScrollText,
  UsersRound,
} from "lucide-react";
import { PageTransition } from "../components/layout/PageTransition";
import { CTASection } from "../components/sections/CTASection";
import { Reveal } from "../components/sections/Reveal";

const services = [
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

export function ServicesPage() {
  return (
    <PageTransition>
      <section className="bg-white py-20">
        <div className="section-shell">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow">Services</p>
              <h1 className="mt-3 font-display text-4xl font-extrabold text-ink md:text-5xl">
                Recruitment and candidate support services with a professional finish.
              </h1>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.title}>
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="h-full overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-ink/20" />
                    <div className="absolute left-4 top-4 flex size-11 items-center justify-center rounded-md bg-white text-teal shadow-premium">
                      <service.icon size={24} />
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-brass">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="mt-3 font-display text-2xl font-extrabold text-ink">
                      {service.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-graphite">{service.body}</p>
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </PageTransition>
  );
}
