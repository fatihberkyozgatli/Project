import Link from "next/link";
import { HandHeart } from "lucide-react";

const cols = [
  {
    title: "Marketplace",
    links: [
      { href: "/browse", label: "Browse listings" },
      { href: "/sell", label: "Sell an item" },
      { href: "/nonprofits", label: "Nonprofits" },
    ],
  },
  {
    title: "Nonprofits",
    links: [
      { href: "/nonprofits/register", label: "Join as a nonprofit" },
      { href: "/nonprofits/dashboard", label: "Nonprofit dashboard" },
      { href: "/nonprofits/sponsor", label: "Sponsorships" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact us" },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="max-w-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand">
              <HandHeart className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-sm font-extrabold leading-tight">
              Marketplace
              <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-charity">
                for Non-Profits
              </span>
            </span>
          </div>
          <p className="mt-4 text-sm text-white/60">
            A peer-to-peer marketplace where every sale becomes a donation.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h3 className="font-display text-[11px] font-bold uppercase tracking-wide text-white/50">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-charity"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-1 py-5 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>A commercial platform. Not a nonprofit. Donations are not tax-deductible.</p>
          <p>Prototype — mock data only.</p>
        </div>
      </div>
    </footer>
  );
}
