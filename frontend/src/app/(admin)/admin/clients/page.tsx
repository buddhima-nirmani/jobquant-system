import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import PageHeader from "@/components/layouts/PageHeader";
import ClientTable from "@/components/tables/ClientTable";

import { Users, UserCheck, UserPlus, Briefcase } from "lucide-react";

import StatCard from "@/components/cards/StatCard";

import { clients } from "@/data/clients";

export default function ClientsPage() {
  return (
    <div className="space-y-6">

      <PageHeader
        title="Client Management"
        description="Manage registered clients and their project activity."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <StatCard
    title="Total Clients"
    value={125}
    icon={Users}
  />

  <StatCard
    title="Active Clients"
    value={98}
    icon={UserCheck}
  />

  <StatCard
    title="New This Month"
    value={12}
    icon={UserPlus}
  />

  <StatCard
    title="Active Jobs"
    value={34}
    icon={Briefcase}
  />
</div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search clients..."
          className="max-w-md"
        />

        <Button variant="outline">
          Export
        </Button>
      </div>

      <ClientTable clients={clients} />

    </div>
  );
}