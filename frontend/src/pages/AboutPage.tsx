import { Award, Globe2, Handshake, ShieldCheck } from "lucide-react";
import { PageTransition } from "../components/layout/PageTransition";
import { Reveal } from "../components/sections/Reveal";

const values = [
  { icon: ShieldCheck, title: "Discretion", body: "Confidential handling for sensitive roles." },
  { icon: Award, title: "Quality", body: "Structured screening and role-fit assessment." },
  { icon: Handshake, title: "Partnership", body: "Hiring support from brief to accepted offer." },
  { icon: Globe2, title: "Market Reach", body: "Networks across Kenya and regional markets." },
];

export function AboutPage() {
  return (
    <PageTransition>
      <section className="bg-white py-20">
        <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div>
              <p className="eyebrow">About Us</p>
              <h1 className="mt-3 font-display text-5xl font-extrabold text-ink">
                Recruitment counsel for companies that hire with intent.
              </h1>
              <p className="mt-6 text-lg leading-8 text-graphite">
                Mutawai HR Consultants Limited manages candidate registration, payment review,
                screening, and placement workflows for available job opportunities.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <img
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1400&q=80"
              alt="Consultants reviewing recruitment strategy"
              className="h-[460px] w-full rounded-lg object-cover shadow-premium"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-mist py-20">
        <div className="section-shell">
          <div className="grid gap-6 md:grid-cols-4">
            {values.map((value) => (
              <Reveal key={value.title}>
                <div className="rounded-lg bg-white p-6">
                  <value.icon className="text-teal" size={28} />
                  <h3 className="mt-4 font-display text-xl font-extrabold">{value.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-graphite">{value.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
