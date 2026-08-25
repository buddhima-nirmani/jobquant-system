"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Sparkles } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { activityIcons } from "@/components/dashboard/RecentActivity";
import LoadingState from "@/components/ui/LoadingState";
import {
  NotificationResponse,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api";
import { formatRelativeTime } from "@/lib/format";

function notificationIcon(type: string) {
  return activityIcons[type as keyof typeof activityIcons] ?? Sparkles;
}

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
          <LoadingState className="px-4 py-4" />
        )}

        {!loading && notifications.length === 0 && (
          <p className="px-4 py-4 text-sm text-[#94A3B8]">No notifications yet.</p>
        )}

        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => {
            const Icon = notificationIcon(notification.type);

            return (
              <DropdownMenuItem
                key={notification.id}
                className="cursor-pointer items-start gap-3 py-3"
                onSelect={() => handleSelect(notification)}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    notification.is_read ? "bg-[#F8FAFC]" : "bg-[#FFF2E8]"
                  }`}
                >
                  <Icon
                    size={16}
                    className={notification.is_read ? "text-[#94A3B8]" : "text-[#FF6B00]"}
                  />
                </div>

                <div className="min-w-0 flex-1">
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

                {!notification.is_read && (
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6B00]" />
                )}
              </DropdownMenuItem>
            );
          })}
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
