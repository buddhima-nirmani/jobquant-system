import {
  CheckCircle2,
  Clock3,
  CreditCard,
  Package,
} from "lucide-react";

import PaymentSummaryCard from "@/components/cards/PaymentSummaryCard";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import RecentActivity, {
  Activity,
} from "@/components/dashboard/RecentActivity";
import RecentJobs from "@/components/dashboard/RecentJobs";
import PageHeader from "@/components/layouts/PageHeader";

const recentOrders = [
  {
    id: "JQ-1045",
    title: "Acrylic Signboard",
    client: "Estimated completion: 03 Jul 2026",
    status: "In Progress",
  },
  {
    id: "JQ-1042",
    title: "Business Cards",
    client: "Waiting for your approval",
    status: "Pending",
  },
  {
    id: "JQ-1038",
    title: "Vehicle Wrap",
    client: "Ready for collection",
    status: "Completed",
  },
  {
    id: "JQ-1032",
    title: "Pull-up Banner",
    client: "Printing in progress",
    status: "In Progress",
  },
];

const activities: Activity[] = [
  {
    id: 1,
    title: "Design Version 3 uploaded for Acrylic Signboard",
    time: "10 minutes ago",
    type: "job",
  },
  {
    id: 2,
    title: "Payment of LKR 15,000 received",
    time: "Yesterday",
    type: "payment",
  },
  {
    id: 3,
    title: "Vehicle Wrap is ready for collection",
    time: "2 days ago",
    type: "delivery",
  },
  {
    id: 4,
    title: "Business Card artwork awaiting approval",
    time: "3 days ago",
    type: "job",
  },
];

export default function ClientDashboardPage() {
  return (
    <div className="space-y-8">

<PageHeader
  title="Welcome Back, Nirmani!"
  description="Track your orders, payments and latest updates."
  date="Monday, 30 June 2026"
/>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <DashboardStatCard
          title="Active Orders"
          value={4}
          icon={Package}
        />

        <DashboardStatCard
          title="Pending Approval"
          value={2}
          icon={Clock3}
        />

        <DashboardStatCard
          title="Completed Orders"
          value={18}
          icon={CheckCircle2}
        />

        <DashboardStatCard
          title="Outstanding Payments"
          value="LKR 24,500"
          icon={CreditCard}
          largeValue
        />

      </section>

      <section className="grid gap-6 xl:grid-cols-3">

        <div className="xl:col-span-2">

          <RecentJobs
            jobs={recentOrders}
            title="Recent Orders"
            subtitle="Your latest printing orders"
            badgeText="Order"
            viewAllHref="/portal/orders"
          />

        </div>

        <RecentActivity
          activities={activities}
          title="Latest Updates"
          subtitle="Recent updates on your orders"
          viewAllText="View Orders"
          viewAllHref="/portal/orders"
        />

      </section>

      <PaymentSummaryCard
        outstandingAmount="LKR 24,500"
        paidThisMonth="LKR 18,000"
        nextDueDate="05 Jul 2026"
      />

    </div>
  );
}