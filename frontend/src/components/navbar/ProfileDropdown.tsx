"use client";

import Link from "next/link";

import {
  LogOut,
  Settings,
  User,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/auth";

type Props = {
  children: React.ReactNode;
  role: "admin" | "staff" | "client";
};

const BASE_PATH: Record<Props["role"], string> = {
  admin: "/admin",
  staff: "/staff",
  client: "/portal",
};

export default function ProfileDropdown({
  children,
  role,
}: Props) {
  const basePath = BASE_PATH[role];

  async function handleLogout() {
    localStorage.removeItem("jobquant_user");
    await logout();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-60 rounded-xl border-[#EAEAEA]"
      >
        <div className="px-3 py-3">
          <p className="font-semibold text-[#0F172A]">
            Account
          </p>

          <p className="text-sm text-[#64748B]">
            Manage your profile
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href={`${basePath}/profile`}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href={`${basePath}/settings`}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
