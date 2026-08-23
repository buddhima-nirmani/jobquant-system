"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/layouts/PageHeader";
import JobsTable from "@/components/tables/JobsTable";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { JobListItem, listJobs } from "@/lib/api";

export default function StaffJobsPage() {
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      setError("");

      listJobs({ q: search || undefined })
        .then(setJobs)
        .catch((err) =>
          setError(err instanceof Error ? err.message : "Unable to load jobs.")
        )
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Job Management"
        description="Create and manage assigned printing jobs."
      />

      <div className="flex items-center justify-between">
        <Input
          placeholder="Search by Job ID, Job Name or Client..."
          className="h-11 w-[360px]"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <Button asChild className="bg-[#FF6B00] hover:bg-[#E55F00]">
          <Link href="/staff/jobs/create">Create Job</Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[#94A3B8]">Loading jobs...</p>
      ) : (
        <JobsTable jobs={jobs} basePath="/staff/jobs" />
      )}
    </div>
  );
}
