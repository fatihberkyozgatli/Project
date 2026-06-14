"use client";

import { MessageCircle } from "lucide-react";
import { ProtectedAction } from "@/components/protected-action";
import { buttonClasses } from "@/components/ui/button";

export function InterestButton({
  listingId,
  existingChatId,
}: {
  listingId: string;
  existingChatId?: string;
}) {
  return (
    <ProtectedAction
      href={`/messages/${existingChatId ?? listingId}`}
      message="Log in as a member to message the seller and buy this item."
      className={buttonClasses("primary", "lg", "flex-1")}
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      {existingChatId ? "Open chat" : "I'm interested"}
    </ProtectedAction>
  );
}
