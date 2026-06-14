import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { timeAgo } from "@/lib/utils";
import { chats, currentUser, getListing, getUser } from "@/lib/mock";

export default function MessagesPage() {
  const myChats = chats.filter(
    (c) => c.buyerId === currentUser.id || c.sellerId === currentUser.id,
  );

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-3xl font-extrabold">Messages</h1>

      {myChats.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-sand-300 py-16 text-center">
          <MessageCircle
            className="mx-auto h-10 w-10 text-sand-400"
            aria-hidden="true"
          />
          <p className="mt-3 font-display text-lg font-bold">No messages yet</p>
          <p className="mt-1 text-sm text-sand-500">
            Express interest in a listing to start chatting.
          </p>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-sand-200 overflow-hidden rounded-lg border border-sand-200 bg-white">
          {myChats.map((chat) => {
            const listing = getListing(chat.listingId)!;
            const otherId =
              chat.buyerId === currentUser.id ? chat.sellerId : chat.buyerId;
            const other = getUser(otherId)!;
            const last = chat.messages[chat.messages.length - 1];
            return (
              <Link
                key={chat.id}
                href={`/messages/${chat.id}`}
                className="flex items-center gap-3 p-4 hover:bg-sand-50"
              >
                <Avatar initials={other.initials} color={other.avatarColor} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-ink">{other.name}</p>
                    <span className="shrink-0 text-[11px] text-sand-400">
                      {timeAgo(last.createdAt)}
                    </span>
                  </div>
                  <p className="truncate text-[13px] text-sand-500">
                    {listing.title}
                  </p>
                  <p className="truncate text-sm text-sand-600">
                    {last.content}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
