import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROLE_COOKIE } from "@/lib/auth";

const userArea = [
  "/sell",
  "/messages",
  "/checkout",
  "/transactions",
  "/profile",
  "/settings",
];
const nonprofitArea = [
  "/nonprofits/dashboard",
  "/nonprofits/sponsor",
  "/nonprofits/settings",
];
const editPattern = /^\/listings\/[^/]+\/edit/;

function redirect(req: NextRequest, to: string) {
  const url = req.nextUrl.clone();
  url.pathname = to;
  url.search = `?next=${encodeURIComponent(req.nextUrl.pathname)}`;
  return NextResponse.redirect(url);
}

export function middleware(req: NextRequest) {
  const role = req.cookies.get(ROLE_COOKIE)?.value;
  const path = req.nextUrl.pathname;
  const isAdmin = role === "admin";

  if (path.startsWith("/admin")) {
    if (!isAdmin) return redirect(req, "/login");
    return NextResponse.next();
  }

  if (nonprofitArea.some((p) => path.startsWith(p))) {
    if (!(role === "nonprofit" || isAdmin)) {
      return redirect(req, "/login/nonprofit");
    }
    return NextResponse.next();
  }

  if (userArea.some((p) => path.startsWith(p)) || editPattern.test(path)) {
    if (!(role === "user" || isAdmin)) return redirect(req, "/login");
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sell",
    "/messages/:path*",
    "/checkout/:path*",
    "/transactions/:path*",
    "/profile/:path*",
    "/settings",
    "/listings/:path*/edit",
    "/nonprofits/dashboard",
    "/nonprofits/sponsor",
    "/nonprofits/settings",
    "/admin/:path*",
  ],
};
