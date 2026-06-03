"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROLE_COOKIE } from "@/lib/auth";

export default function VerifyPhonePage() {
  const router = useRouter();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const complete = digits.every((d) => d !== "");

  const setAt = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const copy = [...prev];
      copy[i] = d;
      return copy;
    });
    if (d && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <div className="text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-subtle text-brand">
        <Smartphone className="h-6 w-6" aria-hidden="true" />
      </span>
      <h1 className="mt-5 font-display text-3xl font-extrabold">
        Verify your phone
      </h1>
      <p className="mt-1 text-sand-600">
        We texted a 6-digit code to your number.
      </p>

      <form
        className="mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          document.cookie = `${ROLE_COOKIE}=user; path=/; max-age=86400`;
          router.push("/");
          router.refresh();
        }}
      >
        <div className="flex justify-center gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={d}
              onChange={(e) => setAt(i, e.target.value)}
              inputMode="numeric"
              maxLength={1}
              aria-label={`Digit ${i + 1}`}
              className="tabular h-14 w-12 rounded-md border border-sand-300 bg-white text-center font-display text-2xl font-bold focus:border-brand"
            />
          ))}
        </div>
        <Button type="submit" size="lg" className="mt-8 w-full" disabled={!complete}>
          Verify
        </Button>
      </form>

      <button
        type="button"
        className="mt-4 text-sm font-semibold text-brand"
        onClick={() => setDigits(["", "", "", "", "", ""])}
      >
        Resend code
      </button>
    </div>
  );
}
