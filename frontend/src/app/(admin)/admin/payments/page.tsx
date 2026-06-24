import PageHeader from "@/components/layouts/PageHeader";
import StatCard from "@/components/cards/StatCard";
import PaymentsTable from "@/components/tables/PaymentsTable";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { payments } from "@/data/payments";

import {
  DollarSign,
  CreditCard,
  Clock,
  Wallet,
} from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Manage client payments and payment verification."
      />

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="LKR 2.4M"
          icon={DollarSign}
        />

        <StatCard
          title="Verified Payments"
          value={124}
          icon={CreditCard}
        />

        <StatCard
          title="Pending Payments"
          value={12}
          icon={Clock}
        />

        <StatCard
          title="This Month"
          value="LKR 320K"
          icon={Wallet}
        />
      </div>

      {/* Search + Export */}
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Search payments..."
          className="max-w-md"
        />

        <Button variant="outline">
          Export
        </Button>
      </div>

      <PaymentsTable payments={payments} />
    </div>
  );
}