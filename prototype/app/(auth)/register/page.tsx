"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { TermsCheckbox } from "@/components/terms-checkbox";

export default function RegisterPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Create account</h1>
      <p className="mt-1 text-sand-600">Start turning stuff into good.</p>

      <button
        type="button"
        onClick={() => agreed && router.push("/verify-phone")}
        disabled={!agreed}
        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-sand-300 bg-white text-sm font-semibold text-ink transition-colors hover:bg-sand-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">
          G
        </span>
        Sign up with Google
      </button>

      <div className="my-5 flex items-center gap-3 text-[12px] text-sand-400">
        <span className="h-px flex-1 bg-sand-200" />
        or
        <span className="h-px flex-1 bg-sand-200" />
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/verify-phone");
        }}
      >
        <Field label="Full name" required>
          <Input required placeholder="Alex Rivera" />
        </Field>
        <Field label="Email" required>
          <Input type="email" required placeholder="you@email.com" />
        </Field>
        <Field label="Password" hint="At least 8 characters." required>
          <Input type="password" required placeholder="••••••••" />
        </Field>
        <TermsCheckbox checked={agreed} onChange={setAgreed} />
        <Button type="submit" size="lg" className="w-full" disabled={!agreed}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-sand-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand">
          Log in
        </Link>
      </p>
    </div>
  );
}
