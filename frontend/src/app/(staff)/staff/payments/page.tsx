"use client";

import { useEffect, useState } from "react";

import PageHeader from "@/components/layouts/PageHeader";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import PaymentsTable from "@/components/tables/PaymentsTable";
import { Input } from "@/components/ui/input";

import { PaymentResponse, listPayments } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/format";

import { Wallet, BadgeCheck, Clock3 } from "lucide-react";

export default function StaffPaymentsPage() {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  function refetch() {
    setLoading(true);
    listPayments()
      .then(setPayments)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load payments.")
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    getCurrentUser().then((user) => setCurrentUserId(user?.id));
    refetch();
  }, []);

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
  const totalVerified = verified.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Payments"
        description="View and manage payment records for your jobs."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <DashboardStatCard
          title="Verified Total"
          value={formatCurrency(totalVerified)}
          largeValue
          icon={Wallet}
        />
        <DashboardStatCard title="Verified" value={verified.length} icon={BadgeCheck} />
        <DashboardStatCard title="Pending" value={pending.length} icon={Clock3} />
      </div>

      <Input
        placeholder="Search by Job ID or Client..."
        className="h-11 w-[320px]"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

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
          jobBasePath="/staff/jobs"
          currentUserId={currentUserId}
          canManage
          onChanged={refetch}
        />
      )}
    </div>
  );
}
