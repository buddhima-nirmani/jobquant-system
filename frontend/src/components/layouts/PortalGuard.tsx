"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import { CurrentUser, ROLE_HOME_ROUTE, getCurrentUser } from "@/lib/auth";

type PortalGuardProps = {
  role: "admin" | "staff" | "client";
  children: React.ReactNode;
};

export default function PortalGuard({ role, children }: PortalGuardProps) {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;

    getCurrentUser().then((currentUser) => {
      if (!active) {
        return;
      }

      if (!currentUser) {
        router.replace("/login");
        return;
      }

      if (currentUser.role !== role) {
        router.replace(ROLE_HOME_ROUTE[currentUser.role]);
        return;
      }

      setUser(currentUser);
      setChecked(true);
    });

    return () => {
      active = false;
    };
  }, [role, router]);

  if (!checked || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F4]">
        <p className="text-sm text-[#64748B]">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <Sidebar role={role} />

      <div className="ml-[240px] flex min-h-screen flex-1 flex-col">
        <Navbar role={role} userName={user.name} />

        <main className="flex-1 bg-[#FAF8F4]">
          <div className="px-10 py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
