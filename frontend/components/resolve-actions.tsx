"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Action = {
  label: string;
  tone?: "primary" | "neutral" | "danger";
  resolvedLabel?: string;
};

export function ResolveActions({ actions }: { actions: Action[] }) {
  const [resolved, setResolved] = useState<string | null>(null);

  if (resolved) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-charity-text">
        <Check className="h-4 w-4" aria-hidden="true" />
        {resolved}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((a) => (
        <button
          key={a.label}
          type="button"
          onClick={() => setResolved(a.resolvedLabel ?? a.label + "ed")}
          className={cn(
            "rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors",
            a.tone === "primary" &&
              "bg-brand text-brand-fg hover:bg-brand-hover",
            a.tone === "danger" &&
              "bg-error-subtle text-error-text hover:bg-error/20",
            (!a.tone || a.tone === "neutral") &&
              "border border-sand-300 text-ink hover:bg-sand-50",
          )}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
