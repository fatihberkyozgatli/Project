import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ResolveActions } from "@/components/resolve-actions";
import { transactionStatus } from "@/lib/status";
import { formatCents, timeAgo } from "@/lib/utils";
import { getListing, getNonprofit, getUser, transactions } from "@/lib/mock";

export default function AdminTransactionsPage() {
  const disputes = transactions.filter((t) => t.status === "disputed");
  const others = transactions.filter((t) => t.status !== "disputed");

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold">Transactions</h1>
      <p className="mt-1 text-sand-500">
        Monitor all transactions. Disputes hold funds until you resolve them.
      </p>

      {disputes.length > 0 && (
        <>
          <h2 className="mt-8 flex items-center gap-2 font-display text-lg font-bold text-error-text">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            Active disputes ({disputes.length})
          </h2>
          <div className="mt-4 space-y-3">
            {disputes.map((t) => {
              const listing = getListing(t.listingId)!;
              const buyer = getUser(t.buyerId)!;
              const seller = getUser(t.sellerId)!;
              return (
                <div
                  key={t.id}
                  className="rounded-lg border border-error/30 bg-error-subtle p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-ink">{listing.title}</p>
                    <span className="tabular font-display text-lg font-extrabold text-ink">
                      {formatCents(t.amountCents)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-sand-600">
                    {buyer.name} (buyer) vs {seller.name} (seller) ·{" "}
                    {timeAgo(t.createdAt)}
                  </p>
                  <div className="mt-4">
                    <ResolveActions
                      actions={[
                        {
                          label: "Refund buyer",
                          tone: "primary",
                          resolvedLabel: "Refunded buyer",
                        },
                        {
                          label: "Release to nonprofit",
                          resolvedLabel: "Released funds",
                        },
                      ]}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <h2 className="mt-10 font-display text-lg font-bold">All transactions</h2>
      <div className="mt-4 overflow-hidden rounded-lg border border-sand-200 bg-white">
        {others.map((t) => {
          const listing = getListing(t.listingId)!;
          const nonprofit = getNonprofit(t.nonprofitId)!;
          const status = transactionStatus[t.status];
          return (
            <div
              key={t.id}
              className="flex items-center justify-between gap-3 border-b border-sand-100 p-4 last:border-0"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">
                  {listing.title}
                </p>
                <p className="truncate text-[12px] text-sand-500">
                  {nonprofit.name} · {timeAgo(t.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Badge variant={status.variant}>{status.label}</Badge>
                <span className="tabular hidden font-display font-bold text-ink sm:block">
                  {formatCents(t.amountCents)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
