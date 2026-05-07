import { motion } from "framer-motion";
import { BriefcaseBusiness, Menu, Search, UserRound, X } from "lucide-react";
import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 border-b border-ink/10 bg-porcelain/90 backdrop-blur-xl"
    >
      <div className="section-shell flex h-20 items-center justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="flex size-11 items-center justify-center rounded-md bg-ink text-white">
            <BriefcaseBusiness size={22} />
          </span>
          <span className="truncate font-display text-base font-extrabold text-ink sm:text-lg">
            Mutawai HR
          </span>
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

        <Button
          type="button"
          variant="ghost"
          className="lg:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </Button>
      </div>

      {isOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-ink/10 bg-porcelain lg:hidden"
        >
          <div className="section-shell grid gap-2 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-3 text-sm font-semibold transition ${
                    isActive ? "bg-white text-teal" : "text-graphite hover:bg-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <Button type="button" variant="secondary" className="mt-2 w-full">
                <UserRound size={18} />
                Login / Admin
              </Button>
            </Link>
          </div>
        </motion.nav>
      )}
    </motion.header>
  );
}
