import StatCard from "@/components/cards/StatCard";
import PageHeader from "@/components/layouts/PageHeader";

import {
  Briefcase,
  Users,
  UserCog,
  CreditCard,
} from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back to JobQuant"
      />

  

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Jobs"
          value={0}
          icon={Briefcase}
        />

        <StatCard
          title="Active Clients"
          value={0}
          icon={Users}
        />

        <StatCard
          title="Staff Members"
          value={0}
          icon={UserCog}
        />

        <StatCard
          title="Pending Payments"
          value={0}
          icon={CreditCard}
        />
      </div>
    </div>
  );
}