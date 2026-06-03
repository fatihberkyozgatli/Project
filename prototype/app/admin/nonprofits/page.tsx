import { BadgeCheck, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ResolveActions } from "@/components/resolve-actions";
import { nonprofits } from "@/lib/mock";

export default function AdminNonprofitsPage() {
  const pending = nonprofits.filter((n) => n.verification === "pending");
  const approved = nonprofits.filter((n) => n.verification === "approved");

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold">Nonprofits</h1>
      <p className="mt-1 text-sand-500">
        Verify EINs against the IRS database before approval.
      </p>

      <h2 className="mt-8 font-display text-lg font-bold">
        Pending approval ({pending.length})
      </h2>
      <div className="mt-4 space-y-3">
        {pending.map((n) => (
          <div
            key={n.id}
            className="rounded-lg border border-sand-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md font-display font-bold text-white"
                style={{ backgroundColor: n.logoColor }}
              >
                {n.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display font-bold text-ink">{n.name}</p>
                <p className="text-sm text-sand-600">{n.mission}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-sand-500">
                  <span className="tabular">EIN {n.ein}</span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                    {n.website}
                  </span>
                  <span>determination-letter.pdf</span>
                </div>
              </div>
            </div>
            <div className="mt-4 border-t border-sand-100 pt-4">
              <ResolveActions
                actions={[
                  { label: "Approve", tone: "primary", resolvedLabel: "Approved" },
                  { label: "Request more info", resolvedLabel: "Info requested" },
                  { label: "Reject", tone: "danger", resolvedLabel: "Rejected" },
                ]}
              />
            </div>
          </div>
        ))}
        {pending.length === 0 && (
          <p className="text-sand-500">No nonprofits awaiting review.</p>
        )}
      </div>

      <h2 className="mt-10 font-display text-lg font-bold">
        Approved ({approved.length})
      </h2>
      <div className="mt-4 overflow-hidden rounded-lg border border-sand-200 bg-white">
        {approved.map((n) => (
          <div
            key={n.id}
            className="flex items-center justify-between gap-3 border-b border-sand-100 p-4 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-md text-[12px] font-bold text-white"
                style={{ backgroundColor: n.logoColor }}
              >
                {n.initials}
              </span>
              <div>
                <p className="flex items-center gap-1 font-semibold text-ink">
                  {n.name}
                  <BadgeCheck className="h-4 w-4 text-brand" aria-hidden="true" />
                </p>
                <p className="tabular text-[12px] text-sand-500">EIN {n.ein}</p>
              </div>
            </div>
            <Badge variant="success">Verified</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
