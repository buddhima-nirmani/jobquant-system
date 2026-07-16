import {
    BadgeCheck,
    Clock3,
    CreditCard,
    Wallet,
  } from "lucide-react";
  
  import ClientPaymentStatCard from "./ClientPaymentStatCard";
  
  interface Props {
    stats: {
      totalInvoices: number;
      pendingPayments: number;
      verifiedPayments: number;
      outstandingBalance: string;
    };
  }
  
  export default function ClientPaymentSummaryCards({
    stats,
  }: Props) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
  
        <ClientPaymentStatCard
          title="Total Invoices"
          value={stats.totalInvoices.toString()}
          icon={CreditCard}
        />
  
        <ClientPaymentStatCard
          title="Pending"
          value={stats.pendingPayments.toString()}
          icon={Clock3}
        />
  
        <ClientPaymentStatCard
          title="Verified"
          value={stats.verifiedPayments.toString()}
          icon={BadgeCheck}
        />
  
        <ClientPaymentStatCard
          title="Outstanding"
          value={stats.outstandingBalance}
          icon={Wallet}
        />
  
      </div>
    );
  }