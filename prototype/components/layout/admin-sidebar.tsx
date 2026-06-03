"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Flag,
  LayoutDashboard,
  Receipt,
  ShoppingBag,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/nonprofits", label: "Nonprofits", icon: Building2 },
  { href: "/admin/listings", label: "Listings", icon: ShoppingBag },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/transactions", label: "Transactions", icon: Receipt },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="border-b border-white/10 bg-ink text-white lg:min-h-dvh lg:w-60 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-2 p-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand font-display text-sm font-extrabold">
          A
        </span>
        <span className="font-display font-extrabold">Admin</span>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="hidden border-t border-white/10 p-3 lg:block">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-white/60 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to site
        </Link>
      </div>
    </aside>
  );
}
