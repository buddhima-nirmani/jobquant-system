import PageHeader from "@/components/layouts/PageHeader";
import PaymentsTable from "@/components/tables/PaymentsTable";

const payments = [
  {
    id: "PAY-001",
    jobId: "JQ-1045",
    amount: 24500,
    status: "Paid",
    uploaded: "28 Jun 2026",
  },
  {
    id: "PAY-002",
    jobId: "JQ-1042",
    amount: 8200,
    status: "Pending",
    uploaded: "29 Jun 2026",
  },
  {
    id: "PAY-003",
    jobId: "JQ-1038",
    amount: 65000,
    status: "Paid",
    uploaded: "30 Jun 2026",
  },
  {
    id: "PAY-004",
    jobId: "JQ-1032",
    amount: 12800,
    status: "Pending",
    uploaded: "30 Jun 2026",
  },
];

export default function StaffPaymentsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Payments"
        description="View and manage payment records."
        date="Monday, 30 June 2026"
      />

      <PaymentsTable payments={payments} />
    </div>
  );
}