import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatCents } from "@/lib/utils";
import { CONDITION_LABELS, type Listing } from "@/types";
import { getNonprofit } from "@/lib/mock";

export function ListingThumb({
  listing,
  className,
  seed,
  sizes = "(max-width: 768px) 50vw, 25vw",
}: {
  listing: Listing;
  className?: string;
  seed?: string;
  sizes?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-sand-100", className)}>
      <Image
        src={`https://picsum.photos/seed/${seed ?? listing.id}/800/600`}
        alt={listing.title}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

export function ListingCard({
  listing,
  distanceMiles,
}: {
  listing: Listing;
  distanceMiles?: number;
}) {
  const nonprofit = getNonprofit(listing.nonprofitId);
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-sand-200 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-sand-300 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ListingThumb
          listing={listing}
          className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span className="absolute right-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-ink shadow-sm backdrop-blur tabular">
          {formatCents(listing.priceCents)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-bold leading-snug text-ink">
          {listing.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-[13px] text-sand-500">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {listing.pickupArea}
          {distanceMiles !== undefined
            ? ` · ${distanceMiles} mi`
            : ` · ${CONDITION_LABELS[listing.condition]}`}
        </p>
        {nonprofit && (
          <div className="mt-3">
            <Badge variant="charity">Donates to {nonprofit.name}</Badge>
          </div>
        )}
      </div>
    </Link>
  );
}
