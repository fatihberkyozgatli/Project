"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  FileCheck2,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TermsCheckbox } from "@/components/terms-checkbox";
import { cn } from "@/lib/utils";

const steps = ["Organization", "Verification", "Payouts", "Review"];
const categories = [
  "education",
  "environment",
  "health",
  "animals",
  "community",
  "arts",
];

export default function NonprofitRegisterPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [docUploaded, setDocUploaded] = useState(false);
  const [stripeLinked, setStripeLinked] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState("");
  const [ein, setEin] = useState("");

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  if (submitted) {
    return (
      <div className="container-page flex max-w-lg flex-col items-center py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-warning-subtle text-warning-text">
          <Clock className="h-8 w-8" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-extrabold">
          Submitted for review
        </h1>
        <p className="mt-2 text-sand-600">
          Thanks{name ? `, ${name}` : ""}. Our team will verify your EIN against
          the IRS database and review your documents. You&apos;ll hear back
          within a few business days.
        </p>
        <Link href="/" className="mt-6 inline-flex">
          <Button>Back to home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold">
        Join as a nonprofit
      </h1>
      <p className="mt-1 text-sand-600">
        Get a passive donation stream from everyday marketplace activity.
      </p>

      <ol className="mt-6 flex items-center gap-2">
        {steps.map((label, i) => (
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
            {i < steps.length - 1 && <span className="h-px flex-1 bg-sand-200" />}
          </li>
        ))}
      </ol>

      <Card className="mt-8 space-y-5 rounded-2xl p-6 sm:p-8">
        {step === 0 && (
          <>
            <Field label="Organization name">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Read DFW"
              />
            </Field>
            <Field label="Mission statement">
              <Textarea placeholder="One sentence on what you do." />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <Select defaultValue="education">
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c[0].toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Website">
                <Input placeholder="yourorg.org" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="City">
                <Input placeholder="Dallas" />
              </Field>
              <Field label="State">
                <Input placeholder="TX" defaultValue="TX" />
              </Field>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <Field
              label="EIN"
              hint="We cross-reference this with the IRS Tax Exempt Organization database."
            >
              <Input
                value={ein}
                onChange={(e) => setEin(e.target.value)}
                placeholder="75-1234567"
              />
            </Field>
            <Field label="IRS 501(c)(3) determination letter">
              <button
                type="button"
                onClick={() => setDocUploaded(true)}
                className={cn(
                  "flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors",
                  docUploaded
                    ? "border-charity bg-charity-subtle text-charity-text"
                    : "border-sand-300 text-sand-500 hover:border-brand hover:text-brand",
                )}
              >
                {docUploaded ? (
                  <>
                    <FileCheck2 className="h-7 w-7" aria-hidden="true" />
                    <span className="text-sm font-semibold">
                      determination-letter.pdf uploaded
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-7 w-7" aria-hidden="true" />
                    <span className="text-sm font-semibold">
                      Click to upload PDF
                    </span>
                  </>
                )}
              </button>
            </Field>
          </>
        )}

        {step === 2 && (
          <div className="rounded-lg border border-sand-200 bg-white p-6">
            <h2 className="font-display text-lg font-bold">
              Connect payouts with Stripe
            </h2>
            <p className="mt-1 text-sm text-sand-600">
              Donations are paid out directly to your nonprofit through a Stripe
              Express account. The platform never holds your funds.
            </p>
            <Button
              variant={stripeLinked ? "secondary" : "primary"}
              className="mt-5"
              onClick={() => setStripeLinked(true)}
            >
              {stripeLinked ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  Stripe connected
                </>
              ) : (
                "Connect with Stripe"
              )}
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="rounded-lg border border-sand-200 bg-white p-5">
            <h2 className="font-display text-lg font-bold">Review</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Organization" value={name || "—"} />
              <Row label="EIN" value={ein || "—"} />
              <Row
                label="Determination letter"
                value={docUploaded ? "Uploaded" : "Missing"}
              />
              <Row
                label="Stripe payouts"
                value={stripeLinked ? "Connected" : "Not connected"}
              />
            </dl>
            <p className="mt-4 text-[13px] text-sand-600">
              By submitting, you confirm your organization is a registered
              501(c)(3) and that the information above is accurate.
            </p>
            <div className="mt-3">
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
        {step < steps.length - 1 ? (
          <Button
            onClick={next}
            disabled={
              (step === 1 && !docUploaded) || (step === 2 && !stripeLinked)
            }
          >
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        ) : (
          <Button
            onClick={() => setSubmitted(true)}
            disabled={!docUploaded || !stripeLinked || !agreed}
          >
            Submit for review
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-sand-100 pb-2">
      <dt className="text-sand-500">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}
