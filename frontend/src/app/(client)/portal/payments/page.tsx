"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import PageHeader from "@/components/layouts/PageHeader";

import ClientPaymentSummaryCards from "@/components/payments/ClientPaymentSummaryCards";
import ClientPaymentsTable from "@/components/payments/ClientPaymentsTable";

import { PaymentResponse, listPayments } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { formatLKR } from "@/lib/currency";

export default function ClientPaymentsPage() {
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

  const filtered = payments.filter((payment) =>
    payment.job_number.toLowerCase().includes(search.toLowerCase())
  );

  const verified = payments.filter((p) => p.status === "Verified");
  const pending = payments.filter((p) => p.status === "Pending");
  const outstanding = pending.reduce((sum, p) => sum + p.amount, 0);

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
          outstandingBalance: formatLKR(outstanding),
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
        <p className="text-sm text-[#94A3B8]">Loading payments...</p>
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
