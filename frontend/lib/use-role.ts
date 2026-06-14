"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROLE_COOKIE, type Role } from "@/lib/auth";

export function useRole() {
  const [role, setRole] = useState<Role | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${ROLE_COOKIE}=([^;]+)`),
    );
    setRole((match?.[1] as Role) ?? null);
    setReady(true);
  }, []);

  const logout = () => {
    document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0`;
    setRole(null);
    router.push("/login");
    router.refresh();
  };

  return { role, ready, logout };
}
