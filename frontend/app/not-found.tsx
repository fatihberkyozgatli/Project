import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <Logo />
      <p className="mt-8 font-display text-6xl font-extrabold text-brand">404</p>
      <h1 className="mt-2 font-display text-2xl font-extrabold">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-2 text-sand-600">
        It may have sold, been donated, or never existed.
      </p>
      <Link href="/" className={buttonClasses("primary", "lg", "mt-6")}>
        Back to home
      </Link>
    </div>
  );
}
