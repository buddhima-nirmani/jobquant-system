import PageHeader from "@/components/layouts/PageHeader";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import ClientsTable from "@/components/tables/ClientsTable";

import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { clients } from "@/data/clients";

import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Search,
} from "lucide-react";

export default function ClientsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Client Management"
        description="Manage and monitor all registered clients."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Total Clients"
          value={245}
          icon={Users}
        />

        <DashboardStatCard
          title="New Clients"
          value={18}
          icon={UserPlus}
        />

        <DashboardStatCard
          title="Active"
          value={228}
          icon={UserCheck}
        />

        <DashboardStatCard
          title="Inactive"
          value={17}
          icon={UserX}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />

          <Input
            placeholder="Search by client name..."
            className="pl-10 h-11 rounded-xl"
          />
        </div>

        <Button
          asChild
          className="h-11 rounded-xl bg-[#FF6B00] hover:bg-[#E55F00]"
        >
          <Link href="/admin/clients/create">
            Add Client
          </Link>
        </Button>
      </div>

      <ClientsTable clients={clients} />
    </div>
  );
}