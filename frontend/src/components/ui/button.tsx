import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-ink text-white shadow-premium hover:bg-graphite",
        variant === "secondary" && "border border-ink/15 bg-white text-ink hover:border-teal hover:text-teal",
        variant === "ghost" && "bg-transparent text-ink hover:bg-ink/5",
        className,
      )}
      {...props}
    />
  );
}
