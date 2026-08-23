"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/layouts/PageHeader";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import JobsTable from "@/components/tables/JobsTable";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { JobListItem, deleteJob, listJobs } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

import {
  Briefcase,
  Clock3,
  Hammer,
  CircleCheckBig,
} from "lucide-react";

const IN_PROGRESS_STATUSES = [
  "Design",
  "Awaiting Client Approval",
  "Approved",
  "Production",
  "Ready for Delivery",
];

export default function JobsPage() {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  function refetch() {
    setLoading(true);
    setError("");

    listJobs({ q: search || undefined })
      .then(setJobs)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load jobs.")
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const timeout = setTimeout(refetch, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleDelete(jobId: number) {
    try {
      await deleteJob(jobId);
      showToast("Job deleted successfully.");
      refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to delete job.", "error");
    }
  }

  const total = jobs.length;
  const pending = jobs.filter((job) => job.status === "Pending").length;
  const inProgress = jobs.filter((job) =>
    IN_PROGRESS_STATUSES.includes(job.status)
  ).length;
  const completed = jobs.filter((job) => job.status === "Completed").length;

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
          value={String(total)}
          icon={Briefcase}
        />

        <DashboardStatCard
          title="Pending"
          value={String(pending)}
          icon={Clock3}
        />

        <DashboardStatCard
          title="In Progress"
          value={String(inProgress)}
          icon={Hammer}
        />

        <DashboardStatCard
          title="Completed"
          value={String(completed)}
          icon={CircleCheckBig}
        />
      </div>

      {/* Search and Create Job */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search by Job ID, Job Name or Client..."
          className="h-11 w-[360px]"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
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

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Jobs Table */}
      {loading ? (
        <p className="text-sm text-[#94A3B8]">Loading jobs...</p>
      ) : (
        <JobsTable jobs={jobs} basePath="/admin/jobs" onDelete={handleDelete} />
      )}
    </div>
  );
}
