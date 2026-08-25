"use client";

import { useEffect, useState } from "react";

import {
  Bell,
  ChevronDown,
  CircleHelp,
  Menu,
} from "lucide-react";

import GlobalSearch from "@/components/navbar/GlobalSearch";
import HelpDropdown from "@/components/navbar/HelpDropdown";
import NotificationDropdown from "@/components/navbar/NotificationDropdown";
import ProfileDropdown from "@/components/navbar/ProfileDropdown";
import { unreadNotificationCount } from "@/lib/api";

type NavbarProps = {
  role: "admin" | "staff" | "client";
  userName: string;
  onMenuClick: () => void;
};

const roleNames = {
  admin: "Administrator",
  staff: "Staff Member",
  client: "Client",
};

export default function Navbar({
  role,
  userName,
  onMenuClick,
}: NavbarProps) {
  const [hasUnread, setHasUnread] = useState(false);

  function refreshUnread() {
    unreadNotificationCount()
      .then((result) => setHasUnread(result.count > 0))
      .catch(() => setHasUnread(false));
  }

  useEffect(() => {
    refreshUnread();
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[#EAEAEA] bg-white sm:h-20 lg:h-24">
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">

        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E5E7EB] transition hover:bg-[#FFF2E8] lg:hidden"
        >
          <Menu size={18} className="text-[#64748B]" />
        </button>

        <div className="min-w-0 flex-1">
          <GlobalSearch role={role} />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">

          {/* Help */}

          <HelpDropdown>

            <button
              title="Help"
              aria-label="Help"
              className="hidden h-11 w-11 items-center justify-center rounded-xl border border-[#E5E7EB] transition hover:bg-[#FFF2E8] sm:flex"
            >
              <CircleHelp
                size={18}
                className="text-[#64748B]"
              />
            </button>

          </HelpDropdown>

          {/* Notifications */}

          <NotificationDropdown onUnreadChange={refreshUnread}>

            <button
              title="Notifications"
              aria-label="Notifications"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E7EB] transition hover:bg-[#FFF2E8]"
            >
              <Bell
                size={18}
                className="text-[#64748B]"
              />

              {hasUnread && (
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#FF6B00]" />
              )}

            </button>

          </NotificationDropdown>

          {/* Profile */}

          <ProfileDropdown role={role}>

            <button className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] px-2 py-2 transition hover:bg-[#FAFAFA] sm:px-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF2E8] font-semibold text-[#FF6B00]">
                {userName.charAt(0)}
              </div>

              <div className="hidden text-left md:block">

                <p className="text-sm font-semibold text-[#0F172A]">
                  {userName}
                </p>

                <p className="text-xs text-[#64748B]">
                  {roleNames[role]}
                </p>

              </div>

              <ChevronDown
                size={18}
                className="hidden text-[#94A3B8] md:block"
              />

            </button>

          </ProfileDropdown>

        </div>

      </div>
    </header>
  );
}
