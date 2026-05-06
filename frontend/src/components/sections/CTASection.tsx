import { ArrowRight, CalendarCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Reveal } from "./Reveal";

export function CTASection() {
  return (
    <section className="bg-teal py-20 text-white">
      <Reveal>
        <div className="section-shell flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
              Talent strategy session
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-extrabold">
              Build a stronger hiring pipeline with Mutawai Consultants Limited.
            </h2>
          </div>
          <Link to="/contact">
            <Button className="bg-white text-ink hover:bg-porcelain">
              <CalendarCheck size={18} />
              Book Consultation
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
