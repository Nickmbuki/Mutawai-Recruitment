import { motion } from "framer-motion";
import { ArrowRight, Building2, CheckCircle2, SearchCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { CandidateCard } from "../components/cards/CandidateCard";
import { PageTransition } from "../components/layout/PageTransition";
import { CTASection } from "../components/sections/CTASection";
import { Reveal } from "../components/sections/Reveal";
import { StatsCounter } from "../components/sections/StatsCounter";
import { TestimonialCarousel } from "../components/sections/TestimonialCarousel";
import { Button } from "../components/ui/button";

export function HomePage() {
  return (
    <PageTransition>
      <section className="relative overflow-hidden bg-ink text-white">
        <img
          src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=80"
          alt="Corporate recruitment meeting"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="section-shell relative grid min-h-[720px] items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brass">
              Mutawai HR Consultants Limited
            </p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl font-extrabold leading-tight md:text-7xl">
              Corporate recruitment for decisive hiring teams.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">
              We connect candidates with vetted service, hospitality, healthcare, domestic, and
              logistics opportunities through a structured HR placement process.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/jobs">
                <Button className="bg-brass text-ink hover:bg-white">
                  <SearchCheck size={18} />
                  Browse Jobs
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary" className="border-white/30 bg-white/10 text-white">
                  Hire Talent
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.16 }}
            className="rounded-lg border border-white/15 bg-white/10 p-6 backdrop-blur-xl"
          >
            <div className="grid gap-4">
              {["Executive Search", "Permanent Placement", "Talent Market Mapping"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md bg-white/10 p-4">
                  <CheckCircle2 className="text-brass" size={22} />
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="section-shell grid gap-8 md:grid-cols-3">
          <StatsCounter value={1200} suffix="+" label="Vetted professionals in active networks" />
          <StatsCounter value={96} suffix="%" label="Search assignments completed on brief" />
          <StatsCounter value={14} suffix="d" label="Average time to first qualified shortlist" />
        </div>
      </section>

      <section className="py-20">
        <div className="section-shell">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow">Services</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold text-ink">
                Recruitment programs for candidates and managed placements.
              </h2>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
                <h3 className="font-display text-2xl font-extrabold text-ink">
                  Single Employer Placement Desk
                </h3>
                <p className="mt-3 text-sm leading-6 text-graphite">
                  Mutawai HR Consultants Limited manages one hiring pipeline with clear job listings,
                  candidate review, payment verification, and admin status updates.
                </p>
              </div>
            </Reveal>
            <Reveal>
              <CandidateCard />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-mist py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div>
              <p className="eyebrow">Process</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold text-ink">
                Built for considered decisions.
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["01", "Calibrate", "Define the role, market, compensation, and success profile."],
              ["02", "Assess", "Screen, interview, reference, and score candidates with discipline."],
              ["03", "Close", "Support selection, offer management, and onboarding handover."],
            ].map(([step, title, body]) => (
              <Reveal key={step}>
                <div className="rounded-lg bg-white p-6">
                  <span className="text-sm font-extrabold text-coral">{step}</span>
                  <h3 className="mt-3 font-display text-xl font-extrabold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-graphite">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <TestimonialCarousel />

      <section className="py-20">
        <div className="section-shell grid gap-8 md:grid-cols-3">
          {[
            [Building2, "Mutawai HR", "Managed recruitment records and candidate screening."],
            [SearchCheck, "Candidates", "Confidential guidance for senior and specialist roles."],
            [CheckCircle2, "Administrators", "Operational visibility across jobs, users, and activity."],
          ].map(([Icon, title, body]) => (
            <Reveal key={String(title)}>
              <div className="rounded-lg border border-ink/10 bg-white p-6">
                <Icon className="text-teal" size={28} />
                <h3 className="mt-4 font-display text-xl font-extrabold">{String(title)}</h3>
                <p className="mt-2 text-sm leading-6 text-graphite">{String(body)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection />
    </PageTransition>
  );
}
