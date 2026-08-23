"use client";

import { Mail, Phone } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import StatusBadge from "@/components/ui/StatusBadge";
import type { ClientSummary } from "@/lib/api";
import { updateClient } from "@/lib/api";

type ClientsTableProps = {
  clients: ClientSummary[];
  onChanged?: () => void;
  readOnly?: boolean;
};

export default function ClientsTable({
  clients,
  onChanged,
  readOnly = false,
}: ClientsTableProps) {
  async function handleToggleActive(client: ClientSummary) {
    try {
      await updateClient(client.id, { is_active: !client.is_active });
      onChanged?.();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Unable to update client.");
    }
  }

  return (
    <Card className="rounded-2xl border-[#EAEAEA] shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl font-bold">All Clients</CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-[#F8FAFC] text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Client
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Phone
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Active Jobs
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Status
                </th>
                {!readOnly && <th className="w-32"></th>}
              </tr>
            </thead>

            <tbody>
              {clients.length === 0 && (
                <tr>
                  <td colSpan={readOnly ? 5 : 6} className="px-6 py-10 text-center text-sm text-[#94A3B8]">
                    No clients found.
                  </td>
                </tr>
              )}

              {clients.map((client) => (
                <tr key={client.id} className="border-b transition hover:bg-[#FAFAFA]">
                  <td className="px-6 py-5">
                    <p className="font-semibold text-[#0F172A]">{client.name}</p>
                    {client.company && (
                      <p className="text-sm text-[#64748B]">{client.company}</p>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[#64748B]">
                      <Mail className="h-4 w-4" />
                      {client.email}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[#64748B]">
                      <Phone className="h-4 w-4" />
                      {client.phone ?? "—"}
                    </div>
                  </td>

                  <td className="px-6 py-5 font-semibold text-[#0F172A]">
                    {client.active_jobs}
                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge status={client.is_active ? "Active" : "Inactive"} />
                  </td>

                  {!readOnly && (
                    <td className="px-6 py-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(client)}
                        className="text-sm font-medium text-[#FF6B00] hover:underline"
                      >
                        {client.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
