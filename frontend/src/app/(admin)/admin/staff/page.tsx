"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/layouts/PageHeader";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import StaffTable from "@/components/tables/StaffTable";
import StaffExportButton from "@/components/staff/StaffExportButton";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingState from "@/components/ui/LoadingState";

import { StaffSummary, listStaff } from "@/lib/api";

import { Users, BriefcaseBusiness, Search, Plus } from "lucide-react";

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  function refetch() {
    setLoading(true);
    listStaff(search || undefined)
      .then(setStaff)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load staff.")
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const timeout = setTimeout(refetch, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const totalStaff = staff.length;
  const currentWorkload = staff.reduce(
    (total, member) => total + member.assigned_jobs,
    0
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Staff Management"
        description="Manage staff accounts and monitor team workload."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardStatCard title="Total Staff" value={totalStaff} icon={Users} />

        <DashboardStatCard
          title="Current Workload"
          value={`${currentWorkload} Jobs`}
          icon={BriefcaseBusiness}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="relative min-w-0 max-w-md sm:flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search staff..."
            className="h-11 w-full rounded-xl pl-10"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <StaffExportButton staff={staff} />

          <Button
            asChild
            className="h-11 shrink-0 rounded-xl bg-[#FF6B00] px-5 hover:bg-[#E65C00]"
          >
            <Link href="/admin/staff/create" className="flex items-center gap-2">
              <Plus size={18} />
              Add Staff
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingState label="Loading staff..." />
      ) : (
        <StaffTable staff={staff} onChanged={refetch} />
      )}
    </div>
  );
}
