import PageHeader from "@/components/layouts/PageHeader";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import JobsTable from "@/components/tables/JobsTable";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { jobs } from "@/data/jobs";

import {
  Briefcase,
  Clock3,
  Hammer,
  CircleCheckBig,
} from "lucide-react";

export default function JobsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Job Management"
        description="Manage and monitor all printing jobs."
      />

      {/* KPI Cards */}

      <div className="grid grid-cols-4 gap-6">

        <DashboardStatCard
          title="Total Jobs"
          value="128"
          icon={Briefcase}
        />

        <DashboardStatCard
          title="Pending"
          value="18"
          icon={Clock3}
        />

        <DashboardStatCard
          title="In Progress"
          value="15"
          icon={Hammer}
        />

        <DashboardStatCard
          title="Completed"
          value="95"
          icon={CircleCheckBig}
        />

      </div>

      {/* Search */}

      <div className="flex items-center justify-between">

        <Input
          placeholder="Search by Job ID, Client..."
          className="h-11 w-[360px]"
        />

        <Button
          asChild
          className="bg-[#FF6B00] hover:bg-[#E55F00]"
        >
          <Link href="/admin/jobs/create">
            Create Job
          </Link>
        </Button>

      </div>

      {/* Table */}

      <JobsTable jobs={jobs} />

    </div>
  );
}