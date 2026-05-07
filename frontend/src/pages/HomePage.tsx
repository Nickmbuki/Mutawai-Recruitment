import { motion } from "framer-motion";
import { ArrowRight, Building2, CheckCircle2, SearchCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageTransition } from "../components/layout/PageTransition";
import { CTASection } from "../components/sections/CTASection";
import { Reveal } from "../components/sections/Reveal";
import { StatsCounter } from "../components/sections/StatsCounter";
import { TestimonialCarousel } from "../components/sections/TestimonialCarousel";
import { Button } from "../components/ui/button";
import { services } from "../data/services";

export function HomePage() {
  const [activeService, setActiveService] = useState(0);
  const selectedService = services[activeService];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveService((current) => (current + 1) % services.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <PageTransition>
      <section className="relative overflow-hidden bg-ink text-white">
        <img
          src={selectedService.image}
          alt={selectedService.title}
          className="absolute inset-0 h-full w-full object-cover opacity-35 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(24,33,47,0.94),rgba(24,33,47,0.72),rgba(15,118,110,0.68))]" />
        <div className="section-shell relative grid min-h-[760px] items-center gap-10 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brass">
              Mutawai HR Consultants Limited
            </p>
            <h1 className="mt-5 max-w-4xl font-display text-4xl font-extrabold leading-tight md:text-6xl">
              Professional recruitment and candidate support services.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">
              Explore Mutawai HR services in one moving experience: job placement, air ticket
              booking, CV writing, document review, screening, and candidate portal support.
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

          <div className="relative">
            <motion.div
              className="absolute -left-4 top-8 hidden h-52 w-52 rounded-full border border-white/15 lg:block"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              key={selectedService.title}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55 }}
              className="relative overflow-hidden rounded-lg border border-white/15 bg-white shadow-premium"
            >
              <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
                <div className="relative min-h-64 overflow-hidden">
                  <img
                    src={selectedService.image}
                    alt={selectedService.title}
                    className="h-full min-h-64 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-ink/10" />
                </div>
                <div className="p-6 text-ink md:p-8">
                  <div className="flex size-12 items-center justify-center rounded-md bg-teal text-white shadow-premium">
                    <selectedService.icon size={26} />
                  </div>
                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-brass">
                    Featured service
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight md:text-4xl">
                    {selectedService.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-graphite">{selectedService.body}</p>
                </div>
              </div>
            </motion.div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {services.map((service, index) => (
                <motion.button
                  key={service.title}
                  type="button"
                  onClick={() => setActiveService(index)}
                  whileHover={{ y: -3 }}
                  className={`flex min-h-16 items-center gap-3 rounded-md border p-3 text-left transition ${
                    activeService === index
                      ? "border-brass bg-white text-ink"
                      : "border-white/15 bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-md ${
                      activeService === index ? "bg-teal text-white" : "bg-white/15 text-brass"
                    }`}
                  >
                    <service.icon size={20} />
                  </span>
                  <span className="text-sm font-bold">{service.title}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative border-y border-white/10 bg-white/10 py-4 backdrop-blur">
          <motion.div
            className="flex w-max gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            {[...services, ...services].map((service, index) => (
              <div
                key={`${service.title}-${index}`}
                className="flex min-w-64 items-center gap-3 rounded-md border border-white/10 bg-white/10 px-4 py-3"
              >
                <service.icon className="text-brass" size={20} />
                <span className="text-sm font-bold">{service.title}</span>
              </div>
            ))}
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
                Everything candidates need to move from application to placement.
              </h2>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <Reveal key={service.title}>
                <motion.article
                  whileHover={{ y: -6 }}
                  className="h-full overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <service.icon className="text-teal" size={24} />
                    <h3 className="mt-4 font-display text-xl font-extrabold text-ink">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-graphite">{service.body}</p>
                  </div>
                </motion.article>
              </Reveal>
            ))}
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
