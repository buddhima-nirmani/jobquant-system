"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Briefcase,
  CreditCard,
  Headset,
  LayoutDashboard,
  Mail,
  Phone,
  UserCog,
  Users,
  X,
} from "lucide-react";

type SidebarProps = {
  role: "admin" | "staff" | "client";
  open: boolean;
  onClose: () => void;
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

const portalTitles = {
  admin: "ADMIN PORTAL",
  staff: "STAFF PORTAL",
  client: "CLIENT PORTAL",
};

export default function Sidebar({ role, open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile/tablet backdrop */}
      {open && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-[#ECECEC] bg-white transition-transform duration-200 ease-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}

        <div className="flex h-20 items-center justify-between border-b border-[#ECECEC] px-6 lg:h-24">
        <div className="flex items-center gap-3">

<Image
  src="/jobquant-icon.png"
  alt="JobQuant"
  width={44}
  height={44}
  priority
  className="rounded-lg object-contain"
/>

<div className="leading-none">

  <h1 className="text-[26px] font-bold text-[#0F172A]">
    JobQuant
  </h1>

  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
    {portalTitles[role]}
  </p>

</div>

</div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#F8FAFC] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

      {/* Workspace */}

      <div className="px-6 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
          Workspace
        </p>
      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 px-4">
        {navigation[role].map((item) => {
          const Icon = item.icon;

          const isDashboard = item.href.endsWith("/dashboard");
          const active = isDashboard
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex h-11 items-center gap-3 rounded-xl px-4 text-sm font-medium transition-all ${
                active
                  ? "bg-[#FFF2E8] text-[#FF6B00]"
                  : "text-[#64748B] hover:bg-[#FFF7F2] hover:text-[#FF6B00]"
              }`}
            >
              <Icon
                size={18}
                className={active ? "text-[#FF6B00]" : "text-[#94A3B8]"}
              />

              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Client Help */}

      {role === "client" && (
        <div className="border-t border-[#ECECEC] p-5">
          <div className="rounded-2xl bg-[#FFF8F3] p-4">
            <div className="flex items-center gap-2">
              <Headset size={18} className="text-[#FF6B00]" />

              <p className="font-semibold text-[#0F172A]">Need Help?</p>
            </div>

            <p className="mt-3 text-xs leading-5 text-[#64748B]">
              Contact Hansi Graphics if you need assistance with your order.
            </p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <Mail size={14} />
                hansigraphics@gmail.com
              </div>

              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <Phone size={14} />
                0753 661 661
              </div>
            </div>
          </div>
        </div>
        )}
      </aside>
    </>
  );
}
