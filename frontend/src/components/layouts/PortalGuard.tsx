"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FAF8F4]">
        <Image
          src="/jobquant-icon.png"
          alt="JobQuant"
          width={48}
          height={48}
          priority
          className="rounded-xl object-contain"
        />
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <Loader2 size={16} className="animate-spin text-[#FF6B00]" />
          Loading your workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <Sidebar role={role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-[250px]">
        <Navbar role={role} userName={user.name} onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 bg-[#FAF8F4]">
          <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
