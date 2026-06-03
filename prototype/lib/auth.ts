export type Role = "user" | "nonprofit" | "admin";

export const ROLE_COOKIE = "mfn_role";

const VALID: Record<string, Role> = {
  user: "user",
  nonprofit: "nonprofit",
  admin: "admin",
};

export const ROLE_HOME: Record<Role, string> = {
  user: "/",
  nonprofit: "/nonprofits/dashboard",
  admin: "/admin",
};

export const ROLE_LABEL: Record<Role, string> = {
  user: "Member",
  nonprofit: "Nonprofit",
  admin: "Admin",
};

export function authenticate(username: string, password: string): Role | null {
  const u = username.trim().toLowerCase();
  if (u in VALID && password === u) return VALID[u];
  return null;
}
