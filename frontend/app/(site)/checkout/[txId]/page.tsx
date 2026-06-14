import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";
import {
  getListing,
  getNonprofit,
  getTransaction,
  nonprofits,
} from "@/lib/mock";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ txId: string }>;
}) {
  const { txId } = await params;

  const tx = getTransaction(txId);
  const listing = tx ? getListing(tx.listingId) : getListing(txId);
  if (!listing) notFound();

  const nonprofit = getNonprofit(listing.nonprofitId)!;
  const amountCents = tx?.amountCents ?? listing.priceCents;
  const splitOptions = nonprofits.filter(
    (n) => n.verification === "approved" && n.id !== nonprofit.id,
  );

  return (
    <div className="container-page py-8">
      <Link
        href={`/listings/${listing.id}`}
        className="text-sm font-semibold text-brand hover:text-brand-hover"
      >
        ← Back to listing
      </Link>
      <h1 className="mt-4 font-display text-3xl font-extrabold">Checkout</h1>
      <div className="mt-6">
        <CheckoutForm
          listing={listing}
          nonprofit={nonprofit}
          amountCents={amountCents}
          forwardId={tx?.id ?? listing.id}
          splitOptions={splitOptions}
        />
      </div>
    </div>
  );
}
