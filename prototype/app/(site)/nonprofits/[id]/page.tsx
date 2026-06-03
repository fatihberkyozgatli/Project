import { notFound } from "next/navigation";
import Link from "next/link";
import {
  BadgeCheck,
  Globe,
  Heart,
  Package,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { formatCents } from "@/lib/utils";
import { getNonprofit, listings } from "@/lib/mock";

export default async function NonprofitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const nonprofit = getNonprofit(id);
  if (!nonprofit) notFound();

  const supported = listings.filter(
    (l) => l.nonprofitId === nonprofit.id && l.status !== "completed",
  );

  const itemsDonated = Math.round(nonprofit.raisedCents / 1500);
  const avgCents =
    nonprofit.supporters > 0
      ? Math.round(nonprofit.raisedCents / nonprofit.supporters)
      : 0;

  const impact = [
    {
      icon: TrendingUp,
      value: formatCents(nonprofit.raisedCents),
      label: "Raised through sales",
    },
    {
      icon: Users,
      value: `${nonprofit.supporters}`,
      label: "Local supporters",
    },
    {
      icon: Package,
      value: `${itemsDonated}`,
      label: "Items turned into donations",
    },
    {
      icon: Heart,
      value: formatCents(avgCents),
      label: "Average gift per sale",
    },
  ];

  return (
    <div>
      <div
        className="h-40 w-full sm:h-52"
        style={{
          background: `linear-gradient(135deg, ${nonprofit.logoColor}, ${nonprofit.logoColor}bb)`,
        }}
      />
      <div className="container-page">
        <div className="-mt-12 sm:-mt-14">
          <span
            className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-cream font-display text-2xl font-extrabold text-white shadow-md"
            style={{ backgroundColor: nonprofit.logoColor }}
          >
            {nonprofit.initials}
          </span>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h1 className="font-display text-3xl font-extrabold leading-tight">
                  {nonprofit.name}
                </h1>
                <Badge variant="brand">
                  <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                  Verified
                </Badge>
                {nonprofit.sponsored && (
                  <Badge variant="coral">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    Sponsored
                  </Badge>
                )}
              </div>
              <p className="mt-2 max-w-xl text-sand-600">{nonprofit.mission}</p>
            </div>
            <Link
              href="/browse"
              className={buttonClasses("primary", "md", "shrink-0")}
            >
              <Heart className="h-4 w-4" aria-hidden="true" />
              Support by shopping
            </Link>
          </div>
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm">
          <div className="border-b border-sand-100 bg-charity-subtle px-5 py-3">
            <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-charity-text">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Impact so far
            </h2>
          </div>
          <div className="grid divide-sand-100 sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
            {impact.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="border-b border-sand-100 p-5 last:border-b-0 sm:[&:nth-child(3)]:border-b-0 sm:[&:nth-child(4)]:border-b-0 lg:border-b-0"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-charity-subtle text-charity-text">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="tabular mt-3 font-display text-2xl font-extrabold text-ink">
                  {value}
                </p>
                <p className="text-[13px] text-sand-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-8 pb-4 lg:grid-cols-[1fr_300px]">
          <div>
            <h2 className="font-display text-xl font-extrabold">About</h2>
            <p className="mt-2 text-sand-700">{nonprofit.about}</p>

            <h2 className="mt-10 font-display text-xl font-extrabold">
              Items supporting {nonprofit.name}
            </h2>
            {supported.length > 0 ? (
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {supported.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sand-500">
                No active listings supporting this nonprofit yet.
              </p>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-sand-200 bg-white p-5 shadow-sm">
              <p className="tabular font-display text-3xl font-extrabold text-charity-text">
                {formatCents(nonprofit.raisedCents)}
              </p>
              <p className="text-[13px] text-sand-500">raised through sales</p>
              <div className="mt-4 flex items-center gap-2 border-t border-sand-200 pt-4 text-sm text-sand-600">
                <Users className="h-4 w-4" aria-hidden="true" />
                {nonprofit.supporters} supporters
              </div>
              <a
                href={`https://${nonprofit.website}`}
                className="mt-2 flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-hover"
              >
                <Globe className="h-4 w-4" aria-hidden="true" />
                {nonprofit.website}
              </a>
            </div>
            <div className="rounded-2xl bg-ink p-5 text-white">
              <p className="font-display font-bold">Want more visibility?</p>
              <p className="mt-1 text-sm text-white/70">
                Sponsor a placement to reach more local givers.
              </p>
              <Link
                href="/nonprofits/sponsor"
                className={buttonClasses("primary", "sm", "mt-4")}
              >
                Explore sponsorships
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
