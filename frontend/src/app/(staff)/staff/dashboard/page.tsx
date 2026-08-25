"use client";

import { useEffect, useState } from "react";

import PageHeader from "@/components/layouts/PageHeader";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import RecentJobs from "@/components/dashboard/RecentJobs";
import QuickActions from "@/components/dashboard/QuickActions";
import LoadingState from "@/components/ui/LoadingState";

import {
  ClipboardList,
  Clock3,
  Truck,
  CircleCheck,
  Plus,
} from "lucide-react";

import { StaffDashboard, getStaffDashboard } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { todayLabel } from "@/lib/format";

export default function StaffDashboardPage() {
  const [data, setData] = useState<StaffDashboard | null>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCurrentUser().then((user) => setUserName(user?.name ?? ""));

    getStaffDashboard()
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load dashboard.")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingState label="Loading dashboard..." />;
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        {error || "Unable to load dashboard."}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        date={todayLabel()}
        title={`Welcome Back${userName ? `, ${userName}` : ""}!`}
        description="Manage assigned jobs and monitor daily printing tasks."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Assigned Jobs"
          value={data.assigned_jobs}
          icon={ClipboardList}
        />

        <DashboardStatCard
          title="Active Jobs"
          value={data.active_jobs}
          icon={Clock3}
        />

        <DashboardStatCard
          title="Due Soon"
          value={data.jobs_due_soon}
          icon={Truck}
        />

        <DashboardStatCard
          title="Completed"
          value={data.completed_jobs}
          icon={CircleCheck}
        />
      </div>

      <RecentJobs
        jobs={data.recent_jobs.map((job) => ({
          id: job.id,
          jobNumber: job.job_number,
          title: job.job_name,
          client: job.client_name,
          status: job.status,
        }))}
        basePath="/staff/jobs"
        title="Assigned Jobs"
        subtitle="Jobs you created or are working on"
        viewAllHref="/staff/jobs"
      />

      <QuickActions
        actions={[
          {
            title: "Create New Job",
            description: "Create a new print job",
            href: "/staff/jobs/create",
            icon: Plus,
          },
        ]}
      />
    </div>
  );
}
