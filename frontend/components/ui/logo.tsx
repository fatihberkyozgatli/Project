import Link from "next/link";
import { HandHeart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2", className)}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-brand-fg transition-colors group-hover:bg-brand-hover">
        <HandHeart className="h-5 w-5" aria-hidden="true" />
      </span>
      {!compact && (
        <span className="font-display text-[15px] font-extrabold leading-none text-ink">
          Aldofa
          <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
            every sale a donation
          </span>
        </span>
      )}
    </Link>
  );
}
