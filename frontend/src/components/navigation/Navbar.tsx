"use client";

import { useEffect, useState } from "react";

import {
  Bell,
  ChevronDown,
  CircleHelp,
} from "lucide-react";

import GlobalSearch from "@/components/navbar/GlobalSearch";
import HelpDropdown from "@/components/navbar/HelpDropdown";
import NotificationDropdown from "@/components/navbar/NotificationDropdown";
import ProfileDropdown from "@/components/navbar/ProfileDropdown";
import { unreadNotificationCount } from "@/lib/api";

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
    <header className="sticky top-0 z-30 h-24 border-b border-[#EAEAEA] bg-white">
      <div className="flex h-full items-center justify-between px-10">

        <GlobalSearch role={role} />

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
