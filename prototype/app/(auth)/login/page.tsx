"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { authenticate, ROLE_COOKIE, ROLE_HOME } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = authenticate(username, password);
    if (!role || role === "nonprofit") {
      setError(
        role === "nonprofit"
          ? "Use the nonprofit login for nonprofit accounts."
          : "Incorrect username or password.",
      );
      return;
    }
    document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=86400`;
    const next = new URLSearchParams(window.location.search).get("next");
    router.push(next || ROLE_HOME[role]);
    router.refresh();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Welcome back</h1>
      <p className="mt-1 text-sand-600">Log in to keep giving.</p>

      <button
        type="button"
        onClick={() => {
          setUsername("user");
          setPassword("user");
        }}
        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-sand-300 bg-white text-sm font-semibold text-ink transition-colors hover:bg-sand-50"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">
          G
        </span>
        Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3 text-[12px] text-sand-400">
        <span className="h-px flex-1 bg-sand-200" />
        or
        <span className="h-px flex-1 bg-sand-200" />
      </div>

      <form className="space-y-4" onSubmit={submit}>
        <Field label="Username">
          <Input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            autoComplete="username"
            placeholder="user"
            required
          />
        </Field>
        <Field label="Password">
          <div className="relative">
            <Input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              autoComplete="current-password"
              placeholder="••••••••"
              className="pr-10"
              required
            />
            <button
              type="button"
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow((v) => !v)}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-sand-500 hover:bg-sand-100"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
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
        <p className="font-semibold text-ink">Demo logins</p>
        <p className="mt-1 tabular">
          Member: <span className="font-semibold">user / user</span> · Admin:{" "}
          <span className="font-semibold">admin / admin</span>
        </p>
      </div>

      <div className="mt-6 space-y-3 text-center text-sm">
        <p className="text-sand-600">
          New here?{" "}
          <Link href="/register" className="font-semibold text-brand">
            Create an account
          </Link>
        </p>
        <Link
          href="/login/nonprofit"
          className="flex items-center justify-center gap-2 rounded-md border border-sand-300 bg-white py-2.5 font-semibold text-ink transition-colors hover:bg-sand-50"
        >
          <Building2 className="h-4 w-4 text-brand" aria-hidden="true" />
          Nonprofit login
        </Link>
      </div>
    </div>
  );
}
