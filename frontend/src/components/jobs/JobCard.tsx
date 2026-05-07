import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { Job } from "../../types/api";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

export function JobCard({ job }: { job: Job }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
      <Card className="h-full hover:border-teal/40 hover:shadow-premium">
        <div className="flex items-start justify-between gap-5">
          <div>
            <Badge>{job.company?.name ?? "Mutawai Partner"}</Badge>
            <h3 className="mt-4 font-display text-2xl font-extrabold text-ink">{job.title}</h3>
          </div>
          <ArrowRight className="text-teal" size={22} />
        </div>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-graphite">{job.description}</p>
        <div className="mt-6 grid gap-3 text-sm font-semibold text-graphite">
          <span className="flex items-center gap-2">
            <MapPin size={16} className="text-coral" />
            {job.location}
          </span>
        </div>
        <Link className="mt-6 inline-flex text-sm font-bold text-teal" to={`/jobs/${job.id}`}>
          View role
        </Link>
      </Card>
    </motion.div>
  );
}
