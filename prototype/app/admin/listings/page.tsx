import { Badge } from "@/components/ui/badge";
import { ResolveActions } from "@/components/resolve-actions";
import { listingStatus } from "@/lib/status";
import { formatCents } from "@/lib/utils";
import { getNonprofit, getUser, listings } from "@/lib/mock";

export default function AdminListingsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold">Listings</h1>
      <p className="mt-1 text-sand-500">
        Review reported or suspicious listings and take them down if needed.
      </p>

      <div className="mt-6 overflow-hidden rounded-lg border border-sand-200 bg-white">
        <div className="hidden grid-cols-[1fr_140px_120px_220px] gap-4 border-b border-sand-200 bg-sand-50 px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-sand-500 lg:grid">
          <span>Listing</span>
          <span>Nonprofit</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {listings.map((l) => {
          const seller = getUser(l.sellerId)!;
          const nonprofit = getNonprofit(l.nonprofitId)!;
          const status = listingStatus[l.status];
          return (
            <div
              key={l.id}
              className="grid gap-4 border-b border-sand-100 px-5 py-4 last:border-0 lg:grid-cols-[1fr_140px_120px_220px] lg:items-center"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 shrink-0 rounded-md"
                  style={{ background: l.imageColor }}
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{l.title}</p>
                  <p className="tabular text-[12px] text-sand-500">
                    {formatCents(l.priceCents)} · {seller.name}
                  </p>
                </div>
              </div>
              <span className="truncate text-[13px] text-sand-600">
                {nonprofit.name}
              </span>
              <span>
                <Badge variant={status.variant}>{status.label}</Badge>
              </span>
              <ResolveActions
                actions={[
                  { label: "Dismiss", resolvedLabel: "Dismissed" },
                  { label: "Take down", tone: "danger", resolvedLabel: "Removed" },
                ]}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
