"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  NotificationResponse,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api";
import { formatRelativeTime } from "@/lib/format";

type Props = {
  children: React.ReactNode;
  onUnreadChange?: () => void;
};

export default function NotificationDropdown({ children, onUnreadChange }: Props) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(false);

  function loadNotifications() {
    setLoading(true);
    listNotifications()
      .then(setNotifications)
      .finally(() => setLoading(false));
  }

  async function handleSelect(notification: NotificationResponse) {
    if (!notification.is_read) {
      await markNotificationRead(notification.id);
      onUnreadChange?.();
    }
    if (notification.link) {
      router.push(notification.link);
    }
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead();
    loadNotifications();
    onUnreadChange?.();
  }

  return (
    <DropdownMenu onOpenChange={(open) => open && loadNotifications()}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 rounded-xl border-[#EAEAEA]"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="font-semibold text-[#0F172A]">Notifications</p>
            <p className="text-sm text-[#64748B]">Recent activity</p>
          </div>

          <Bell size={18} className="text-[#FF6B00]" />
        </div>

        <DropdownMenuSeparator />

        {loading && (
          <p className="px-4 py-4 text-sm text-[#94A3B8]">Loading...</p>
        )}

        {!loading && notifications.length === 0 && (
          <p className="px-4 py-4 text-sm text-[#94A3B8]">No notifications yet.</p>
        )}

        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="cursor-pointer items-start gap-2 py-3"
              onSelect={() => handleSelect(notification)}
            >
              <span
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                  notification.is_read ? "bg-transparent" : "bg-[#FF6B00]"
                }`}
              />
              <div>
                <p
                  className={`font-medium ${
                    notification.is_read ? "text-[#64748B]" : "text-[#0F172A]"
                  }`}
                >
                  {notification.title}
                </p>
                <p className="text-xs text-[#94A3B8]">
                  {formatRelativeTime(notification.created_at)}
                </p>
              </div>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer justify-center gap-2 font-medium text-[#FF6B00]"
          onSelect={handleMarkAllRead}
        >
          <CheckCheck size={15} />
          Mark All as Read
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
