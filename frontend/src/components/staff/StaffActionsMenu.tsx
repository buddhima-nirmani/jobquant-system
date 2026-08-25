"use client";

import Link from "next/link";

import type { StaffSummary } from "@/lib/api";
import { resetStaffPassword, updateStaff } from "@/lib/api";

import {
  MoreHorizontal,
  Pencil,
  KeyRound,
  UserX,
  UserCheck,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StaffActionsMenuProps {
  member: StaffSummary;
  onChanged: () => void;
}

export default function StaffActionsMenu({
  member,
  onChanged,
}: StaffActionsMenuProps) {
  async function handleResetPassword() {
    const newPassword = window.prompt(
      `Enter a new password for ${member.name} (min 8 characters):`
    );
    if (!newPassword) return;

    try {
      await resetStaffPassword(member.id, newPassword);
      window.alert("Password reset successfully.");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Unable to reset password.");
    }
  }

  async function handleToggleActive() {
    try {
      await updateStaff(member.id, { is_active: !member.is_active });
      onChanged();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Unable to update staff member.");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-slate-100">
          <MoreHorizontal size={18} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 rounded-xl">
        <DropdownMenuItem asChild>
          <Link
            href={`/admin/staff/edit/${member.id}`}
            className="flex items-center gap-2"
          >
            <Pencil size={16} />
            Edit Staff
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleResetPassword}>
          <KeyRound size={16} />
          <span>Reset Password</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleToggleActive}
          className={member.is_active ? "text-red-600 focus:text-red-600" : ""}
        >
          {member.is_active ? (
            <>
              <UserX size={16} />
              <span>Deactivate</span>
            </>
          ) : (
            <>
              <UserCheck size={16} />
              <span>Activate</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
