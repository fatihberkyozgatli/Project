"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { TermsCheckbox } from "@/components/terms-checkbox";
import { formatCents } from "@/lib/utils";
import type { Listing, Nonprofit } from "@/types";

export function CheckoutForm({
  listing,
  nonprofit,
  amountCents,
  forwardId,
  splitOptions,
}: {
  listing: Listing;
  nonprofit: Nonprofit;
  amountCents: number;
  forwardId: string;
  splitOptions: Nonprofit[];
}) {
  const router = useRouter();
  const [split, setSplit] = useState(false);
  const [splitId, setSplitId] = useState(splitOptions[0]?.id ?? "");
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);

  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => router.push(`/transactions/${forwardId}`), 900);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <form onSubmit={pay} className="order-2 space-y-5 lg:order-1">
        <div>
          <h2 className="font-display text-lg font-bold">Payment</h2>
          <p className="text-sm text-sand-500">
            Funds are held securely and only released once both parties confirm.
          </p>
        </div>
        <Field label="Card number">
          <div className="relative">
            <CreditCard
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-400"
              aria-hidden="true"
            />
            <Input
              required
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              className="pl-9"
              defaultValue="4242 4242 4242 4242"
            />
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Expiry">
            <Input required placeholder="MM / YY" defaultValue="04 / 28" />
          </Field>
          <Field label="CVC">
            <Input required placeholder="123" defaultValue="123" />
          </Field>
        </div>
        <Field label="Name on card">
          <Input required placeholder="Full name" defaultValue="Alex Rivera" />
        </Field>

        <label className="flex cursor-pointer items-start gap-3 rounded-md border border-sand-200 bg-white p-3">
          <input
            type="checkbox"
            checked={split}
            onChange={(e) => setSplit(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-brand"
          />
          <span className="text-sm">
            <span className="font-semibold text-ink">
              Split this donation with a second nonprofit
            </span>
            <span className="block text-sand-500">
              50% to the seller&apos;s choice, 50% to yours.
            </span>
          </span>
        </label>

        {split && (
          <Field label="Your nonprofit">
            <select
              value={splitId}
              onChange={(e) => setSplitId(e.target.value)}
              className="h-10 w-full rounded-md border border-sand-300 bg-white px-3 text-sm"
            >
              {splitOptions.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </Field>
        )}

        <TermsCheckbox checked={agreed} onChange={setAgreed} />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={processing || !agreed}
        >
          <Lock className="h-4 w-4" aria-hidden="true" />
          {processing
            ? "Holding payment…"
            : `Pay ${formatCents(amountCents)}`}
        </Button>
        <p className="text-center text-[12px] text-sand-400">
          Prototype — no real charge. Card pre-filled with a Stripe test card.
        </p>
      </form>

      <aside className="order-1 lg:order-2">
        <div className="rounded-lg border border-sand-200 bg-white p-5 shadow-sm">
          <h2 className="font-display text-base font-bold">Order summary</h2>
          <div className="mt-4 flex items-center gap-3">
            <div
              className="h-14 w-14 shrink-0 rounded-md"
              style={{ background: listing.imageColor }}
            />
            <div>
              <p className="font-semibold leading-tight text-ink">
                {listing.title}
              </p>
              <p className="text-[13px] text-sand-500">{listing.pickupArea}</p>
            </div>
          </div>

          <div className="mt-5 space-y-2 border-t border-sand-200 pt-4 text-sm">
            <Row label="Item" value={formatCents(amountCents)} />
            <Row label="Platform fee" value="Free" accent />
            <div className="flex items-center justify-between border-t border-sand-200 pt-2 font-display text-lg font-extrabold">
              <span>Total</span>
              <span className="tabular text-brand">
                {formatCents(amountCents)}
              </span>
            </div>
          </div>

          <div className="mt-5 rounded-md bg-charity-subtle p-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-charity-text">
              Your donation goes to
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Avatar
                initials={nonprofit.initials}
                color={nonprofit.logoColor}
                size="sm"
              />
              <span className="text-sm font-semibold text-ink">
                {nonprofit.name}
                {split && splitId && (
                  <span className="font-normal text-sand-600">
                    {" "}
                    + your pick
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sand-600">{label}</span>
      <span className={accent ? "font-semibold text-charity-text" : "text-ink"}>
        {value}
      </span>
    </div>
  );
}
