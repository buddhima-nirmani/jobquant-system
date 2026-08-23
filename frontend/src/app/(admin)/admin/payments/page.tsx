"use client";

import { useEffect, useState } from "react";

import PageHeader from "@/components/layouts/PageHeader";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import PaymentsTable from "@/components/tables/PaymentsTable";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PaymentResponse, listPayments } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/format";

import {
  Wallet,
  BadgeCheck,
  Clock3,
  Landmark,
} from "lucide-react";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  function refetch() {
    setLoading(true);
    listPayments({ status: statusFilter === "all" ? undefined : statusFilter })
      .then(setPayments)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load payments.")
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    getCurrentUser().then((user) => setCurrentUserId(user?.id));
  }, []);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filtered = payments.filter((payment) => {
    const term = search.toLowerCase();
    return (
      !term ||
      payment.job_number.toLowerCase().includes(term) ||
      payment.client_name.toLowerCase().includes(term)
    );
  });

  const verified = payments.filter((p) => p.status === "Verified");
  const pending = payments.filter((p) => p.status === "Pending");
  const totalRevenue = verified.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Payments"
        description="Manage client payments and payment verification."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Total Verified Revenue"
          value={formatCurrency(totalRevenue)}
          largeValue
          icon={Wallet}
        />

        <DashboardStatCard
          title="Verified Payments"
          value={verified.length}
          icon={BadgeCheck}
        />

        <DashboardStatCard
          title="Pending Payments"
          value={pending.length}
          icon={Clock3}
        />

        <DashboardStatCard
          title="Total Records"
          value={payments.length}
          icon={Landmark}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search by Job ID or Client..."
          className="h-11 w-[320px]"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-11 w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[#94A3B8]">Loading payments...</p>
      ) : (
        <PaymentsTable
          payments={filtered}
          jobBasePath="/admin/jobs"
          currentUserId={currentUserId}
          canManage
          onChanged={refetch}
        />
      )}
    </div>
  );
}
