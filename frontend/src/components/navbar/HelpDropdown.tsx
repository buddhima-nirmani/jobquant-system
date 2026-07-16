"use client";

import Link from "next/link";

import {
  CircleHelp,
  BookOpen,
  PhoneCall,
  Info,
} from "lucide-react";

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

export default function HelpDropdown({
  children,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 rounded-xl border-[#EAEAEA]"
      >
        <div className="px-4 py-3">
          <p className="font-semibold text-[#0F172A]">
            Help Center
          </p>

          <p className="text-sm text-[#64748B]">
            Need assistance?
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="#">
            <BookOpen className="mr-2 h-4 w-4" />
            User Guide
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="#">
            <PhoneCall className="mr-2 h-4 w-4" />
            Contact Support
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="#">
            <CircleHelp className="mr-2 h-4 w-4" />
            FAQ
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="#">
            <Info className="mr-2 h-4 w-4" />
            About JobQuant
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}