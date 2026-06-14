import { notFound } from "next/navigation";
import Link from "next/link";
import { TransactionDetail } from "@/components/transaction-detail";
import {
  currentUser,
  getListing,
  getNonprofit,
  getTransaction,
  getUser,
} from "@/lib/mock";

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

export default async function TransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tx = getTransaction(id);
  const listing = tx ? getListing(tx.listingId) : getListing(id);
  if (!listing) notFound();

  const nonprofit = getNonprofit(listing.nonprofitId)!;

  const viewerRole: "buyer" | "seller" =
    tx && tx.sellerId === currentUser.id ? "seller" : "buyer";

  const otherId = tx
    ? viewerRole === "buyer"
      ? tx.sellerId
      : tx.buyerId
    : listing.sellerId;
  const other = getUser(otherId)!;

  const buyerCode = tx?.buyerCode ?? randomCode();
  const sellerCode = tx?.sellerCode ?? randomCode();
  const yourCode = viewerRole === "buyer" ? buyerCode : sellerCode;
  const theirCode = viewerRole === "buyer" ? sellerCode : buyerCode;

  const initialStatus =
    tx?.status === "completed"
      ? "completed"
      : tx?.status === "cancelled"
        ? "cancelled"
        : tx?.status === "disputed"
          ? "disputed"
          : "active";

  return (
    <div className="container-page py-8">
      <Link
        href="/transactions"
        className="text-sm font-semibold text-brand hover:text-brand-hover"
      >
        ← All transactions
      </Link>
      <h1 className="mt-4 font-display text-3xl font-extrabold">
        Confirm the meetup
      </h1>
      <p className="mt-1 max-w-xl text-sand-600">
        Meet in person and exchange the item. Share your code with{" "}
        {viewerRole === "buyer" ? "the seller" : "the buyer"} and enter theirs to
        release the donation.
      </p>
      <div className="mt-6">
        <TransactionDetail
          viewerRole={viewerRole}
          listingTitle={listing.title}
          imageColor={listing.imageColor}
          nonprofitName={nonprofit.name}
          nonprofitInitials={nonprofit.initials}
          nonprofitColor={nonprofit.logoColor}
          otherName={other.name}
          amountCents={tx?.amountCents ?? listing.priceCents}
          yourCode={yourCode}
          theirCode={theirCode}
          initiallyCompleted={initialStatus === "completed"}
          initialStatus={initialStatus}
        />
      </div>
    </div>
  );
}
