import StatCard from "@/components/cards/StatCard";
import PageHeader from "@/components/layouts/PageHeader";

import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentJobs from "@/components/dashboard/RecentJobs";

import {
  Briefcase,
  Users,
  UserCog,
  CreditCard,
} from "lucide-react";

import {
  recentActivities,
  recentJobs,
} from "@/data/dashboard";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back to JobQuant"
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Jobs"
          value={128}
          icon={Briefcase}
        />

        <StatCard
          title="Active Clients"
          value={34}
          icon={Users}
        />

        <StatCard
          title="Staff Members"
          value={12}
          icon={UserCog}
        />

        <StatCard
          title="Pending Payments"
          value={8}
          icon={CreditCard}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity
          activities={recentActivities}
        />

        <QuickActions />
      </div>

      <RecentJobs jobs={recentJobs} />
    </div>
  );
}