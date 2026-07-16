"use client";

import Link from "next/link";

import { Staff } from "@/data/staff";

import {
  MoreHorizontal,
  Pencil,
  KeyRound,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StaffActionsMenuProps {
  member: Staff;
}

export default function StaffActionsMenu({
  member,
}: StaffActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="
            flex h-9 w-9 items-center justify-center
            rounded-lg
            transition
            hover:bg-slate-100
          "
        >
          <MoreHorizontal size={18} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 rounded-xl"
      >
        <DropdownMenuItem asChild>
          <Link
            href={`/admin/staff/edit/${member.id}`}
            className="flex items-center gap-2"
          >
            <Pencil size={16} />
            Edit Staff
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            console.log("Reset Password", member.id);
          }}
        >
          <KeyRound size={16} />
          <span>Reset Password</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            console.log("Delete Staff", member.id);
          }}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 size={16} />
          <span>Delete Staff</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}