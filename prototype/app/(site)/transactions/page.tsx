import Link from "next/link";
import { ArrowRight, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCents, timeAgo } from "@/lib/utils";
import { transactionStatus } from "@/lib/status";
import {
  currentUser,
  getListing,
  getNonprofit,
  getUser,
  transactions,
} from "@/lib/mock";

export default function TransactionsPage() {
  const mine = transactions.filter(
    (t) => t.buyerId === currentUser.id || t.sellerId === currentUser.id,
  );

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-3xl font-extrabold">Transactions</h1>
      <p className="mt-1 text-sand-600">
        Track payments, confirmations, and the donations you&apos;ve made.
      </p>

      {mine.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-sand-300 py-16 text-center">
          <Receipt className="mx-auto h-10 w-10 text-sand-400" aria-hidden="true" />
          <p className="mt-3 font-display text-lg font-bold">
            No transactions yet
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {mine.map((t) => {
            const listing = getListing(t.listingId)!;
            const nonprofit = getNonprofit(t.nonprofitId)!;
            const role = t.buyerId === currentUser.id ? "Buying" : "Selling";
            const counterpart = getUser(
              t.buyerId === currentUser.id ? t.sellerId : t.buyerId,
            )!;
            const meta = transactionStatus[t.status];
            return (
              <Link
                key={t.id}
                href={`/transactions/${t.id}`}
                className="flex items-center gap-4 rounded-lg border border-sand-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div
                  className="h-14 w-14 shrink-0 rounded-md"
                  style={{ background: listing.imageColor }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-sand-400">
                      {role}
                    </span>
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                  </div>
                  <p className="mt-1 truncate font-semibold text-ink">
                    {listing.title}
                  </p>
                  <p className="truncate text-[13px] text-sand-500">
                    with {counterpart.name} · {nonprofit.name} ·{" "}
                    {timeAgo(t.createdAt)}
                  </p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="tabular font-display text-lg font-extrabold text-brand">
                    {formatCents(t.amountCents)}
                  </p>
                </div>
                <ArrowRight
                  className="h-5 w-5 shrink-0 text-sand-400"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
