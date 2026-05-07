import { BriefcaseBusiness, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-white">
      <div className="section-shell grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-md bg-brass text-ink">
              <BriefcaseBusiness size={22} />
            </span>
            <span className="font-display text-lg font-extrabold">
              Mutawai HR Consultants Limited
            </span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
            Corporate recruitment, executive search, and talent advisory for organizations that
            need sharper hiring outcomes.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-brass">Company</h3>
          <div className="mt-5 grid gap-3 text-sm text-white/70">
            <Link to="/about">About Us</Link>
            <Link to="/services">Services</Link>
            <Link to="/jobs">Job Listings</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-brass">Reach Us</h3>
          <div className="mt-5 grid gap-3 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <MapPin size={16} /> Nairobi, Kenya
            </span>
            <span className="flex items-center gap-2">
              <Mail size={16} /> hello@mutawai.co.ke
            </span>
            <span className="flex items-center gap-2">
              <Phone size={16} /> +254 700 000 000
            </span>
            <span className="flex items-center gap-2">
              <Linkedin size={16} /> Mutawai HR Consultants Limited
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
