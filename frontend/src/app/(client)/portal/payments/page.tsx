import PageHeader from "@/components/layouts/PageHeader";

import ClientPaymentSummaryCards from "@/components/payments/ClientPaymentSummaryCards";
import ClientPaymentsTable from "@/components/payments/ClientPaymentsTable";

import {
  paymentStats,
  payments,
} from "@/data/payments";

export default function ClientPaymentsPage() {
  return (
    <div className="space-y-8">

      <PageHeader
        title="Payments"
        description="Manage invoices and payment slips."
      />

      {/* KPI Cards */}

      <ClientPaymentSummaryCards
        stats={paymentStats}
      />

      {/* Payments */}

      <ClientPaymentsTable
        payments={payments}
      />

    </div>
  );
}