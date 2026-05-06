import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";

const testimonials = [
  {
    quote:
      "Mutawai helped us hire senior leaders with the pace and discretion our board expected.",
    name: "Achieng N.",
    role: "Chief People Officer",
  },
  {
    quote:
      "Their shortlists were precise, well assessed, and aligned to our culture from the first round.",
    name: "Kiptoo M.",
    role: "Managing Director",
  },
  {
    quote:
      "The candidate experience was polished and transparent. I knew where I stood at every step.",
    name: "Sara W.",
    role: "Placed Candidate",
  },
];

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const testimonial = testimonials[index];

  const controls = useMemo(
    () =>
      testimonials.map((item, itemIndex) => (
        <Button
          key={item.name}
          variant={itemIndex === index ? "primary" : "secondary"}
          aria-label={`Show testimonial from ${item.name}`}
          className="size-3 rounded-full p-0"
          onClick={() => setIndex(itemIndex)}
        />
      )),
    [index],
  );

  return (
    <section className="bg-white py-20">
      <div className="section-shell">
        <div className="max-w-2xl">
          <p className="eyebrow">Client Confidence</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold text-ink">
            Trusted by leaders who hire carefully.
          </h2>
        </div>
        <motion.div
          key={testimonial.name}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 rounded-lg border border-ink/10 bg-porcelain p-8"
        >
          <Quote className="text-brass" size={34} />
          <p className="mt-6 max-w-4xl font-display text-3xl font-bold leading-tight text-ink">
            {testimonial.quote}
          </p>
          <div className="mt-8">
            <p className="font-bold text-ink">{testimonial.name}</p>
            <p className="text-sm text-graphite">{testimonial.role}</p>
          </div>
        </motion.div>
        <div className="mt-6 flex gap-3">{controls}</div>
      </div>
    </section>
  );
}
