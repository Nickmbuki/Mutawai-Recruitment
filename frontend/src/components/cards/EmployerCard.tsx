import { ChartNoAxesCombined, SearchCheck, UsersRound } from "lucide-react";
import { Card } from "../ui/card";

const points = [
  { icon: SearchCheck, label: "Executive search and shortlist design" },
  { icon: UsersRound, label: "Role calibration with hiring teams" },
  { icon: ChartNoAxesCombined, label: "Pipeline reporting and market insight" },
];

export function EmployerCard() {
  return (
    <Card>
      <h3 className="font-display text-2xl font-extrabold text-ink">Employer Partnership</h3>
      <p className="mt-3 text-sm leading-6 text-graphite">
        Structured search programs for organizations that need vetted candidates and a polished
        hiring process.
      </p>
      <div className="mt-6 grid gap-3">
        {points.map((point) => (
          <span key={point.label} className="flex items-center gap-3 text-sm font-semibold text-ink">
            <point.icon size={18} className="text-brass" />
            {point.label}
          </span>
        ))}
      </div>
    </Card>
  );
}
