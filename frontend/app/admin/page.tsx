import Link from "next/link";
import {
  Building2,
  DollarSign,
  Flag,
  Receipt,
  ShoppingBag,
  Users,
} from "lucide-react";
import { formatCents } from "@/lib/utils";
import {
  listings,
  nonprofits,
  platformStats,
  reports,
  transactions,
  users,
} from "@/lib/mock";

export default function AdminOverviewPage() {
  const pendingNonprofits = nonprofits.filter(
    (n) => n.verification === "pending",
  ).length;
  const openReports = reports.filter((r) => r.status === "open").length;
  const disputes = transactions.filter((t) => t.status === "disputed").length;

  const queues = [
    {
      href: "/admin/nonprofits",
      label: "Nonprofit approvals",
      count: pendingNonprofits,
      icon: Building2,
      urgent: pendingNonprofits > 0,
    },
    {
      href: "/admin/reports",
      label: "Open reports",
      count: openReports,
      icon: Flag,
      urgent: openReports > 0,
    },
    {
      href: "/admin/transactions",
      label: "Active disputes",
      count: disputes,
      icon: Receipt,
      urgent: disputes > 0,
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold">Overview</h1>
      <p className="mt-1 text-sand-500">Platform health at a glance.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          icon={DollarSign}
          value={formatCents(platformStats.donatedCents)}
          label="Donations facilitated"
        />
        <Metric
          icon={Users}
          value={`${platformStats.members}`}
          label="Members"
        />
        <Metric
          icon={ShoppingBag}
          value={`${listings.length}`}
          label="Active listings"
        />
        <Metric
          icon={Receipt}
          value={`${transactions.length}`}
          label="Transactions"
        />
      </div>

      <h2 className="mt-10 font-display text-lg font-bold">Needs attention</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {queues.map(({ href, label, count, icon: Icon, urgent }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between rounded-lg border border-sand-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-md ${
                  urgent
                    ? "bg-coral-subtle text-coral-text"
                    : "bg-sand-100 text-sand-500"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-ink">{label}</span>
            </div>
            <span
              className={`tabular font-display text-2xl font-extrabold ${
                urgent ? "text-coral-text" : "text-sand-400"
              }`}
            >
              {count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Users;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-sand-200 bg-white p-5 shadow-sm">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-subtle text-brand">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="tabular mt-4 font-display text-2xl font-extrabold text-ink">
        {value}
      </p>
      <p className="text-[13px] text-sand-500">{label}</p>
    </div>
  );
}
