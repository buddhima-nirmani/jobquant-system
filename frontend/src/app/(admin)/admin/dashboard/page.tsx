"use client";

import { useEffect, useState } from "react";

import PageHeader from "@/components/layouts/PageHeader";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import DashboardOverviewChart from "@/components/dashboard/DashboardOverviewChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentJobs from "@/components/dashboard/RecentJobs";
import LoadingState from "@/components/ui/LoadingState";

import { ClipboardList, Users, UserRoundCog, WalletCards } from "lucide-react";

import { AdminDashboard, TrendPoint, getAdminDashboard, getAdminTrend } from "@/lib/api";
import { formatRelativeTime, todayLabel } from "@/lib/format";
import { getCurrentUser } from "@/lib/auth";

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCurrentUser().then((user) => setUserName(user?.name ?? ""));

    getAdminTrend()
      .then(setTrend)
      .catch(() => setTrend([]));

    getAdminDashboard()
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
        description="Manage printing operations and monitor business performance."
      />

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Total Jobs"
          value={data.total_jobs}
          icon={ClipboardList}
        />

        <DashboardStatCard
          title="Active Clients"
          value={data.total_clients}
          icon={Users}
        />

        <DashboardStatCard
          title="Active Staff"
          value={data.active_staff}
          icon={UserRoundCog}
        />

        <DashboardStatCard
          title="Pending Payments"
          value={data.pending_payments}
          icon={WalletCards}
        />
      </div>

      {/* Main Dashboard */}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <DashboardOverviewChart
            pending={data.pending_jobs}
            inProgress={data.jobs_in_progress}
            completed={data.completed_jobs}
            trend={trend}
          />

          <QuickActions />
        </div>

        <RecentActivity
          activities={data.recent_activity.map((activity) => ({
            id: activity.id,
            title: activity.title,
            time: formatRelativeTime(activity.created_at),
            type: activity.type as
              | "job"
              | "payment"
              | "client"
              | "delivery"
              | "design"
              | "invoice",
          }))}
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
        basePath="/admin/jobs"
        viewAllHref="/admin/jobs"
      />
    </div>
  );
}
