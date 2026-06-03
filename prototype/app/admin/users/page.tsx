import { BadgeCheck, Mail, Phone } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { ResolveActions } from "@/components/resolve-actions";
import { formatCents } from "@/lib/utils";
import { users } from "@/lib/mock";

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold">Users</h1>
      <p className="mt-1 text-sand-500">
        Warn, flag, or ban accounts that break the rules.
      </p>

      <div className="mt-6 overflow-hidden rounded-lg border border-sand-200 bg-white">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex flex-wrap items-center gap-4 border-b border-sand-100 p-4 last:border-0"
          >
            <Avatar initials={u.initials} color={u.avatarColor} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-ink">{u.name}</p>
                {u.verifiedEmail && (
                  <Mail className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                )}
                {u.verifiedPhone && (
                  <Phone className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                )}
              </div>
              <p className="text-[12px] text-sand-500">
                {u.city} · {u.completedTransactions} deals ·{" "}
                <span className="tabular text-charity-text">
                  {formatCents(u.donatedCents)} donated
                </span>
              </p>
            </div>
            <ResolveActions
              actions={[
                { label: "Warn", resolvedLabel: "Warned" },
                { label: "Flag", resolvedLabel: "Flagged" },
                { label: "Ban", tone: "danger", resolvedLabel: "Banned" },
              ]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
