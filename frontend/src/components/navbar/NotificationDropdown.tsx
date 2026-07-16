"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  children: React.ReactNode;
};

const notifications = [
  {
    title: "New job created",
    time: "2 minutes ago",
  },
  {
    title: "Payment received",
    time: "20 minutes ago",
  },
  {
    title: "Client approved design",
    time: "Yesterday",
  },
];

export default function NotificationDropdown({
  children,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 rounded-xl border-[#EAEAEA]"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="font-semibold text-[#0F172A]">
              Notifications
            </p>

            <p className="text-sm text-[#64748B]">
              Recent activity
            </p>
          </div>

          <Bell
            size={18}
            className="text-[#FF6B00]"
          />
        </div>

        <DropdownMenuSeparator />

        {notifications.map((notification) => (
          <DropdownMenuItem
            key={notification.title}
            className="cursor-pointer py-3"
          >
            <div>
              <p className="font-medium text-[#0F172A]">
                {notification.title}
              </p>

              <p className="text-xs text-[#94A3B8]">
                {notification.time}
              </p>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="#"
            className="justify-center font-medium text-[#FF6B00]"
          >
            View All Notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}