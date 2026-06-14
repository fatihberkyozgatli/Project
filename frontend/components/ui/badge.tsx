import { cn } from "@/lib/utils";

type Variant =
  | "charity"
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "error"
  | "coral";

const variants: Record<Variant, string> = {
  charity: "bg-charity-subtle text-charity-text",
  neutral: "bg-sand-100 text-sand-700",
  brand: "bg-brand-subtle text-brand",
  success: "bg-success-subtle text-success-text",
  warning: "bg-warning-subtle text-warning-text",
  error: "bg-error-subtle text-error-text",
  coral: "bg-coral-subtle text-coral-text",
};

interface BadgeProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = "neutral", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
