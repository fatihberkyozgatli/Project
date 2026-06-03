"use client";

import Link from "next/link";

export function TermsCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 rounded-md border border-sand-200 bg-sand-50 p-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
      />
      <span className="text-[13px] text-sand-600">
        I agree to the{" "}
        <Link
          href="/terms"
          target="_blank"
          className="font-semibold text-brand hover:underline"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          target="_blank"
          className="font-semibold text-brand hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </span>
    </label>
  );
}
