"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Building2,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Receipt,
  Search,
  Settings,
  Sparkles,
  User as UserIcon,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Dropdown, MenuItem } from "@/components/ui/dropdown";
import { cn, timeAgo } from "@/lib/utils";
import { useRole } from "@/lib/use-role";
import { ROLE_LABEL } from "@/lib/auth";
import { currentUser, nonprofits, notifications } from "@/lib/mock";

function identity(role: string | null) {
  if (role === "admin")
    return { name: "Platform Admin", initials: "AD", color: "#0F172A" };
  if (role === "nonprofit") {
    const n = nonprofits[0];
    return { name: n.name, initials: n.initials, color: n.logoColor };
  }
  return {
    name: currentUser.name,
    initials: currentUser.initials,
    color: currentUser.avatarColor,
  };
}

export function SiteHeader() {
  const pathname = usePathname();
  const { role, ready, logout } = useRole();
  const [menuOpen, setMenuOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const isUserish = role === "user" || role === "admin";
  const showSearch = role !== "nonprofit";
  const me = identity(role);

  const nav =
    role === "nonprofit"
      ? [
          { href: "/nonprofits/dashboard", label: "Dashboard" },
          { href: "/nonprofits/sponsor", label: "Sponsorships" },
          { href: "/browse", label: "Browse" },
        ]
      : [
          { href: "/browse", label: "Browse" },
          { href: "/nonprofits", label: "Nonprofits" },
          ...(isUserish ? [{ href: "/transactions", label: "Transactions" }] : []),
        ];

  return (
    <header className="sticky top-0 z-40 border-b border-sand-200 bg-cream/85 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Logo />

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                isActive(item.href)
                  ? "bg-brand-subtle text-brand"
                  : "text-sand-600 hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {showSearch && (
          <Link
            href="/browse"
            className="ml-auto hidden h-10 max-w-xs flex-1 items-center gap-2 rounded-full border border-sand-300 bg-white px-4 text-sm text-sand-400 transition-colors hover:border-brand lg:flex"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Search listings…
          </Link>
        )}

        <div
          className={cn(
            "ml-auto flex items-center gap-2",
            showSearch && "lg:ml-3",
          )}
        >
          {!ready ? (
            <div className="h-10 w-10" />
          ) : !role ? (
            <Link href="/login" className={buttonClasses("primary", "md")}>
              Log in
            </Link>
          ) : (
            <>
              {isUserish && (
                <Link
                  href="/sell"
                  className={buttonClasses("primary", "md", "hidden sm:inline-flex")}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Sell
                </Link>
              )}

              {isUserish && (
                <Link
                  href="/messages"
                  aria-label="Messages"
                  className="hidden h-11 w-11 items-center justify-center rounded-md text-sand-600 transition-colors hover:bg-sand-100 md:flex"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </Link>
              )}

              {isUserish && (
                <Dropdown
                  label="Notifications"
                  width="w-80"
                  trigger={
                    <span className="relative flex h-11 w-11 items-center justify-center rounded-md text-sand-600 transition-colors hover:bg-sand-100">
                      <Bell className="h-5 w-5" aria-hidden="true" />
                      {unread > 0 && (
                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-coral" />
                      )}
                    </span>
                  }
                >
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="text-sm font-bold">Notifications</span>
                    <Badge variant="coral">{unread} new</Badge>
                  </div>
                  {notifications.map((n) => (
                    <MenuItem key={n.id} href={n.href}>
                      <span className="flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-ink">{n.title}</span>
                          <span className="shrink-0 text-[11px] text-sand-400">
                            {timeAgo(n.createdAt)}
                          </span>
                        </span>
                        <span className="block truncate text-[13px] font-normal text-sand-500">
                          {n.body}
                        </span>
                      </span>
                    </MenuItem>
                  ))}
                </Dropdown>
              )}

              <Dropdown
                label="Account menu"
                trigger={
                  <Avatar initials={me.initials} color={me.color} />
                }
              >
                <div className="flex items-center gap-2.5 px-2.5 py-2">
                  <Avatar initials={me.initials} color={me.color} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink">
                      {me.name}
                    </p>
                    <p className="text-[12px] text-sand-500">
                      {ROLE_LABEL[role]}
                    </p>
                  </div>
                </div>
                <div className="my-1 h-px bg-sand-100" />
                {role === "user" && (
                  <>
                    <MenuItem href="/profile" icon={UserIcon}>
                      Profile
                    </MenuItem>
                    <MenuItem href="/transactions" icon={Receipt}>
                      Transactions
                    </MenuItem>
                    <MenuItem href="/settings" icon={Settings}>
                      Settings
                    </MenuItem>
                  </>
                )}
                {role === "admin" && (
                  <>
                    <MenuItem href="/admin" icon={LayoutDashboard}>
                      Admin dashboard
                    </MenuItem>
                    <MenuItem href="/settings" icon={Settings}>
                      Settings
                    </MenuItem>
                  </>
                )}
                {role === "nonprofit" && (
                  <>
                    <MenuItem href="/nonprofits/dashboard" icon={LayoutDashboard}>
                      Dashboard
                    </MenuItem>
                    <MenuItem href="/nonprofits/settings" icon={Settings}>
                      Edit profile
                    </MenuItem>
                    <MenuItem href="/nonprofits/sponsor" icon={Sparkles}>
                      Sponsorships
                    </MenuItem>
                  </>
                )}
                <div className="my-1 h-px bg-sand-100" />
                <MenuItem onClick={logout} icon={LogOut} danger>
                  Log out
                </MenuItem>
              </Dropdown>
            </>
          )}

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-md text-sand-600 transition-colors hover:bg-sand-100 md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-sand-200 bg-cream px-4 py-3 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block rounded-md px-3 py-2.5 text-sm font-semibold",
                isActive(item.href) ? "bg-brand-subtle text-brand" : "text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
          {isUserish && (
            <Link
              href="/sell"
              onClick={() => setMenuOpen(false)}
              className="block rounded-md px-3 py-2.5 text-sm font-semibold text-ink"
            >
              Sell an item
            </Link>
          )}
          {role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="block rounded-md px-3 py-2.5 text-sm font-semibold text-ink"
            >
              Admin dashboard
            </Link>
          )}
          <div className="my-2 h-px bg-sand-200" />
          {ready && role ? (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-semibold text-error-text"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block rounded-md px-3 py-2.5 text-sm font-semibold text-brand"
            >
              Log in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
