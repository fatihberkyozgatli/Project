import Link from "next/link";
import { Building2, Sparkles } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { NonprofitCard } from "@/components/nonprofit-card";
import { nonprofits } from "@/lib/mock";

export default function NonprofitsPage() {
  const approved = [...nonprofits]
    .filter((n) => n.verification === "approved")
    .sort((a, b) => Number(b.sponsored) - Number(a.sponsored));
  const sponsored = approved.filter((n) => n.sponsored);
  const rest = approved.filter((n) => !n.sponsored);

  return (
    <div className="container-page py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Nonprofits</h1>
          <p className="mt-1 text-sand-600">
            Verified organizations receiving donations through everyday sales.
          </p>
        </div>
        <Link
          href="/nonprofits/register"
          className={buttonClasses("secondary", "md")}
        >
          <Building2 className="h-4 w-4" aria-hidden="true" />
          Join as a nonprofit
        </Link>
      </div>

      {sponsored.length > 0 && (
        <section className="mt-8">
          <h2 className="flex items-center gap-1.5 font-display text-sm font-bold uppercase tracking-wide text-coral-text">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Sponsored
          </h2>
          <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sponsored.map((n) => (
              <NonprofitCard key={n.id} nonprofit={n} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((n) => (
            <NonprofitCard key={n.id} nonprofit={n} />
          ))}
        </div>
      </section>
    </div>
  );
}
