"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  Loader2,
  PartyPopper,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { RatingModal } from "@/components/rating-modal";
import { cn, formatCents } from "@/lib/utils";

type Status = "active" | "processing" | "completed" | "cancelled" | "disputed";

export function TransactionDetail(props: {
  viewerRole: "buyer" | "seller";
  listingTitle: string;
  imageColor: string;
  nonprofitName: string;
  nonprofitInitials: string;
  nonprofitColor: string;
  otherName: string;
  amountCents: number;
  yourCode: string;
  theirCode: string;
  initiallyCompleted: boolean;
  initialStatus: "active" | "completed" | "cancelled" | "disputed";
}) {
  const [meetupConfirmed, setMeetupConfirmed] = useState(
    props.initiallyCompleted,
  );
  const [donationSent, setDonationSent] = useState(props.initiallyCompleted);
  const [terminal, setTerminal] = useState<"cancelled" | "disputed" | null>(
    props.initialStatus === "cancelled"
      ? "cancelled"
      : props.initialStatus === "disputed"
        ? "disputed"
        : null,
  );

  const status: Status = terminal
    ? terminal
    : donationSent
      ? "completed"
      : meetupConfirmed
        ? "processing"
        : "active";

  const otherLabel = props.viewerRole === "buyer" ? "the seller" : "the buyer";

  const confirmMeetup = () => {
    setMeetupConfirmed(true);
    setTimeout(() => setDonationSent(true), 1300);
  };

  const steps = [
    { label: "Payment held", done: true },
    { label: "Meetup confirmed", done: meetupConfirmed },
    { label: "Donation sent", done: donationSent },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        {status === "completed" && (
          <div className="relative overflow-hidden rounded-2xl bg-charity p-6 text-white">
            <PartyPopper
              className="absolute -right-3 -top-3 h-24 w-24 text-white/15"
              aria-hidden="true"
            />
            <p className="text-[11px] font-bold uppercase tracking-wide text-white/80">
              Transaction complete
            </p>
            <p className="tabular mt-1 font-display text-3xl font-extrabold">
              {formatCents(props.amountCents)} donated
            </p>
            <p className="mt-1 text-white/90">
              Sent to {props.nonprofitName}. Thank you for giving.
            </p>
            <RatingModal otherName={props.otherName} />
          </div>
        )}

        {status === "processing" && (
          <div className="flex items-center gap-3 rounded-2xl bg-brand-subtle p-4">
            <Loader2 className="h-5 w-5 shrink-0 animate-spin text-brand" aria-hidden="true" />
            <div>
              <p className="font-display font-bold text-ink">
                Meetup confirmed
              </p>
              <p className="text-sm text-sand-600">
                Releasing {formatCents(props.amountCents)} to{" "}
                {props.nonprofitName}…
              </p>
            </div>
          </div>
        )}

        {status === "disputed" && (
          <Banner
            icon={AlertTriangle}
            tone="error"
            title="Dispute opened"
            body="An admin is reviewing this transaction. The payment stays held until it's resolved."
          />
        )}
        {status === "cancelled" && (
          <Banner
            icon={XCircle}
            tone="neutral"
            title="Transaction cancelled"
            body="The payment has been refunded to the buyer."
          />
        )}

        <div className="rounded-2xl border border-sand-200 bg-white p-5 shadow-sm">
          <h2 className="font-display text-base font-bold">Progress</h2>
          <ol className="mt-4 space-y-3">
            {steps.map((s) => (
              <li key={s.label} className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                    s.done ? "bg-charity text-white" : "bg-sand-100 text-sand-400",
                  )}
                >
                  {s.done ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-current" />
                  )}
                </span>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    s.done ? "text-ink" : "text-sand-400",
                  )}
                >
                  {s.label}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {status === "active" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <ShareCode code={props.yourCode} otherLabel={otherLabel} />
            <EnterCode
              expected={props.theirCode}
              otherLabel={otherLabel}
              onConfirm={confirmMeetup}
            />
          </div>
        )}

        {status === "active" && (
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setTerminal("disputed")}>
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              Open a dispute
            </Button>
            <Button
              variant="destructive"
              onClick={() => setTerminal("cancelled")}
            >
              Cancel &amp; refund
            </Button>
          </div>
        )}
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-sand-200 bg-white p-5 shadow-sm">
          <Badge
            variant={
              status === "completed"
                ? "success"
                : status === "disputed"
                  ? "error"
                  : status === "cancelled"
                    ? "neutral"
                    : "brand"
            }
          >
            {labelFor(status)}
          </Badge>
          <div className="mt-4 flex items-center gap-3">
            <div
              className="h-14 w-14 shrink-0 rounded-lg"
              style={{ background: props.imageColor }}
            />
            <div>
              <p className="font-semibold leading-tight text-ink">
                {props.listingTitle}
              </p>
              <p className="tabular text-sm font-bold text-brand">
                {formatCents(props.amountCents)}
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-charity-subtle p-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-charity-text">
              Donation recipient
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Avatar
                initials={props.nonprofitInitials}
                color={props.nonprofitColor}
                size="sm"
              />
              <span className="text-sm font-semibold text-ink">
                {props.nonprofitName}
              </span>
            </div>
          </div>
          <p className="mt-4 flex items-start gap-2 text-[12px] text-sand-500">
            <ShieldCheck
              className="mt-0.5 h-4 w-4 shrink-0 text-brand"
              aria-hidden="true"
            />
            Auto-cancels with a full refund if codes aren&apos;t entered within 72
            hours.
          </p>
        </div>
      </aside>
    </div>
  );
}

function labelFor(status: Status) {
  return {
    active: "Payment held",
    processing: "Sending donation…",
    completed: "Donation completed",
    cancelled: "Cancelled — refunded",
    disputed: "Disputed",
  }[status];
}

function ShareCode({ code, otherLabel }: { code: string; otherLabel: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-sand-500">
        Your code
      </p>
      <p className="mt-1 text-[13px] text-sand-600">
        Read this out to {otherLabel} at the meetup.
      </p>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="mt-3 flex w-full items-center justify-between rounded-lg border border-dashed border-brand/40 bg-brand-subtle px-4 py-3 transition-colors hover:bg-brand-subtle/70"
      >
        <span className="tabular font-display text-2xl font-extrabold tracking-[0.2em] text-brand">
          {code}
        </span>
        <span className="flex items-center gap-1 text-[12px] font-semibold text-brand">
          {copied ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" aria-hidden="true" /> Copy
            </>
          )}
        </span>
      </button>
    </div>
  );
}

function EnterCode({
  expected,
  otherLabel,
  onConfirm,
}: {
  expected: string;
  otherLabel: string;
  onConfirm: () => void;
}) {
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);
  const matches = value.trim().toUpperCase() === expected;

  const submit = () => {
    if (matches) onConfirm();
    else setWrong(true);
  };

  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-sand-500">
        {otherLabel === "the seller" ? "Seller's code" : "Buyer's code"}
      </p>
      <p className="mt-1 text-[13px] text-sand-600">
        Ask {otherLabel} for their code and enter it here.
      </p>
      <p className="mt-1 text-[12px] text-sand-400">
        Demo: their code is{" "}
        <span className="tabular font-bold text-sand-600">{expected}</span>
      </p>
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setWrong(false);
        }}
        placeholder="Enter code"
        aria-label="Enter their code"
        maxLength={4}
        className={cn(
          "tabular mt-3 h-12 w-full rounded-lg border bg-white px-3 text-center text-xl font-bold uppercase tracking-[0.3em] focus:border-brand",
          wrong ? "border-error" : "border-sand-300",
        )}
      />
      {wrong && (
        <p role="alert" className="mt-1.5 text-[12px] font-medium text-error-text">
          That code doesn&apos;t match. Double-check with {otherLabel}.
        </p>
      )}
      <Button size="sm" className="mt-3 w-full" disabled={!value} onClick={submit}>
        Confirm meetup
      </Button>
    </div>
  );
}

function Banner({
  icon: Icon,
  tone,
  title,
  body,
}: {
  icon: typeof AlertTriangle;
  tone: "error" | "neutral";
  title: string;
  body: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl p-4",
        tone === "error" ? "bg-error-subtle" : "bg-sand-100",
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 h-5 w-5 shrink-0",
          tone === "error" ? "text-error-text" : "text-sand-500",
        )}
        aria-hidden="true"
      />
      <div>
        <p className="font-display font-bold text-ink">{title}</p>
        <p className="text-sm text-sand-600">{body}</p>
      </div>
    </div>
  );
}
