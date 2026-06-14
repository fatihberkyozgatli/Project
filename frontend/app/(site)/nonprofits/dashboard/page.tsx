import Link from "next/link";
import { ArrowUpRight, Sparkles, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { formatCents } from "@/lib/utils";
import { nonprofits } from "@/lib/mock";

const months = [
  { label: "Jan", cents: 18000 },
  { label: "Feb", cents: 24500 },
  { label: "Mar", cents: 31000 },
  { label: "Apr", cents: 42000 },
  { label: "May", cents: 58000 },
  { label: "Jun", cents: 74000 },
];

const recent = [
  { item: "Vintage Schwinn Road Bike", from: "Maya Chen", cents: 12000, when: "2h ago" },
  { item: "Box of Classic Novels", from: "Jordan Blake", cents: 4500, when: "1d ago" },
  { item: "Standing Desk (Electric)", from: "Sam Okafor", cents: 26000, when: "2d ago" },
  { item: "Monstera Deliciosa", from: "Alex Rivera", cents: 3500, when: "3d ago" },
];

export default function NonprofitDashboardPage() {
  const org = nonprofits[0];
  const max = Math.max(...months.map((m) => m.cents));

  return (
    <div className="container-page py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-md font-display font-bold text-white"
            style={{ backgroundColor: org.logoColor }}
          >
            {org.initials}
          </span>
          <div>
            <h1 className="font-display text-2xl font-extrabold">{org.name}</h1>
            <p className="text-[13px] text-sand-500">Nonprofit dashboard</p>
          </div>
        </div>
        <Link
          href="/nonprofits/sponsor"
          className={buttonClasses("primary", "md")}
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Boost visibility
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={TrendingUp}
          value={formatCents(org.raisedCents)}
          label="Total raised"
          delta="+28% this month"
        />
        <StatCard
          icon={Users}
          value={`${org.supporters}`}
          label="Supporters"
          delta="+19 this month"
        />
        <StatCard
          icon={ArrowUpRight}
          value="42"
          label="Items donated to you"
          delta="+11 this month"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-sand-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold">Donations over time</h2>
          <div className="mt-6 flex h-48 items-end gap-3">
            {months.map((m) => (
              <div
                key={m.label}
                className="group relative flex-1 rounded-t-md bg-gradient-to-t from-brand to-brand-hover transition-all duration-500 ease-out hover:opacity-90"
                style={{ height: `${Math.max((m.cents / max) * 100, 4)}%` }}
                title={formatCents(m.cents)}
              >
                <span className="tabular absolute -top-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-ink px-1.5 py-0.5 text-[10px] font-semibold text-white group-hover:block">
                  {formatCents(m.cents)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-3">
            {months.map((m) => (
              <span
                key={m.label}
                className="flex-1 text-center text-[11px] font-semibold text-sand-500"
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-sand-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold">Recent donations</h2>
          <ul className="mt-4 divide-y divide-sand-100">
            {recent.map((r) => (
              <li key={r.item} className="flex items-center justify-between py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {r.item}
                  </p>
                  <p className="text-[12px] text-sand-500">
                    from {r.from} · {r.when}
                  </p>
                </div>
                <span className="tabular shrink-0 text-sm font-bold text-charity-text">
                  {formatCents(r.cents)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-ink p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge variant="coral">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Sponsorship
            </Badge>
            <p className="mt-2 font-display text-xl font-extrabold">
              You&apos;re currently {org.sponsored ? "sponsored" : "not sponsored"}
            </p>
            <p className="text-sm text-white/70">
              Sponsored nonprofits get up to 3x more supporters.
            </p>
          </div>
          <Link
            href="/nonprofits/sponsor"
            className={buttonClasses("primary", "md")}
          >
            Manage sponsorship
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  delta,
}: {
  icon: typeof TrendingUp;
  value: string;
  label: string;
  delta: string;
}) {
  return (
    <div className="rounded-lg border border-sand-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-subtle text-brand">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="text-[12px] font-semibold text-charity-text">
          {delta}
        </span>
      </div>
      <p className="tabular mt-4 font-display text-2xl font-extrabold text-ink">
        {value}
      </p>
      <p className="text-[13px] text-sand-500">{label}</p>
    </div>
  );
}
