import PageHeader from "@/components/layouts/PageHeader";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import PaymentsTable from "@/components/tables/PaymentsTable";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

      {/* KPI Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Total Revenue"
          value="LKR 2,400,000"
          largeValue
          icon={Wallet}
        />

        <DashboardStatCard
          title="Verified Payments"
          value="124"
          icon={BadgeCheck}
        />

        <DashboardStatCard
          title="Pending Payments"
          value="12"
          icon={Clock3}
        />

        <DashboardStatCard
          title="This Month"
          value="LKR 320,000"
          largeValue
          icon={Landmark}
        />
      </div>

      {/* Search & Filters */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search by Payment ID or Job ID..."
            className="h-11 w-[360px]"
          />

          <Select>
            <SelectTrigger className="h-11 w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All Status
              </SelectItem>

              <SelectItem value="verified">
                Verified
              </SelectItem>

              <SelectItem value="pending">
                Pending
              </SelectItem>

              <SelectItem value="rejected">
                Rejected
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="bg-[#FF6B00] hover:bg-[#E55F00]">
          Export Report
        </Button>
      </div>

      {/* Payments Table */}

      <PaymentsTable payments={payments} />
    </div>
  );
}