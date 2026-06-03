import { notFound } from "next/navigation";
import Link from "next/link";
import { EditListingForm } from "@/components/edit-listing-form";
import { getListing, nonprofits } from "@/lib/mock";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) notFound();

  const approved = nonprofits.filter((n) => n.verification === "approved");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href={`/listings/${listing.id}`}
        className="text-sm font-semibold text-brand hover:text-brand-hover"
      >
        ← Back to listing
      </Link>
      <h1 className="mt-4 font-display text-3xl font-extrabold">
        Edit listing
      </h1>
      <div className="mt-6">
        <EditListingForm listing={listing} nonprofits={approved} />
      </div>
    </div>
  );
}
