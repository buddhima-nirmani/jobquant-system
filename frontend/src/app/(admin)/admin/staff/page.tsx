import PageHeader from "@/components/layouts/PageHeader";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import StaffTable from "@/components/tables/StaffTable";

import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { staff } from "@/data/staff";

import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Search,
} from "lucide-react";

export default function StaffPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Staff Management"
        description="Manage and monitor all staff members."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Total Staff"
          value={32}
          icon={Users}
        />

        <DashboardStatCard
          title="New Staff"
          value={4}
          icon={UserPlus}
        />

        <DashboardStatCard
          title="Active"
          value={29}
          icon={UserCheck}
        />

        <DashboardStatCard
          title="Inactive"
          value={3}
          icon={UserX}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />

          <Input
            placeholder="Search staff..."
            className="h-11 rounded-xl pl-10"
          />
        </div>

        <Button
          asChild
          className="h-11 rounded-xl bg-[#FF6B00] hover:bg-[#E55F00]"
        >
          <Link href="/admin/staff/create">
            Add Staff
          </Link>
        </Button>
      </div>

      <StaffTable staff={staff} />
    </div>
  );
}