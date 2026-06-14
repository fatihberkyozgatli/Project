import Link from "next/link";
import { BadgeCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCents } from "@/lib/utils";
import type { Nonprofit } from "@/types";

export function NonprofitCard({ nonprofit }: { nonprofit: Nonprofit }) {
  return (
    <Link
      href={`/nonprofits/${nonprofit.id}`}
      className="group flex flex-col rounded-xl border border-sand-200 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-sand-300 hover:shadow-lg"
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md font-display text-base font-bold text-white"
          style={{ backgroundColor: nonprofit.logoColor }}
        >
          {nonprofit.initials}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-display text-base font-bold text-ink">
              {nonprofit.name}
            </h3>
            <BadgeCheck className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
          </div>
          <p className="text-[13px] text-sand-500">
            {nonprofit.city}, {nonprofit.state}
          </p>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 flex-1 text-sm text-sand-600">
        {nonprofit.mission}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="tabular text-sm font-bold text-charity-text">
          {formatCents(nonprofit.raisedCents)} raised
        </span>
        {nonprofit.sponsored && (
          <Badge variant="coral">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Sponsored
          </Badge>
        )}
      </div>
    </Link>
  );
}
