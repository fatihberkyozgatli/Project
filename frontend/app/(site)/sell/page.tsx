"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ImagePlus,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TermsCheckbox } from "@/components/terms-checkbox";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  CONDITION_LABELS,
  type Category,
  type Condition,
} from "@/types";
import { nonprofits } from "@/lib/mock";

const stepLabels = ["Details", "Photos", "Pickup", "Nonprofit", "Review"];

export default function SellPage() {
  const [step, setStep] = useState(0);
  const [published, setPublished] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [photos, setPhotos] = useState<string[]>(["#115E59"]);
  const [nonprofitId, setNonprofitId] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<Category>("electronics");
  const [condition, setCondition] = useState<Condition>("good");

  const approved = nonprofits.filter((n) => n.verification === "approved");
  const next = () => setStep((s) => Math.min(s + 1, stepLabels.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const colors = ["#115E59", "#E76F51", "#0F172A", "#15803D", "#E08A1E"];

  if (published) {
    return (
      <div className="container-page flex max-w-lg flex-col items-center py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-charity-subtle text-charity">
          <PartyPopper className="h-8 w-8" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-extrabold">
          Your listing is live
        </h1>
        <p className="mt-2 text-sand-600">
          {title || "Your item"} is now browsable. When it sells, the proceeds
          go straight to your chosen nonprofit.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/browse" className="inline-flex">
            <Button>Go to browse</Button>
          </Link>
          <Link href="/profile" className="inline-flex">
            <Button variant="secondary">View my listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold">Sell an item</h1>

      <ol className="mt-6 flex items-center gap-2">
        {stepLabels.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold",
                i < step
                  ? "bg-charity text-white"
                  : i === step
                    ? "bg-brand text-white"
                    : "bg-sand-100 text-sand-400",
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <span
              className={cn(
                "hidden text-[12px] font-semibold sm:block",
                i === step ? "text-ink" : "text-sand-400",
              )}
            >
              {label}
            </span>
            {i < stepLabels.length - 1 && (
              <span className="h-px flex-1 bg-sand-200" />
            )}
          </li>
        ))}
      </ol>

      <Card className="mt-8 space-y-5 rounded-2xl p-6 sm:p-8">
        {step === 0 && (
          <>
            <Field label="Title">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Vintage Schwinn Road Bike"
              />
            </Field>
            <Field label="Description">
              <Textarea placeholder="Condition, history, why you're selling…" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                >
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Price (USD)">
                <Input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  inputMode="numeric"
                  placeholder="120"
                />
              </Field>
            </div>
          </>
        )}

        {step === 1 && (
          <Field label="Photos" hint="Up to 5 photos. First one is the cover.">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {photos.map((c, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-md"
                  style={{ background: c }}
                />
              ))}
              {photos.length < 5 && (
                <button
                  type="button"
                  onClick={() =>
                    setPhotos((p) => [...p, colors[p.length % colors.length]])
                  }
                  className="flex aspect-square flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-sand-300 text-sand-400 hover:border-brand hover:text-brand"
                >
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-[11px] font-semibold">Add</span>
                </button>
              )}
            </div>
          </Field>
        )}

        {step === 2 && (
          <>
            <Field label="Condition">
              <Select
                value={condition}
                onChange={(e) => setCondition(e.target.value as Condition)}
              >
                {Object.entries(CONDITION_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="City">
                <Input placeholder="Dallas, TX" defaultValue="Dallas, TX" />
              </Field>
              <Field
                label="Pickup area"
                hint="A neighborhood — never your exact address."
              >
                <Input placeholder="Bishop Arts" />
              </Field>
            </div>
          </>
        )}

        {step === 3 && (
          <div>
            <p className="text-sm text-sand-600">
              Choose the nonprofit that receives this sale&apos;s proceeds.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {approved.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setNonprofitId(n.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                    nonprofitId === n.id
                      ? "border-brand bg-brand-subtle"
                      : "border-sand-200 bg-white hover:border-sand-300",
                  )}
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md font-display text-sm font-bold text-white"
                    style={{ backgroundColor: n.logoColor }}
                  >
                    {n.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1 truncate font-semibold text-ink">
                      {n.name}
                      <BadgeCheck
                        className="h-3.5 w-3.5 shrink-0 text-brand"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-[12px] text-sand-500">
                      {n.city}, {n.state}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="rounded-lg border border-sand-200 bg-white p-5">
            <h2 className="font-display text-lg font-bold">Review</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <ReviewRow label="Title" value={title || "—"} />
              <ReviewRow
                label="Price"
                value={price ? `$${price}` : "—"}
              />
              <ReviewRow label="Category" value={CATEGORY_LABELS[category]} />
              <ReviewRow label="Condition" value={CONDITION_LABELS[condition]} />
              <ReviewRow label="Photos" value={`${photos.length} added`} />
              <ReviewRow
                label="Nonprofit"
                value={
                  approved.find((n) => n.id === nonprofitId)?.name ??
                  "Not selected"
                }
              />
            </dl>
            <div className="mt-4">
              <TermsCheckbox checked={agreed} onChange={setAgreed} />
            </div>
          </div>
        )}
      </Card>

      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={back}
          disabled={step === 0}
          className={step === 0 ? "invisible" : ""}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Button>
        {step < stepLabels.length - 1 ? (
          <Button onClick={next} disabled={step === 3 && !nonprofitId}>
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        ) : (
          <Button
            onClick={() => setPublished(true)}
            disabled={!nonprofitId || !agreed}
          >
            Publish listing
          </Button>
        )}
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-sand-100 pb-2">
      <dt className="text-sand-500">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}
