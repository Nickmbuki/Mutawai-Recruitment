import { motion } from "framer-motion";
import { PageTransition } from "../components/layout/PageTransition";
import { CTASection } from "../components/sections/CTASection";
import { Reveal } from "../components/sections/Reveal";
import { services } from "../data/services";

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
