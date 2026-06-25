import PageHeader from "@/components/layouts/PageHeader";
import StatCard from "@/components/cards/StatCard";
import PaymentsTable from "@/components/tables/PaymentsTable";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { payments } from "@/data/payments";

import {
  Wallet,
  BadgeCheck,
  Clock3,
  Landmark,
} from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="space-y-8">

      <PageHeader
        title="Payments"
        description="Manage client payments and payment verification."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Revenue"
          value="LKR 2,400,000"
          icon={Wallet}
        />

        <StatCard
          title="Verified Payments"
          value="124"
          icon={BadgeCheck}
        />

        <StatCard
          title="Pending Payments"
          value="12"
          icon={Clock3}
        />

        <StatCard
          title="This Month"
          value="LKR 320,000"
          icon={Landmark}
        />

      </div>

      <div className="flex items-center justify-between">

        <Input
          placeholder="Search payments..."
          className="max-w-md"
        />

        <Button variant="outline">
          Export Report
        </Button>

      </div>

      <PaymentsTable payments={payments} />

    </div>
  );
}