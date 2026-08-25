"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import PageHeader from "@/components/layouts/PageHeader";
import LoadingState from "@/components/ui/LoadingState";

import ClientPaymentSummaryCards from "@/components/payments/ClientPaymentSummaryCards";
import ClientPaymentsTable from "@/components/payments/ClientPaymentsTable";

import { PaymentResponse, getClientDashboard, listPayments } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/format";

export default function ClientPaymentsPage() {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [outstanding, setOutstanding] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  function refetch() {
    setLoading(true);
    Promise.all([listPayments(), getClientDashboard()])
      .then(([paymentsData, dashboard]) => {
        setPayments(paymentsData);
        setOutstanding(dashboard.outstanding_payments);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load payments.")
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    getCurrentUser().then((user) => setCurrentUserId(user?.id));
    refetch();
  }, []);

  const filtered = payments.filter((payment) =>
    payment.job_number.toLowerCase().includes(search.toLowerCase())
  );

  const verified = payments.filter((p) => p.status === "Verified");
  const pending = payments.filter((p) => p.status === "Pending");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Payments"
        description="Manage invoices and payment slips."
      />

      <ClientPaymentSummaryCards
        stats={{
          totalInvoices: payments.length,
          pendingPayments: pending.length,
          verifiedPayments: verified.length,
          outstandingBalance: formatCurrency(outstanding),
        }}
      />

      <div className="relative w-full max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
        />
        <input
          type="text"
          placeholder="Search by Job ID..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] pl-11 pr-4 text-sm outline-none transition focus:border-[#FF6B00] focus:bg-white"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingState label="Loading payments..." />
      ) : (
        <ClientPaymentsTable
          payments={filtered}
          currentUserId={currentUserId}
          onChanged={refetch}
        />
      )}
    </div>
  );
}
