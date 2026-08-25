import { API_URL, Role, clearToken, getToken } from "@/lib/api";

export type CurrentUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  role: Role;
  is_active: boolean;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as CurrentUser;
  } catch {
    return null;
  }
}

export const ROLE_HOME_ROUTE: Record<Role, string> = {
  admin: "/admin/dashboard",
  staff: "/staff/dashboard",
  client: "/portal/dashboard",
};

export async function logout(): Promise<void> {
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
    });
  } finally {
    clearToken();

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
}
