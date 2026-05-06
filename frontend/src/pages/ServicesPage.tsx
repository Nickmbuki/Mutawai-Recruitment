import { BriefcaseBusiness, ClipboardCheck, Compass, Crown, FileSearch, UsersRound } from "lucide-react";
import { PageTransition } from "../components/layout/PageTransition";
import { CTASection } from "../components/sections/CTASection";
import { Reveal } from "../components/sections/Reveal";

const services = [
  {
    icon: Crown,
    title: "Executive Search",
    body: "Discreet senior leadership search with market mapping, outreach, and calibrated assessment.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Permanent Recruitment",
    body: "End-to-end hiring for specialist and management roles with shortlist discipline.",
  },
  {
    icon: UsersRound,
    title: "Talent Advisory",
    body: "Compensation insight, role design, pipeline quality review, and hiring process improvement.",
  },
  {
    icon: FileSearch,
    title: "Candidate Assessment",
    body: "Structured screening, competency interviews, reference checks, and role-fit scoring.",
  },
  {
    icon: ClipboardCheck,
    title: "Employer Portal",
    body: "Create companies, publish jobs, and track recruitment activity through a protected workflow.",
  },
  {
    icon: Compass,
    title: "Candidate Portal",
    body: "Discover roles, submit applications, and manage career opportunities in one place.",
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
              <h1 className="mt-3 font-display text-5xl font-extrabold text-ink">
                Recruitment services designed for high-stakes hiring.
              </h1>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Reveal key={service.title}>
                <div className="h-full rounded-lg border border-ink/10 bg-porcelain p-6">
                  <service.icon className="text-brass" size={30} />
                  <h2 className="mt-5 font-display text-2xl font-extrabold text-ink">
                    {service.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-graphite">{service.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </PageTransition>
  );
}
