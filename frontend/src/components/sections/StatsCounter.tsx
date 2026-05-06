import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

type StatsCounterProps = {
  value: number;
  suffix?: string;
  label: string;
};

export function StatsCounter({ value, suffix = "", label }: StatsCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => `${Math.round(latest).toLocaleString()}${suffix}`);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.2, ease: "easeOut" });
    return controls.stop;
  }, [count, value]);

  return (
    <div className="border-l border-ink/10 pl-5">
      <motion.div className="font-display text-3xl font-extrabold text-ink">{rounded}</motion.div>
      <p className="mt-1 text-sm font-medium text-graphite">{label}</p>
    </div>
  );
}
