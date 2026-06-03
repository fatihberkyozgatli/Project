"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { authenticate, ROLE_COOKIE, ROLE_HOME } from "@/lib/auth";

export default function NonprofitLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = authenticate(username, password);
    if (role !== "nonprofit") {
      setError("Incorrect nonprofit credentials.");
      return;
    }
    document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=86400`;
    const next = new URLSearchParams(window.location.search).get("next");
    router.push(next || ROLE_HOME[role]);
    router.refresh();
  };

  return (
    <div>
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-subtle text-brand">
        <Building2 className="h-6 w-6" aria-hidden="true" />
      </span>
      <h1 className="mt-5 font-display text-3xl font-extrabold">
        Nonprofit login
      </h1>
      <p className="mt-1 text-sand-600">
        Manage your organization and track donations.
      </p>

      <form className="mt-6 space-y-4" onSubmit={submit}>
        <Field label="Organization username">
          <Input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            autoComplete="username"
            placeholder="nonprofit"
            required
          />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </Field>

        {error && (
          <p role="alert" className="text-sm font-medium text-error-text">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full">
          Log in
        </Button>
      </form>

      <div className="mt-5 rounded-md bg-sand-50 p-3 text-[13px] text-sand-600">
        <p className="font-semibold text-ink">Demo login</p>
        <p className="mt-1 tabular">
          Nonprofit: <span className="font-semibold">nonprofit / nonprofit</span>
        </p>
      </div>

      <div className="mt-6 space-y-3 text-center text-sm">
        <p className="text-sand-600">
          Not registered yet?{" "}
          <Link href="/nonprofits/register" className="font-semibold text-brand">
            Apply to join
          </Link>
        </p>
        <Link
          href="/login"
          className="flex items-center justify-center gap-1.5 font-semibold text-sand-600 hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to member login
        </Link>
      </div>
    </div>
  );
}
