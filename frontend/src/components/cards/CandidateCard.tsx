import { FileCheck2, ShieldCheck, Sparkles } from "lucide-react";
import { Card } from "../ui/card";

const points = [
  { icon: Sparkles, label: "Curated role matching" },
  { icon: ShieldCheck, label: "Confidential representation" },
  { icon: FileCheck2, label: "Interview preparation" },
];

export function CandidateCard() {
  return (
    <Card>
      <h3 className="font-display text-2xl font-extrabold text-ink">Candidate Advisory</h3>
      <p className="mt-3 text-sm leading-6 text-graphite">
        Career moves are handled with discretion, clarity, and practical guidance from screening to
        offer negotiation.
      </p>
      <div className="mt-6 grid gap-3">
        {points.map((point) => (
          <span key={point.label} className="flex items-center gap-3 text-sm font-semibold text-ink">
            <point.icon size={18} className="text-teal" />
            {point.label}
          </span>
        ))}
      </div>
    </Card>
  );
}
