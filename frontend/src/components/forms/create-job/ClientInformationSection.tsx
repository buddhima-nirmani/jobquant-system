"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useJobForm } from "./JobFormContext";

export default function ClientInformationSection() {
  const {
    clients,
    clientsLoading,
    clientId,
    setClientId,
    selectedClient,
  } = useJobForm();

  return (
    <Card className="rounded-2xl border border-[#EAEAEA] shadow-sm">
      <CardContent className="space-y-6 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF2E8] font-semibold text-[#FF6B00]">
            02
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#0F172A]">
              Client Information
            </h3>

            <p className="text-sm text-[#64748B]">
              Select an existing client. Their details fill in automatically.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            Select Client
          </label>

          <Select
            value={clientId ? String(clientId) : undefined}
            onValueChange={(value) => setClientId(Number(value))}
            disabled={clientsLoading}
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue
                placeholder={
                  clientsLoading ? "Loading clients..." : "Select a client"
                }
              />
            </SelectTrigger>

            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={String(client.id)}>
                  {client.name}
                  {client.company ? ` — ${client.company}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {!clientsLoading && clients.length === 0 && (
            <p className="text-xs text-[#94A3B8]">
              No clients found. Add a client from Client Management first.
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Company Name
            </label>

            <Input
              value={selectedClient?.company ?? ""}
              readOnly
              placeholder="—"
              className="bg-[#F8FAFC]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Email Address
            </label>

            <Input
              value={selectedClient?.email ?? ""}
              readOnly
              placeholder="—"
              className="bg-[#F8FAFC]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Contact Number
            </label>

            <Input
              value={selectedClient?.phone ?? ""}
              readOnly
              placeholder="—"
              className="bg-[#F8FAFC]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
