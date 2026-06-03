import { formatCents } from "@/lib/utils";
import { platformStats } from "@/lib/mock";

export function ImpactBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-coral to-[#E8825F] p-5 text-white shadow-coral sm:p-8">
      <div className="grain absolute inset-0 opacity-40" />
      <div
        className="absolute -right-10 -top-12 h-40 w-40 animate-float rounded-full bg-white/15 blur-2xl"
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/80">
            This month, the community
          </p>
          <p className="tabular mt-1 font-display text-3xl font-extrabold leading-none sm:text-5xl">
            {formatCents(platformStats.donatedCents)} donated
          </p>
        </div>
        <div className="flex gap-6 sm:gap-8">
          <Stat value={platformStats.transactions} label="transactions" />
          <Stat value={platformStats.nonprofits} label="nonprofits" />
          <Stat value={platformStats.members} label="members" />
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="tabular font-display text-xl font-extrabold sm:text-2xl">
        {value}
      </p>
      <p className="text-[12px] text-white/80 sm:text-[13px]">{label}</p>
    </div>
  );
}
