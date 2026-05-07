import { motion } from "framer-motion";
import { BriefcaseBusiness, Menu, Search, UserRound } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "../ui/button";

const navItems = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Jobs", href: "/jobs" },
  { label: "Candidates", href: "/candidates" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 border-b border-ink/10 bg-porcelain/90 backdrop-blur-xl"
    >
      <div className="section-shell flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-md bg-ink text-white">
            <BriefcaseBusiness size={22} />
          </span>
          <span className="font-display text-lg font-extrabold text-ink">Mutawai HR</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `text-sm font-semibold transition hover:text-teal ${
                  isActive ? "text-teal" : "text-graphite"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" aria-label="Search opportunities">
            <Search size={18} />
          </Button>
          <Link to="/login">
            <Button variant="secondary">
              <UserRound size={18} />
              Login
            </Button>
          </Link>
        </div>

        <Button variant="ghost" className="lg:hidden" aria-label="Open menu">
          <Menu size={22} />
        </Button>
      </div>
    </motion.header>
  );
}
