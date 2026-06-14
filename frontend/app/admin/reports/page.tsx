import { Badge } from "@/components/ui/badge";
import { ResolveActions } from "@/components/resolve-actions";
import { timeAgo } from "@/lib/utils";
import { getUser, reports } from "@/lib/mock";

const targetVariant = {
  listing: "neutral",
  user: "warning",
  chat: "neutral",
  nonprofit: "warning",
  transaction: "error",
} as const;

export default function AdminReportsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold">Reports</h1>
      <p className="mt-1 text-sand-500">
        All reports land here. High-volume reporters are deprioritized.
      </p>

      <div className="mt-6 space-y-3">
        {reports.map((r) => {
          const reporter = getUser(r.reporterId);
          return (
            <div
              key={r.id}
              className="rounded-lg border border-sand-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={targetVariant[r.target]}>{r.target}</Badge>
                <span className="text-[12px] text-sand-400">
                  {timeAgo(r.createdAt)} · by {reporter?.name ?? r.reporterId}
                </span>
              </div>
              <p className="mt-2 font-semibold text-ink">{r.reason}</p>
              <p className="text-sm text-sand-600">{r.targetLabel}</p>
              <div className="mt-4 border-t border-sand-100 pt-4">
                <ResolveActions
                  actions={[
                    { label: "Dismiss", resolvedLabel: "Dismissed" },
                    { label: "Warn user", resolvedLabel: "User warned" },
                    { label: "Remove", tone: "danger", resolvedLabel: "Removed" },
                    { label: "Suspend", tone: "danger", resolvedLabel: "Suspended" },
                  ]}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
