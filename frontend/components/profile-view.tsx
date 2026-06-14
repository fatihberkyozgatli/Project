import Link from "next/link";
import { BadgeCheck, Mail, MapPin, Phone, Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { formatCents } from "@/lib/utils";
import { listings } from "@/lib/mock";
import type { User } from "@/types";

export function ProfileView({ user, isMe }: { user: User; isMe: boolean }) {
  const theirListings = listings.filter(
    (l) => l.sellerId === user.id && l.status !== "completed",
  );

  return (
    <div className="container-page py-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <Avatar initials={user.initials} color={user.avatarColor} size="lg" />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-3xl font-extrabold">{user.name}</h1>
            <span className="flex items-center gap-0.5 text-sm font-semibold text-sand-600">
              <Star className="h-4 w-4 fill-warning text-warning" aria-hidden="true" />
              {user.rating}
              <span className="font-normal text-sand-400">
                ({user.ratingCount})
              </span>
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-sand-500">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {user.city}
          </p>
          {user.bio && <p className="mt-3 max-w-lg text-sand-700">{user.bio}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            {user.verifiedEmail && (
              <Badge variant="brand">
                <Mail className="h-3 w-3" aria-hidden="true" /> Email verified
              </Badge>
            )}
            {user.verifiedPhone && (
              <Badge variant="brand">
                <Phone className="h-3 w-3" aria-hidden="true" /> Phone verified
              </Badge>
            )}
            <Badge variant="charity">
              <BadgeCheck className="h-3 w-3" aria-hidden="true" />
              {user.completedTransactions} donations
            </Badge>
          </div>
        </div>
        {isMe && (
          <Link href="/settings" className={buttonClasses("secondary", "md")}>
            Edit profile
          </Link>
        )}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat
          value={formatCents(user.donatedCents)}
          label="Total donated"
          accent
        />
        <Stat value={`${user.completedTransactions}`} label="Completed deals" />
        <Stat value={`${user.rating} / 5`} label="Average rating" />
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-extrabold">
          {isMe ? "Your active listings" : `${user.name}'s listings`}
        </h2>
        {theirListings.length > 0 ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {theirListings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sand-500">No active listings.</p>
        )}
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-sand-200 bg-white p-5 shadow-sm">
      <p
        className={`tabular font-display text-2xl font-extrabold ${
          accent ? "text-charity-text" : "text-ink"
        }`}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[13px] text-sand-500">{label}</p>
    </div>
  );
}
