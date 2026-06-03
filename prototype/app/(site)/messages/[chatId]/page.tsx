import { notFound } from "next/navigation";
import { ChatThread } from "@/components/chat-thread";
import {
  chats,
  currentUser,
  getChat,
  getListing,
  getUser,
  transactions,
} from "@/lib/mock";
import type { Message } from "@/types";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;

  let chat = getChat(chatId);
  let listingId = chat?.listingId;

  if (!chat && chatId.startsWith("l_")) {
    listingId = chatId;
  }

  const listing = listingId ? getListing(listingId) : undefined;
  if (!listing) notFound();

  const otherId = chat
    ? chat.buyerId === currentUser.id
      ? chat.sellerId
      : chat.buyerId
    : listing.sellerId;
  const other = getUser(otherId)!;

  const messages: Message[] = chat
    ? chat.messages
    : [
        {
          id: "sys",
          senderId: "system",
          content: `You expressed interest in “${listing.title}”.`,
          createdAt: new Date().toISOString(),
        },
      ];

  const tx = transactions.find(
    (t) => t.listingId === listing.id && t.buyerId === currentUser.id,
  );
  const payHref = `/checkout/${tx?.id ?? listing.id}`;

  return (
    <ChatThread
      listing={listing}
      other={other}
      initialMessages={messages}
      payHref={payHref}
    />
  );
}
