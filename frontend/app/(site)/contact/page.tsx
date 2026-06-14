"use client";

import { useState } from "react";
import { CheckCircle2, Mail, MapPin, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";

const channels = [
  { icon: Mail, label: "Email", value: "hello@marketplacefornonprofits.org" },
  { icon: MessageSquare, label: "Support", value: "In-app chat, 9–5 CT" },
  { icon: MapPin, label: "Based in", value: "Dallas, TX" },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
          Contact us
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold">
          We&apos;d love to hear from you
        </h1>
        <p className="mt-2 text-sand-600">
          Questions, feedback, or partnership ideas — drop us a line.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-sm">
          {sent ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 className="h-12 w-12 text-charity" aria-hidden="true" />
              <p className="mt-3 font-display text-lg font-bold">Message sent</p>
              <p className="mt-1 text-sm text-sand-500">
                We&apos;ll get back to you within a couple of business days.
              </p>
              <Button className="mt-5" onClick={() => setSent(false)}>
                Send another
              </Button>
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" required>
                  <Input required placeholder="Your name" />
                </Field>
                <Field label="Email" required>
                  <Input type="email" required placeholder="you@email.com" />
                </Field>
              </div>
              <Field label="Subject" required>
                <Input required placeholder="What's this about?" />
              </Field>
              <Field label="Message" required>
                <Textarea required placeholder="How can we help?" className="min-h-36" />
              </Field>
              <Button type="submit" size="lg">
                Send message
              </Button>
            </form>
          )}
        </div>

        <aside className="space-y-3">
          {channels.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-2xl border border-sand-200 bg-white p-5 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-subtle text-brand">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-sand-500">
                {label}
              </p>
              <p className="text-sm font-semibold text-ink">{value}</p>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
