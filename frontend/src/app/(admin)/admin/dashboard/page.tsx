import PageHeader from "@/components/layouts/PageHeader";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import DashboardOverviewChart from "@/components/dashboard/DashboardOverviewChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentJobs from "@/components/dashboard/RecentJobs";

import { ClipboardList, Users, UserRoundCog, WalletCards } from "lucide-react";

import { recentActivities, recentJobs } from "@/data/dashboard";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome Back, Wasantha!"
        description="Manage printing operations and monitor business performance."
        date="Monday, 30 June 2026"
      />

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Total Jobs"
          value="128"
          icon={ClipboardList}
        />

        <DashboardStatCard title="Active Clients" value="34" icon={Users} />

        <DashboardStatCard
          title="Staff Members"
          value="12"
          icon={UserRoundCog}
        />

        <DashboardStatCard
          title="Pending Payments"
          value="8"
          icon={WalletCards}
        />
      </div>

      {/* Main Dashboard */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <DashboardOverviewChart />

          <QuickActions />
        </div>

        <RecentActivity activities={recentActivities} />
      </div>

      <RecentJobs jobs={recentJobs} />
    </div>
  );
}
