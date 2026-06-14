"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, ShieldCheck } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { buttonClasses } from "@/components/ui/button";
import { ReportButton } from "@/components/report-button";
import { cn, formatCents } from "@/lib/utils";
import { currentUser } from "@/lib/mock";
import type { Listing, Message, User } from "@/types";

export function ChatThread({
  listing,
  other,
  initialMessages,
  payHref,
}: {
  listing: Listing;
  other: User;
  initialMessages: Message[];
  payHref: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((m) => [
      ...m,
      {
        id: `local_${m.length}`,
        senderId: currentUser.id,
        content: draft.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft("");
  };

  return (
    <div className="container-page flex h-[calc(100vh-4rem)] flex-col py-4 md:h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-3 border-b border-sand-200 pb-3">
        <Link
          href="/messages"
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-md text-sand-600 hover:bg-sand-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Avatar initials={other.initials} color={other.avatarColor} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-tight text-ink">{other.name}</p>
          <Link
            href={`/listings/${listing.id}`}
            className="truncate text-[13px] text-brand"
          >
            {listing.title}
          </Link>
        </div>
        <ReportButton target="chat" label={`chat with ${other.name}`} />
      </div>

      <div className="flex items-center justify-between gap-3 rounded-md bg-sand-50 px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-sand-500">
            Agreed price
          </p>
          <p className="tabular font-display text-xl font-extrabold text-brand">
            {formatCents(listing.priceCents)}
          </p>
        </div>
        <Link href={payHref} className={buttonClasses("primary", "md")}>
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Pay now
        </Link>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto py-4">
        {messages.map((m) => {
          if (m.senderId === "system") {
            return (
              <p
                key={m.id}
                className="mx-auto w-fit rounded-full bg-sand-100 px-3 py-1 text-center text-[12px] text-sand-500"
              >
                {m.content}
              </p>
            );
          }
          const mine = m.senderId === currentUser.id;
          return (
            <div
              key={m.id}
              className={cn("flex", mine ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3.5 py-2.5 text-sm",
                  mine
                    ? "bg-brand text-brand-fg"
                    : "border border-sand-200 bg-white text-ink",
                )}
              >
                {m.content}
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={send}
        className="flex items-center gap-2 border-t border-sand-200 pt-3"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message…"
          aria-label="Message"
          className="h-11 flex-1 rounded-md border border-sand-300 bg-white px-3.5 text-sm focus:border-brand"
        />
        <button
          type="submit"
          aria-label="Send"
          className="flex h-11 w-11 items-center justify-center rounded-md bg-brand text-brand-fg hover:bg-brand-hover"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
