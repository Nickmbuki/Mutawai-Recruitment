import { Building2, Plus, UsersRound } from "lucide-react";
import { EmployerCard } from "../components/cards/EmployerCard";
import { PageTransition } from "../components/layout/PageTransition";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

export function EmployerPortalPage() {
  return (
    <PageTransition>
      <section className="bg-white py-20">
        <div className="section-shell">
          <p className="eyebrow">Employer Portal</p>
          <h1 className="mt-3 font-display text-5xl font-extrabold text-ink">
            Manage hiring demand with clarity.
          </h1>
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <EmployerCard />
            <Card>
              <h2 className="font-display text-2xl font-extrabold">Create a job brief</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Input placeholder="Job title" />
                <Input placeholder="Location" />
                <Input placeholder="Salary range" />
                <Input placeholder="Company ID" />
                <Textarea className="md:col-span-2" placeholder="Role description" />
              </div>
              <Button className="mt-6">
                <Plus size={18} />
                Publish Brief
              </Button>
            </Card>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card>
              <Building2 className="text-teal" />
              <h3 className="mt-4 font-display text-xl font-extrabold">Company Profiles</h3>
              <p className="mt-2 text-sm leading-6 text-graphite">
                Link job posts to verified employer entities and owner accounts.
              </p>
            </Card>
            <Card>
              <UsersRound className="text-brass" />
              <h3 className="mt-4 font-display text-xl font-extrabold">Shortlist Visibility</h3>
              <p className="mt-2 text-sm leading-6 text-graphite">
                Keep hiring stakeholders aligned through structured recruitment records.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
