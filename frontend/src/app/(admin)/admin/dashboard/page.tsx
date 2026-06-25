import PageHeader from "@/components/layouts/PageHeader";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentJobs from "@/components/dashboard/RecentJobs";

import {
  ClipboardList,
  Users,
  UserRoundCog,
  WalletCards,
} from "lucide-react";

import {
  recentActivities,
  recentJobs,
} from "@/data/dashboard";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">

      <PageHeader
        title="Dashboard"
        description="Welcome back to JobQuant."
      />

      {/* KPI Cards */}

      <div className="grid grid-cols-4 gap-6">

        <DashboardStatCard
          title="Total Jobs"
          value="128"
          icon={ClipboardList}
        />

        <DashboardStatCard
          title="Active Clients"
          value="34"
          icon={Users}
        />

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

      {/* Middle */}

      <div className="grid grid-cols-12 gap-6">

        <div className="col-span-8">
          <RecentActivity
            activities={recentActivities}
          />
        </div>

        <div className="col-span-4">
          <QuickActions />
        </div>

      </div>

      {/* Bottom */}

      <RecentJobs jobs={recentJobs} />

    </div>
  );
}