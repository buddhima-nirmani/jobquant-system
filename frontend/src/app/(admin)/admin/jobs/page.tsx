import PageHeader from "@/components/layouts/PageHeader";
import StatCard from "@/components/cards/StatCard";
import JobsTable from "@/components/tables/JobsTable";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { jobs } from "@/data/jobs";

import {
  Briefcase,
  Clock,
  LoaderCircle,
  CheckCircle,
} from "lucide-react";

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Management"
        description="Manage and track all client jobs."
      />

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Jobs"
          value={128}
          icon={Briefcase}
        />

        <StatCard
          title="Pending Jobs"
          value={18}
          icon={Clock}
        />

        <StatCard
          title="In Progress"
          value={15}
          icon={LoaderCircle}
        />

        <StatCard
          title="Completed Jobs"
          value={95}
          icon={CheckCircle}
        />
      </div>

      {/* Search + Create */}
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Search jobs..."
          className="max-w-md"
        />

        <Button asChild>
          <Link href="/admin/jobs/create">
            Create Job
          </Link>
        </Button>
      </div>

      <JobsTable jobs={jobs} />
    </div>
  );
}