import { FileText, Send, ShieldCheck } from "lucide-react";
import { CandidateCard } from "../components/cards/CandidateCard";
import { PageTransition } from "../components/layout/PageTransition";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

export function CandidatePortalPage() {
  return (
    <PageTransition>
      <section className="bg-white py-20">
        <div className="section-shell">
          <p className="eyebrow">Candidate Portal</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-extrabold text-ink">
            A confidential space for stronger career moves.
          </h1>
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <CandidateCard />
            <Card>
              <h2 className="font-display text-2xl font-extrabold">Submit your profile</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Input placeholder="Full name" />
                <Input placeholder="Email address" />
                <Input placeholder="Resume URL" />
                <Input placeholder="Target role" />
                <Textarea className="md:col-span-2" placeholder="Career summary" />
              </div>
              <Button className="mt-6">
                <Send size={18} />
                Send Profile
              </Button>
            </Card>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card>
              <ShieldCheck className="text-teal" />
              <h3 className="mt-4 font-display text-xl font-extrabold">Private Representation</h3>
              <p className="mt-2 text-sm leading-6 text-graphite">
                Your application activity stays protected behind authenticated candidate routes.
              </p>
            </Card>
            <Card>
              <FileText className="text-brass" />
              <h3 className="mt-4 font-display text-xl font-extrabold">Application History</h3>
              <p className="mt-2 text-sm leading-6 text-graphite">
                Track submitted roles and recruiter progress as the backend workflow expands.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
