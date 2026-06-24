import PageHeader from "@/components/layouts/PageHeader";
import StatCard from "@/components/cards/StatCard";
import StaffTable from "@/components/tables/StaffTable";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { staffMembers } from "@/data/staff";

import {
  Users,
  UserCheck,
  Briefcase,
  Clock,
} from "lucide-react";

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Management"
        description="Manage staff members and their assigned jobs."
      />

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Staff"
          value={24}
          icon={Users}
        />

        <StatCard
          title="Active Staff"
          value={20}
          icon={UserCheck}
        />

        <StatCard
          title="Jobs Assigned"
          value={57}
          icon={Briefcase}
        />

        <StatCard
          title="Pending Jobs"
          value={8}
          icon={Clock}
        />
      </div>

      {/* Search + Actions */}
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Search staff members..."
          className="max-w-md"
        />

        <Button>
          Add Staff
        </Button>
      </div>

      {/* Staff Table */}
      <StaffTable
        staffMembers={staffMembers}
      />
    </div>
  );
}