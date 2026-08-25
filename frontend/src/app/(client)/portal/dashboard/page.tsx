"use client";

import { useEffect, useState } from "react";

import {
  CheckCircle2,
  Clock3,
  CreditCard,
  Package,
} from "lucide-react";

import PaymentSummaryCard from "@/components/cards/PaymentSummaryCard";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import RecentJobs from "@/components/dashboard/RecentJobs";
import PageHeader from "@/components/layouts/PageHeader";
import LoadingState from "@/components/ui/LoadingState";

import {
  ClientDashboard,
  JobListItem,
  getClientDashboard,
  listJobs,
} from "@/lib/api";
import { formatCurrency, todayLabel } from "@/lib/format";
import { getCurrentUser } from "@/lib/auth";

export default function ClientDashboardPage() {
  const [data, setData] = useState<ClientDashboard | null>(null);
  const [orders, setOrders] = useState<JobListItem[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCurrentUser().then((user) => setUserName(user?.name ?? ""));

    Promise.all([getClientDashboard(), listJobs()])
      .then(([dashboard, jobs]) => {
        setData(dashboard);
        setOrders(jobs.slice(0, 5));
      })
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

  const upcomingDue = orders
    .filter((order) => order.due_date && order.status !== "Completed")
    .sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1))[0];

  return (
    <div className="space-y-8">
      <PageHeader
        date={todayLabel()}
        title={`Welcome Back${userName ? `, ${userName}` : ""}!`}
        description="Track your orders, payments and latest updates."
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Active Orders"
          value={data.active_orders}
          icon={Package}
        />

        <DashboardStatCard
          title="Pending Design Approvals"
          value={data.pending_design_approvals}
          icon={Clock3}
        />

        <DashboardStatCard
          title="Completed Orders"
          value={data.completed_orders}
          icon={CheckCircle2}
        />

        <DashboardStatCard
          title="Outstanding Payments"
          value={formatCurrency(data.outstanding_payments)}
          icon={CreditCard}
          largeValue
        />
      </section>

      <RecentJobs
        jobs={orders.map((order) => ({
          id: order.id,
          jobNumber: order.job_number,
          title: order.job_name,
          client: order.status,
          status: order.status,
        }))}
        basePath="/portal/orders"
        primaryIsName
        title="Recent Orders"
        subtitle="Your latest printing orders"
        badgeText="Order"
        viewAllHref="/portal/orders"
      />

      <PaymentSummaryCard
        outstandingAmount={formatCurrency(data.outstanding_payments)}
        paidThisMonth={formatCurrency(data.paid_this_month)}
        nextDueDate={upcomingDue?.due_date ?? "—"}
      />
    </div>
  );
}
