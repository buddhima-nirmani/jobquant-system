"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, PackageSearch, Search } from "lucide-react";

import PageHeader from "@/components/layouts/PageHeader";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import OrdersTable from "@/components/tables/OrdersTable";
import LoadingState from "@/components/ui/LoadingState";
import { JobListItem, listJobs } from "@/lib/api";

const ACTIVE_STATUSES = [
  "Pending",
  "Design",
  "Awaiting Client Approval",
  "Approved",
  "Production",
  "Ready for Delivery",
];

export default function ClientOrdersPage() {
  const [orders, setOrders] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      setError("");

      listJobs({ q: search || undefined })
        .then(setOrders)
        .catch((err) =>
          setError(err instanceof Error ? err.message : "Unable to load orders.")
        )
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Orders"
        description="View and track all your printing orders."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <DashboardStatCard
          title="Active Orders"
          value={orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length}
          icon={PackageSearch}
        />
        <DashboardStatCard
          title="Awaiting Approval"
          value={orders.filter((o) => o.status === "Awaiting Client Approval").length}
          icon={Clock3}
        />
        <DashboardStatCard
          title="Completed"
          value={orders.filter((o) => o.status === "Completed").length}
          icon={CheckCircle2}
        />
      </div>

      <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />

          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] pl-11 pr-4 text-sm outline-none transition focus:border-[#FF6B00] focus:bg-white"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingState label="Loading orders..." />
      ) : (
        <OrdersTable orders={orders} />
      )}
    </div>
  );
}
