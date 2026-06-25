"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Briefcase,
  Users,
  UserCog,
  CreditCard,
} from "lucide-react";

type SidebarProps = {
  role: "admin" | "staff" | "client";
};

const navigation = {
  admin: [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Job Management",
      href: "/admin/jobs",
      icon: Briefcase,
    },
    {
      name: "Client Management",
      href: "/admin/clients",
      icon: Users,
    },
    {
      name: "Staff Management",
      href: "/admin/staff",
      icon: UserCog,
    },
    {
      name: "Payments",
      href: "/admin/payments",
      icon: CreditCard,
    },
  ],

  staff: [
    {
      name: "Dashboard",
      href: "/staff/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Job Management",
      href: "/staff/jobs",
      icon: Briefcase,
    },
    {
      name: "Client Management",
      href: "/staff/clients",
      icon: Users,
    },
    {
      name: "Payments",
      href: "/staff/payments",
      icon: CreditCard,
    },
  ],

  client: [
    {
      name: "Dashboard",
      href: "/portal/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Orders",
      href: "/portal/orders",
      icon: Briefcase,
    },
    {
      name: "Payments",
      href: "/portal/payments",
      icon: CreditCard,
    },
  ],
};

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col border-r border-[#ECECEC] bg-white">
      
      {/* Logo */}

      <div className="flex h-20 items-center px-6">
        <Image
          src="/jobquant-logo.png"
          alt="JobQuant"
          width={150}
          height={40}
          priority
          className="h-auto w-[140px] object-contain"
        />
      </div>

      {/* Workspace */}

      <div className="border-t border-[#ECECEC] px-6 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Workspace
        </p>
      </div>

      {/* Navigation */}

      <nav className="space-y-2 px-4">
        {navigation[role].map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-10 items-center gap-3 rounded-lg px-4 text-sm font-medium transition-all ${
                active
                  ? "bg-[#FFF2E8] text-[#FF6B00]"
                  : "text-[#64748B] hover:bg-[#FFF7F2] hover:text-[#FF6B00]"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  active ? "text-[#FF6B00]" : "text-[#94A3B8]"
                }`}
              />

              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
