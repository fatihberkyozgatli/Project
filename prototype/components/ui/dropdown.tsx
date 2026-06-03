"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Dropdown({
  trigger,
  label,
  align = "right",
  width = "w-72",
  children,
}: {
  trigger: React.ReactNode;
  label: string;
  align?: "left" | "right";
  width?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center rounded-full outline-none"
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a,button")) setOpen(false);
          }}
          className={cn(
            "absolute top-[calc(100%+10px)] z-50 origin-top animate-fade-up overflow-hidden rounded-xl border border-sand-200 bg-white p-1.5 shadow-lg",
            width,
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function MenuItem({
  href,
  onClick,
  icon: Icon,
  children,
  danger,
}: {
  href?: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  children: React.ReactNode;
  danger?: boolean;
}) {
  const className = cn(
    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors",
    danger
      ? "text-error-text hover:bg-error-subtle"
      : "text-ink hover:bg-sand-50",
  );
  const inner = (
    <>
      {Icon && <Icon className="h-4 w-4 text-sand-500" aria-hidden={true} />}
      {children}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {inner}
    </button>
  );
}
