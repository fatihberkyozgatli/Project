"use client";

import { useMemo, useState } from "react";
import { MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ListingCard } from "@/components/listing-card";
import { listings } from "@/lib/mock";
import {
  CATEGORY_LABELS,
  CONDITION_LABELS,
  type Category,
  type Condition,
} from "@/types";

const cities = ["All cities", "Dallas, TX", "Plano, TX", "Irving, TX"];
const radii = [
  { value: 0, label: "Any distance" },
  { value: 2, label: "Within 2 mi" },
  { value: 5, label: "Within 5 mi" },
  { value: 10, label: "Within 10 mi" },
  { value: 25, label: "Within 25 mi" },
];

function milesFor(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 100000;
  return Math.round((0.4 + (h % 240) / 10) * 10) / 10;
}

export default function BrowsePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [condition, setCondition] = useState<Condition | "all">("all");
  const [city, setCity] = useState("All cities");
  const [radius, setRadius] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    return listings
      .filter((l) => l.status !== "cancelled" && l.status !== "completed")
      .filter((l) =>
        query
          ? (l.title + l.description)
              .toLowerCase()
              .includes(query.toLowerCase())
          : true,
      )
      .filter((l) => (category === "all" ? true : l.category === category))
      .filter((l) => (condition === "all" ? true : l.condition === condition))
      .filter((l) => (city === "All cities" ? true : l.city === city))
      .filter((l) => (radius === 0 ? true : milesFor(l.id) <= radius))
      .sort((a, b) =>
        radius === 0 ? 0 : milesFor(a.id) - milesFor(b.id),
      );
  }, [query, category, condition, city, radius]);

  const activeFilters =
    (category !== "all" ? 1 : 0) +
    (condition !== "all" ? 1 : 0) +
    (city !== "All cities" ? 1 : 0) +
    (radius !== 0 ? 1 : 0);

  const clear = () => {
    setCategory("all");
    setCondition("all");
    setCity("All cities");
    setRadius(0);
  };

  return (
    <div className="container-page py-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-extrabold">Browse</h1>
        <p className="text-sand-600">
          Every item supports a verified nonprofit.
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-400"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search listings…"
            className="pl-9"
            aria-label="Search listings"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className="flex h-10 items-center gap-2 rounded-md border border-sand-300 bg-white px-3 text-sm font-semibold text-ink hover:bg-sand-50 lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
          {activeFilters > 0 && <Badge variant="brand">{activeFilters}</Badge>}
        </button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside
          className={`${showFilters ? "block" : "hidden"} space-y-5 lg:block`}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold">Filters</h2>
            {activeFilters > 0 && (
              <button
                type="button"
                onClick={clear}
                className="flex items-center gap-1 text-[13px] font-semibold text-brand"
              >
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
          </div>
          <FilterGroup label="Category">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category | "all")}
              aria-label="Category"
            >
              <option value="all">All categories</option>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
          </FilterGroup>
          <FilterGroup label="Condition">
            <Select
              value={condition}
              onChange={(e) =>
                setCondition(e.target.value as Condition | "all")
              }
              aria-label="Condition"
            >
              <option value="all">Any condition</option>
              {Object.entries(CONDITION_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
          </FilterGroup>
          <FilterGroup label="City">
            <Select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              aria-label="City"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </FilterGroup>
          <FilterGroup label="Distance">
            <Select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              aria-label="Distance"
            >
              {radii.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </Select>
            <p className="flex items-center gap-1 text-[12px] text-sand-400">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              Near Dallas, TX
            </p>
          </FilterGroup>
        </aside>

        <div>
          <p className="mb-4 text-sm text-sand-500">
            {results.length} {results.length === 1 ? "item" : "items"}
          </p>
          {results.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  distanceMiles={radius === 0 ? undefined : milesFor(listing.id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-sand-300 py-16 text-center">
              <p className="font-display text-lg font-bold">No items found</p>
              <p className="mt-1 text-sm text-sand-500">
                Try clearing some filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-sand-600">
        {label}
      </span>
      {children}
    </div>
  );
}
