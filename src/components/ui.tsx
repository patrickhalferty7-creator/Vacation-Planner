import type { ReactNode } from "react";

export const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

export function Badge({
  children,
  tone = "blue",
  className,
}: {
  children: ReactNode;
  tone?: "blue" | "green" | "sand" | "coral" | "slate" | "outline";
  className?: string;
}) {
  const tones = {
    blue: "bg-coast-blue text-white",
    green: "bg-coast-green text-white",
    sand: "bg-coast-sand text-coast-slate",
    coral: "bg-coast-coral text-white",
    slate: "bg-coast-slate text-white",
    outline: "border border-coast-blue/25 bg-white text-coast-deep",
  };

  return (
    <span className={cx("inline-flex items-center rounded-full px-3 py-1 text-xs font-bold", tones[tone], className)}>
      {children}
    </span>
  );
}

export function IconButton({
  label,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cx(
        "inline-flex h-10 w-10 items-center justify-center rounded-md border border-coast-blue/15 bg-white text-coast-deep shadow-sm transition hover:-translate-y-0.5 hover:border-coast-blue/40 hover:bg-coast-foam focus:outline-none focus:ring-2 focus:ring-coast-blue/30",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TextButton({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const variants = {
    primary: "bg-coast-blue text-white hover:bg-coast-deep",
    secondary: "border border-coast-blue/20 bg-white text-coast-deep hover:bg-coast-foam",
    ghost: "text-coast-deep hover:bg-coast-foam",
  };

  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-coast-blue/30",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-[0.12em] text-coast-coral">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black text-coast-slate md:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-coast-slate/75">{description}</p>
    </div>
  );
}
