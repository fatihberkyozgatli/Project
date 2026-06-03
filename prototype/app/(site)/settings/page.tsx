"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/mock";

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold">Settings</h1>

      <Section title="Profile" subtitle="How you appear across the marketplace.">
        <div className="space-y-4">
          <Field label="Display name">
            <Input defaultValue={currentUser.name} />
          </Field>
          <Field label="City">
            <Input defaultValue={currentUser.city} />
          </Field>
          <Field label="Bio">
            <Textarea defaultValue={currentUser.bio} />
          </Field>
          <Button>Save changes</Button>
        </div>
      </Section>

      <Section
        title="Notifications"
        subtitle="Choose what reaches you, and where."
      >
        <div className="divide-y divide-sand-200">
          <ToggleRow label="New messages" defaultOn />
          <ToggleRow label="Someone is interested in my listing" defaultOn />
          <ToggleRow label="Payment & confirmation updates" defaultOn />
          <ToggleRow label="Donation receipts" defaultOn />
          <ToggleRow label="Product news & tips" />
        </div>
      </Section>

      <Section title="Security" subtitle="Keep your account safe.">
        <div className="space-y-3">
          <Button variant="secondary">Change password</Button>
          <ToggleRow label="Two-factor authentication (TOTP)" />
        </div>
      </Section>

      <Section title="Account" subtitle="Manage your data and presence.">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">Download my data</Button>
          <Button variant="secondary">Deactivate account</Button>
          <Button variant="destructive">Delete account</Button>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="mt-6 p-6">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      <p className="mt-0.5 text-sm text-sand-500">{subtitle}</p>
      <div className="mt-5">{children}</div>
    </Card>
  );
}

function ToggleRow({
  label,
  defaultOn = false,
}: {
  label: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-ink">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn((v) => !v)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          on ? "bg-brand" : "bg-sand-300",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            on ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}
