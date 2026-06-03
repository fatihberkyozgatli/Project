import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Heart,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImpactBanner } from "@/components/impact-banner";
import { ListingCard } from "@/components/listing-card";
import { NonprofitCard } from "@/components/nonprofit-card";
import { CategoryChips } from "@/components/category-chips";
import { listings, nonprofits, platformStats } from "@/lib/mock";
import { formatCents } from "@/lib/utils";

const heroTrust = [
  "Funds protected until meetup",
  "Verified nonprofits",
  "No seller fees",
];

const steps = [
  {
    icon: Tag,
    title: "List with a cause",
    body: "Post an item in minutes and pick the nonprofit your sale will support.",
  },
  {
    icon: ShieldCheck,
    title: "Sell safely",
    body: "Payment is held securely until both sides confirm the meetup with a code.",
  },
  {
    icon: Heart,
    title: "Every sale gives",
    body: "On completion, the proceeds are donated to the nonprofit you chose.",
  },
];

const whyNot = [
  {
    icon: ShieldCheck,
    title: "Funds protected until meetup",
    body: "Your money is held safely and only released when both of you confirm.",
  },
  {
    icon: BadgeCheck,
    title: "Verified nonprofits",
    body: "Every organization is checked against the IRS database before it can receive a cent.",
  },
  {
    icon: RefreshCcw,
    title: "No seller fees",
    body: "Sellers keep nothing and pay nothing — 100% goes to the cause.",
  },
  {
    icon: Heart,
    title: "Every purchase creates impact",
    body: "You're not just buying secondhand — you're funding a real local cause.",
  },
];

export default function HomePage() {
  const featured = listings.filter((l) => l.status === "active").slice(0, 4);
  const featuredNonprofits = [...nonprofits]
    .filter((n) => n.verification === "approved")
    .sort((a, b) => Number(b.sponsored) - Number(a.sponsored))
    .slice(0, 3);

  return (
    <div>
      {/* Mobile-specific hero */}
      <section className="bg-ambient lg:hidden">
        <div className="container-page animate-fade-up py-7">
          <Badge variant="charity">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Buy &amp; sell for a cause
          </Badge>
          <h1 className="mt-3 text-balance font-display text-[2rem] font-extrabold leading-[1.08] text-ink">
            Every sale becomes a <span className="text-brand">donation.</span>
          </h1>
          <p className="mt-2 text-pretty text-[15px] text-sand-600">
            Your unwanted things turn into real money for the causes you care
            about.
          </p>

          <Link
            href="/browse"
            className="mt-5 flex h-12 w-full items-center gap-3 rounded-full border border-sand-200 bg-white px-4 text-sand-400 shadow-sm active:scale-[.99]"
          >
            <Search className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="truncate text-[15px]">Search listings…</span>
          </Link>

          <div className="mt-4">
            <CategoryChips />
          </div>

          <div className="mt-4 flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-coral to-[#E8825F] p-4 text-white shadow-coral">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/80">
                This month
              </p>
              <p className="tabular font-display text-2xl font-extrabold leading-none">
                {formatCents(platformStats.donatedCents)} donated
              </p>
            </div>
            <span className="tabular ml-auto shrink-0 text-right text-[12px] leading-snug text-white/90">
              {platformStats.transactions} deals
              <br />
              {platformStats.nonprofits} nonprofits
            </span>
          </div>

          <ul className="mt-4 grid grid-cols-1 gap-1.5">
            {heroTrust.map((t) => (
              <li
                key={t}
                className="flex items-center gap-2 text-[13px] font-semibold text-sand-700"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-charity-subtle text-charity-text">
                  <Check className="h-2.5 w-2.5" aria-hidden="true" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Desktop hero */}
      <section className="hidden bg-ambient lg:block">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2">
          <div className="animate-fade-up">
            <Badge variant="charity">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Buy &amp; sell for a cause
            </Badge>
            <h1 className="mt-5 font-display text-6xl font-extrabold leading-[1.02] text-ink">
              Every sale becomes a{" "}
              <span className="text-brand">donation.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-sand-600">
              A local marketplace where your unwanted things turn into real money
              for the causes you care about — not personal profit.
            </p>

            <Link
              href="/browse"
              className="mt-8 flex h-14 w-full max-w-md items-center gap-3 rounded-full border border-sand-200 bg-white px-5 text-sand-400 shadow-sm transition-all duration-200 hover:border-brand hover:shadow-brand"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
              <span className="text-base">Search bikes, books, furniture…</span>
              <span className="ml-auto flex h-9 items-center rounded-full bg-brand px-4 text-sm font-semibold text-brand-fg">
                Search
              </span>
            </Link>

            <div className="mt-6">
              <CategoryChips />
            </div>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {heroTrust.map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-1.5 text-sm font-semibold text-sand-700"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-charity-subtle text-charity-text">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-fade-up [animation-delay:120ms]">
            <ImpactBanner />
          </div>
        </div>
      </section>

      <section className="border-y border-sand-200 bg-white">
        <div className="container-page py-14">
          <div className="mx-auto max-w-xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand">
              How it works
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold">
              Three steps to give
            </h2>
          </div>
          <div className="relative mt-10 grid gap-6 sm:grid-cols-3">
            <div
              className="absolute left-[16%] right-[16%] top-9 hidden h-0.5 bg-gradient-to-r from-brand/20 via-brand/40 to-brand/20 sm:block"
              aria-hidden="true"
            />
            {steps.map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className="relative animate-fade-up text-center"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-brand-fg shadow-brand">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-coral font-display text-sm font-extrabold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold">{title}</h3>
                <p className="mx-auto mt-1.5 max-w-xs text-sm text-sand-600">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page">
        <section className="py-12">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl font-extrabold">Fresh listings</h2>
            <Link
              href="/browse"
              className="flex items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-brand-hover"
            >
              View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>

        <section className="py-8">
          <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-extrabold leading-tight">
                Why us?
              </h2>
              <p className="mt-2 text-sand-600">
                Same local secondhand deals — but safer, and every sale does good.
              </p>
            </div>
            <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {whyNot.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-charity-subtle text-charity-text">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-ink">{title}</h3>
                    <p className="mt-0.5 text-sm text-sand-600">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl font-extrabold">
              Nonprofits you can support
            </h2>
            <Link
              href="/nonprofits"
              className="flex items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-brand-hover"
            >
              View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredNonprofits.map((n) => (
              <NonprofitCard key={n.id} nonprofit={n} />
            ))}
          </div>
        </section>

        <section className="my-12 overflow-hidden rounded-2xl bg-ink p-8 text-white sm:p-12">
          <div className="relative grid items-center gap-6 sm:grid-cols-2">
            <div
              className="absolute -right-10 -top-16 h-48 w-48 animate-float rounded-full bg-coral/20 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative">
              <Badge variant="coral">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                For nonprofits
              </Badge>
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight">
                A donation stream that runs itself.
              </h2>
              <p className="mt-3 max-w-sm text-white/70">
                Get a passive flow of donations from everyday marketplace
                activity — no fundraising required.
              </p>
            </div>
            <div className="relative flex gap-3 sm:justify-end">
              <Link
                href="/nonprofits/register"
                className={buttonClasses("primary", "lg")}
              >
                Join as a nonprofit
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
