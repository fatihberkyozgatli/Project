import { notFound } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, MapPin, ShieldCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { buttonClasses } from "@/components/ui/button";
import { ListingThumb } from "@/components/listing-card";
import { InterestButton } from "@/components/interest-button";
import { ReportButton } from "@/components/report-button";
import { formatCents } from "@/lib/utils";
import { CATEGORY_LABELS, CONDITION_LABELS } from "@/types";
import { currentUser, getListing, getNonprofit, getUser, chats } from "@/lib/mock";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) notFound();

  const seller = getUser(listing.sellerId)!;
  const nonprofit = getNonprofit(listing.nonprofitId)!;
  const isOwner = seller.id === currentUser.id;
  const existingChat = chats.find(
    (c) => c.listingId === listing.id && c.buyerId === currentUser.id,
  );

  return (
    <div className="container-page pt-8 pb-28 md:pb-8">
      <Link
        href="/browse"
        className="text-sm font-semibold text-brand hover:text-brand-hover"
      >
        ← Back to browse
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <ListingThumb
            listing={listing}
            className="aspect-[4/3] rounded-2xl"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          <div className="mt-3 grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <ListingThumb
                key={i}
                listing={listing}
                seed={`${listing.id}-${i}`}
                className="aspect-square rounded-lg"
                sizes="140px"
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral">{CATEGORY_LABELS[listing.category]}</Badge>
            <Badge variant="neutral">
              {CONDITION_LABELS[listing.condition]}
            </Badge>
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight">
            {listing.title}
          </h1>
          <p className="tabular mt-2 font-display text-4xl font-extrabold text-brand">
            {formatCents(listing.priceCents)}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-sand-500">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {listing.pickupArea}, {listing.city}
          </p>

          <Link
            href={`/nonprofits/${nonprofit.id}`}
            className="mt-5 flex items-center gap-3 rounded-lg bg-charity-subtle p-4 transition-opacity hover:opacity-90"
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-md font-display text-sm font-bold text-white"
              style={{ backgroundColor: nonprofit.logoColor }}
            >
              {nonprofit.initials}
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-charity-text">
                Proceeds donated to
              </p>
              <p className="flex items-center gap-1 font-display font-bold text-ink">
                {nonprofit.name}
                <BadgeCheck className="h-4 w-4 text-brand" aria-hidden="true" />
              </p>
            </div>
          </Link>

          <div className="mt-6 flex gap-3 max-md:fixed max-md:inset-x-0 max-md:bottom-16 max-md:z-30 max-md:border-t max-md:border-sand-200 max-md:bg-cream/95 max-md:px-4 max-md:py-3 max-md:backdrop-blur">
            {isOwner ? (
              <Link
                href={`/listings/${listing.id}/edit`}
                className={buttonClasses("primary", "lg", "flex-1")}
              >
                Edit listing
              </Link>
            ) : (
              <InterestButton
                listingId={listing.id}
                existingChatId={existingChat?.id}
              />
            )}
            <ReportButton target="listing" label={listing.title} />
          </div>

          <p className="mt-4 flex items-start gap-2 rounded-md bg-sand-50 p-3 text-[13px] text-sand-600">
            <ShieldCheck
              className="mt-0.5 h-4 w-4 shrink-0 text-brand"
              aria-hidden="true"
            />
            Payment is held securely and only released once both of you confirm
            the meetup with a code. Meet in a public place.
          </p>

          <div className="mt-6">
            <h2 className="font-display text-lg font-bold">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sand-700">
              {listing.description}
            </p>
          </div>

          <div className="mt-6 border-t border-sand-200 pt-6">
            <Link
              href={`/profile/${seller.id}`}
              className="flex items-center gap-3"
            >
              <Avatar initials={seller.initials} color={seller.avatarColor} />
              <div>
                <p className="flex items-center gap-1 font-semibold text-ink">
                  {seller.name}
                  {seller.verifiedPhone && (
                    <BadgeCheck
                      className="h-4 w-4 text-brand"
                      aria-hidden="true"
                    />
                  )}
                </p>
                <p className="flex items-center gap-2 text-[13px] text-sand-500">
                  <span className="flex items-center gap-0.5">
                    <Star
                      className="h-3.5 w-3.5 fill-warning text-warning"
                      aria-hidden="true"
                    />
                    {seller.rating}
                  </span>
                  · {seller.completedTransactions} donations
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
