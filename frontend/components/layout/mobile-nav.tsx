"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  PlusCircle,
  MessageCircle,
  User,
  LayoutDashboard,
  Sparkles,
  LogIn,
  Building2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole } from "@/lib/use-role";

type Item = { href: string; label: string; icon: LucideIcon };

const userItems: Item[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/browse", label: "Browse", icon: Search },
  { href: "/sell", label: "Sell", icon: PlusCircle },
  { href: "/messages", label: "Chats", icon: MessageCircle },
  { href: "/profile", label: "You", icon: User },
];

const nonprofitItems: Item[] = [
  { href: "/nonprofits/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/browse", label: "Browse", icon: Search },
  { href: "/nonprofits/sponsor", label: "Sponsor", icon: Sparkles },
];

const guestItems: Item[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/browse", label: "Browse", icon: Search },
  { href: "/nonprofits", label: "Causes", icon: Building2 },
  { href: "/login", label: "Log in", icon: LogIn },
];

export function MobileNav() {
  const pathname = usePathname();
  const { role, ready } = useRole();

  const items = !ready
    ? guestItems
    : role === "nonprofit"
      ? nonprofitItems
      : role
        ? userItems
        : guestItems;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-sand-200 bg-cream/95 backdrop-blur md:hidden">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        }}
      >
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold",
                active ? "text-brand" : "text-sand-500",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
