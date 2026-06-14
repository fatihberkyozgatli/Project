"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { nonprofits } from "@/lib/mock";

const categories = [
  "education",
  "environment",
  "health",
  "animals",
  "community",
  "arts",
];

export default function NonprofitSettingsPage() {
  const org = nonprofits[0];
  const [saved, setSaved] = useState(false);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Edit profile</h1>
          <p className="mt-1 text-sand-600">
            This is what supporters see on your public page.
          </p>
        </div>
        <Link
          href={`/nonprofits/${org.id}`}
          className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-hover"
        >
          View public page
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <Card className="mt-6 rounded-2xl p-6">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
          }}
        >
          <div className="flex items-center gap-4">
            <span
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-display text-xl font-extrabold text-white"
              style={{ backgroundColor: org.logoColor }}
            >
              {org.initials}
            </span>
            <Button type="button" variant="secondary" size="sm">
              Change logo
            </Button>
          </div>

          <Field label="Organization name" required>
            <Input defaultValue={org.name} />
          </Field>

          <Field label="Mission" hint="One short line shown under your name." required>
            <Input defaultValue={org.mission} />
          </Field>

          <Field label="About" hint="Tell supporters what you do.">
            <Textarea defaultValue={org.about} className="min-h-32" />
          </Field>

          <Field
            label="Impact statement"
            hint="A sentence about the difference donations make."
          >
            <Textarea
              defaultValue={`Every $15 raised here funds one local build day with ${org.name}.`}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Website" required>
              <Input defaultValue={org.website} />
            </Field>
            <Field label="Category" required>
              <Select defaultValue={org.category}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c[0].toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City" required>
              <Input defaultValue={org.city} />
            </Field>
            <Field label="State" required>
              <Input defaultValue={org.state} />
            </Field>
          </div>

          <div className="flex items-center gap-3 border-t border-sand-200 pt-5">
            <Button type="submit">Save changes</Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-charity-text">
                <Check className="h-4 w-4" aria-hidden="true" />
                Saved
              </span>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
