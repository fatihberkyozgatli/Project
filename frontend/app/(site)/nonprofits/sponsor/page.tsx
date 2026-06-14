"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, CreditCard, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { cn, formatCents } from "@/lib/utils";

const tiers = [
  {
    id: "spotlight",
    name: "Local Spotlight",
    priceCents: 4900,
    blurb: "Featured at the top of browse results in your city.",
    perks: ["City-level placement", "Spotlight badge", "Monthly impact report"],
  },
  {
    id: "category",
    name: "Category Sponsorship",
    priceCents: 9900,
    blurb: "Own a category — “Sponsored by you in Books & Education.”",
    perks: [
      "Everything in Local Spotlight",
      "Category-wide placement",
      "Logo on category pages",
    ],
    popular: true,
  },
  {
    id: "homepage",
    name: "Homepage Feature",
    priceCents: 19900,
    blurb: "Front-and-center placement on the homepage.",
    perks: [
      "Everything in Category",
      "Homepage hero placement",
      "Priority in search",
    ],
  },
];

export default function SponsorPage() {
  const [selected, setSelected] = useState("category");
  const [stage, setStage] = useState<"choose" | "pay" | "done">("choose");
  const [processing, setProcessing] = useState(false);
  const tier = tiers.find((t) => t.id === selected)!;

  if (stage === "done") {
    return (
      <div className="container-page flex max-w-lg flex-col items-center py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-coral-subtle text-coral-text">
          <Sparkles className="h-8 w-8" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-extrabold">
          You&apos;re now sponsored
        </h1>
        <p className="mt-2 text-sand-600">
          Your {tier.name} placement is live. Expect more supporters within
          days.
        </p>
        <Link href="/nonprofits/dashboard" className="mt-6 inline-flex">
          <Button>Go to dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <Link
        href="/nonprofits/dashboard"
        className="text-sm font-semibold text-brand hover:text-brand-hover"
      >
        ← Back to dashboard
      </Link>
      <h1 className="mt-4 font-display text-3xl font-extrabold">
        Sponsorships
      </h1>
      <p className="mt-1 max-w-xl text-sand-600">
        Boost your visibility and reach more local givers. Cancel anytime.
      </p>

      {stage === "choose" && (
        <>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {tiers.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelected(t.id)}
                className={cn(
                  "relative flex flex-col rounded-lg border-2 p-6 text-left transition-colors",
                  selected === t.id
                    ? "border-brand bg-brand-subtle"
                    : "border-sand-200 bg-white hover:border-sand-300",
                )}
              >
                {t.popular && (
                  <span className="absolute -top-3 left-6 rounded-full bg-coral px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    Most popular
                  </span>
                )}
                <h2 className="font-display text-lg font-extrabold">{t.name}</h2>
                <p className="tabular mt-2 font-display text-3xl font-extrabold text-brand">
                  {formatCents(t.priceCents)}
                  <span className="text-sm font-semibold text-sand-500">
                    {" "}
                    / mo
                  </span>
                </p>
                <p className="mt-2 text-sm text-sand-600">{t.blurb}</p>
                <ul className="mt-4 space-y-2">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-charity"
                        aria-hidden="true"
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button size="lg" onClick={() => setStage("pay")}>
              Continue with {tier.name}
            </Button>
          </div>
        </>
      )}

      {stage === "pay" && (
        <div className="mt-8 grid max-w-3xl gap-8 lg:grid-cols-[1fr_300px]">
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setProcessing(true);
              setTimeout(() => setStage("done"), 900);
            }}
          >
            <Field label="Card number">
              <div className="relative">
                <CreditCard
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-400"
                  aria-hidden="true"
                />
                <Input
                  required
                  className="pl-9"
                  defaultValue="4242 4242 4242 4242"
                />
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiry">
                <Input required defaultValue="04 / 28" />
              </Field>
              <Field label="CVC">
                <Input required defaultValue="123" />
              </Field>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={processing}>
              <Lock className="h-4 w-4" aria-hidden="true" />
              {processing
                ? "Processing…"
                : `Subscribe — ${formatCents(tier.priceCents)}/mo`}
            </Button>
          </form>
          <aside className="rounded-lg border border-sand-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-base font-bold">{tier.name}</h2>
            <p className="tabular mt-2 font-display text-2xl font-extrabold text-brand">
              {formatCents(tier.priceCents)}
              <span className="text-sm font-semibold text-sand-500"> / mo</span>
            </p>
            <button
              type="button"
              onClick={() => setStage("choose")}
              className="mt-4 text-sm font-semibold text-brand"
            >
              Change plan
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
