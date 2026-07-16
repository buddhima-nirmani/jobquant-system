import PageHeader from "@/components/layouts/PageHeader";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import RecentJobs from "@/components/dashboard/RecentJobs";
import QuickActions from "@/components/dashboard/QuickActions";

import {
  ClipboardList,
  Clock3,
  Truck,
  CircleCheck,
} from "lucide-react";

export default function StaffDashboardPage() {
  const assignedJobs = [
    {
      id: "JQ-1045",
      title: "Acrylic Signboard",
      client: "ABC Holdings",
      status: "In Progress",
    },
    {
      id: "JQ-1042",
      title: "Business Cards",
      client: "Vision Tech",
      status: "Pending",
    },
    {
      id: "JQ-1038",
      title: "Vehicle Wrap",
      client: "AutoCare",
      status: "Completed",
    },
  ];

  const activities = [
    {
      id: 1,
      title: "Vehicle Wrap assigned to you",
      time: "15 minutes ago",
      type: "job" as const,
    },
    {
      id: 2,
      title: "Business Cards approved",
      time: "1 hour ago",
      type: "job" as const,
    },
    {
      id: 3,
      title: "Vehicle Wrap delivered",
      time: "Yesterday",
      type: "delivery" as const,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        date="Monday, 30 June 2026"
        title="Welcome Back, Buddhima!"
        description="Manage assigned jobs and monitor daily printing tasks."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Assigned Jobs"
          value="12"
          icon={ClipboardList}
        />

        <DashboardStatCard
          title="In Progress"
          value="5"
          icon={Clock3}
        />

        <DashboardStatCard
          title="Pending Delivery"
          value="3"
          icon={Truck}
        />

        <DashboardStatCard
          title="Completed Today"
          value="4"
          icon={CircleCheck}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <RecentJobs jobs={assignedJobs} />

        <RecentActivity
          activities={activities}
        />
      </div>

      <QuickActions />
    </div>
  );
}