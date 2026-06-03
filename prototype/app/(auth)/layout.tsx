import Link from "next/link";
import { HandHeart, Quote } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-white lg:flex">
        <div className="grain absolute inset-0 opacity-30" />
        <Link href="/" className="relative flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand">
            <HandHeart className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-display text-sm font-extrabold leading-tight">
            Marketplace
            <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-charity">
              for Non-Profits
            </span>
          </span>
        </Link>
        <div className="relative max-w-md">
          <Quote className="h-8 w-8 text-coral" aria-hidden="true" />
          <p className="mt-4 font-display text-3xl font-extrabold leading-tight">
            Declutter with purpose. Your unwanted things become real donations
            to causes you care about.
          </p>
          <p className="mt-6 text-sm text-white/60">
            Every sale becomes a donation.
          </p>
        </div>
        <div className="relative text-[13px] text-white/50">
          A commercial platform. Not a nonprofit.
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
