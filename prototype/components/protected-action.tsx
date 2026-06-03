"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useRole } from "@/lib/use-role";
import type { Role } from "@/lib/auth";

export function ProtectedAction({
  href,
  allow = ["user", "admin"],
  className,
  message = "You need to be logged in to do this.",
  children,
}: {
  href: string;
  allow?: Role[];
  className?: string;
  message?: string;
  children: React.ReactNode;
}) {
  const { role, ready } = useRole();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const onClick = () => {
    if (ready && role && allow.includes(role)) router.push(href);
    else setOpen(true);
  };

  return (
    <>
      <button type="button" className={className} onClick={onClick}>
        {children}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Log in to continue">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-subtle text-brand">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-3 text-sand-600">{message}</p>
          <div className="mt-5 flex w-full gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Not now
            </Button>
            <Button
              className="flex-1"
              onClick={() =>
                router.push(`/login?next=${encodeURIComponent(href)}`)
              }
            >
              Log in
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
