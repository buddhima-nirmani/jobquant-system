"use client";

import { useEffect, useState } from "react";

import PageHeader from "@/components/layouts/PageHeader";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import ClientsTable from "@/components/tables/ClientsTable";
import ExportClientsButton from "@/components/clients/ExportClientsButton";

import { Input } from "@/components/ui/input";

import { ClientSummary, listClients } from "@/lib/api";

import {
  Users,
  UserCheck,
  UserX,
  Search,
} from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  function refetch() {
    setLoading(true);
    listClients(search || undefined)
      .then(setClients)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load clients.")
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const timeout = setTimeout(refetch, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const active = clients.filter((c) => c.is_active).length;
  const inactive = clients.length - active;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Client Management"
        description="Manage and monitor all registered clients."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <DashboardStatCard title="Total Clients" value={clients.length} icon={Users} />
        <DashboardStatCard title="Active" value={active} icon={UserCheck} />
        <DashboardStatCard title="Inactive" value={inactive} icon={UserX} />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by client name..."
            className="pl-10 h-11 rounded-xl"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <ExportClientsButton clients={clients} />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[#94A3B8]">Loading clients...</p>
      ) : (
        <ClientsTable clients={clients} onChanged={refetch} />
      )}
    </div>
  );
}
