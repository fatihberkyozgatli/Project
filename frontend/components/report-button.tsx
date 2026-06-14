"use client";

import { useState } from "react";
import { CheckCircle2, Flag } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Field, Textarea, Select } from "@/components/ui/input";
import type { ReportTarget } from "@/types";

const reasonsByTarget: Record<ReportTarget, string[]> = {
  listing: [
    "Fake listing",
    "Item not as described",
    "Prohibited item",
    "Counterfeit goods",
  ],
  user: ["Scam attempt", "Harassment", "Suspicious behavior"],
  chat: ["Harassment in chat", "Asked to pay off-platform", "Spam"],
  nonprofit: ["Fake nonprofit", "Misleading mission"],
  transaction: ["No-show", "Item not as described", "Payment issue"],
};

export function ReportButton({
  target,
  label,
}: {
  target: ReportTarget;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  const close = () => {
    setOpen(false);
    setTimeout(() => setDone(false), 200);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Report"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-sand-300 text-sand-500 hover:bg-sand-50 hover:text-error"
      >
        <Flag className="h-5 w-5" />
      </button>

      <Modal open={open} onClose={close} title="Report">
        {done ? (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-charity" aria-hidden="true" />
            <p className="mt-3 font-display text-lg font-bold">Report sent</p>
            <p className="mt-1 text-sm text-sand-500">
              Our team will review it shortly. Thank you for keeping the
              community safe.
            </p>
            <Button className="mt-5" onClick={close}>
              Done
            </Button>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            <p className="text-sm text-sand-600">
              Reporting <span className="font-semibold text-ink">{label}</span>
            </p>
            <Field label="Reason">
              <Select required defaultValue="">
                <option value="" disabled>
                  Select a reason…
                </option>
                {reasonsByTarget[target].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Details" hint="Optional — add anything that helps.">
              <Textarea placeholder="What happened?" />
            </Field>
            <Button type="submit" className="w-full">
              Submit report
            </Button>
          </form>
        )}
      </Modal>
    </>
  );
}
