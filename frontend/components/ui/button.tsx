import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200 ease-out active:scale-[.97] disabled:cursor-not-allowed disabled:bg-sand-200 disabled:text-sand-400 disabled:shadow-none disabled:active:scale-100 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-brand-fg shadow-sm hover:bg-brand-hover hover:shadow-brand active:bg-brand-pressed",
  secondary:
    "bg-white text-ink border border-sand-300 hover:bg-sand-50 hover:border-sand-400 active:bg-sand-100",
  ghost: "bg-transparent text-brand hover:bg-brand-subtle",
  destructive:
    "bg-error text-white shadow-sm hover:bg-[#B91C1C] active:bg-[#991B1B]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-[17px]",
};

export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return <button className={buttonClasses(variant, size, className)} {...props} />;
}
