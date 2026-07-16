"use client";

import {
  Bell,
  ChevronDown,
  CircleHelp,
  Search,
} from "lucide-react";

import HelpDropdown from "@/components/navbar/HelpDropdown";
import NotificationDropdown from "@/components/navbar/NotificationDropdown";
import ProfileDropdown from "@/components/navbar/ProfileDropdown";

type NavbarProps = {
  role: "admin" | "staff" | "client";
  userName: string;
};

const roleNames = {
  admin: "Administrator",
  staff: "Staff Member",
  client: "Client",
};

export default function Navbar({
  role,
  userName,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 h-24 border-b border-[#EAEAEA] bg-white">
      <div className="flex h-full items-center justify-between px-10">

        {/* Search */}

        <div className="relative w-[420px]">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />

          <input
            placeholder="Search jobs, clients, invoices..."
            className="h-12 w-full rounded-full border border-[#E5E7EB] bg-[#FAFAFA] pl-11 pr-4 text-sm outline-none transition focus:border-[#FF6B00] focus:bg-white"
          />

        </div>

        <div className="flex items-center gap-4">

          {/* Help */}

          <HelpDropdown>

            <button
              title="Help"
              aria-label="Help"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E7EB] transition hover:bg-[#FFF2E8]"
            >
              <CircleHelp
                size={18}
                className="text-[#64748B]"
              />
            </button>

          </HelpDropdown>

          {/* Notifications */}

          <NotificationDropdown>

            <button
              title="Notifications"
              aria-label="Notifications"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E7EB] transition hover:bg-[#FFF2E8]"
            >
              <Bell
                size={18}
                className="text-[#64748B]"
              />

              <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#FF6B00]" />

            </button>

          </NotificationDropdown>

          {/* Profile */}

          <ProfileDropdown>

            <button className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] px-3 py-2 transition hover:bg-[#FAFAFA]">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF2E8] font-semibold text-[#FF6B00]">
                {userName.charAt(0)}
              </div>

              <div className="text-left">

                <p className="text-sm font-semibold text-[#0F172A]">
                  {userName}
                </p>

                <p className="text-xs text-[#64748B]">
                  {roleNames[role]}
                </p>

              </div>

              <ChevronDown
                size={18}
                className="text-[#94A3B8]"
              />

            </button>

          </ProfileDropdown>

        </div>

      </div>
    </header>
  );
}