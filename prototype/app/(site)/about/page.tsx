import Link from "next/link";
import { Heart, Leaf, ShieldCheck, Users } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { ImpactBanner } from "@/components/impact-banner";

const values = [
  {
    icon: Heart,
    title: "Mission over margin",
    body: "Sellers don't profit — every sale becomes a donation to a cause they choose.",
  },
  {
    icon: ShieldCheck,
    title: "Trust first",
    body: "Held payments, dual confirmation codes, and verified nonprofits keep everyone safe.",
  },
  {
    icon: Leaf,
    title: "Good for the planet",
    body: "Reuse over landfill. Secondhand goods find a second life and fund real impact.",
  },
  {
    icon: Users,
    title: "Local community",
    body: "Built for neighborhoods — meet locally, give locally, grow together.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
          About us
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
          Turning everyday clutter into{" "}
          <span className="text-brand">real giving.</span>
        </h1>
        <p className="mt-4 text-lg text-sand-600">
          Marketplace for Non-Profits is a peer-to-peer marketplace where people
          exchange secondhand goods — not for personal profit, but to support the
          causes they care about. Every completed sale becomes a donation.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl">
        <ImpactBanner />
      </div>

      <div className="mx-auto mt-14 max-w-4xl">
        <h2 className="text-center font-display text-2xl font-extrabold">
          What we stand for
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {values.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-sand-200 bg-white p-6 shadow-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-subtle text-brand">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
              <p className="mt-1.5 text-sm text-sand-600">{body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-3xl rounded-2xl bg-ink p-8 text-center text-white sm:p-12">
        <h2 className="font-display text-2xl font-extrabold">
          Built in Dallas, for everywhere next.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-white/70">
          We&apos;re a small, mission-driven team. We&apos;re not a nonprofit —
          we&apos;re a commercial platform that makes giving effortless.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/browse" className={buttonClasses("primary", "lg")}>
            Start browsing
          </Link>
          <Link href="/contact" className={buttonClasses("secondary", "lg")}>
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
