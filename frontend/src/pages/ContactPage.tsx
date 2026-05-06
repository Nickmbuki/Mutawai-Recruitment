import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageTransition } from "../components/layout/PageTransition";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(20),
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactPage() {
  const form = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  return (
    <PageTransition>
      <section className="bg-white py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Contact</p>
            <h1 className="mt-3 font-display text-5xl font-extrabold text-ink">
              Start a recruitment conversation.
            </h1>
            <div className="mt-8 grid gap-4 text-sm font-semibold text-graphite">
              <span className="flex items-center gap-3">
                <MapPin className="text-teal" /> Nairobi, Kenya
              </span>
              <span className="flex items-center gap-3">
                <Mail className="text-brass" /> hello@mutawai.co.ke
              </span>
              <span className="flex items-center gap-3">
                <Phone className="text-coral" /> +254 700 000 000
              </span>
            </div>
          </div>
          <Card>
            <form
              className="grid gap-4"
              onSubmit={form.handleSubmit(() => form.reset())}
            >
              <Input placeholder="Name" {...form.register("name")} />
              <Input placeholder="Email" {...form.register("email")} />
              <Textarea placeholder="Tell us about your hiring need or career goal" {...form.register("message")} />
              <Button type="submit">
                <Send size={18} />
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </PageTransition>
  );
}
