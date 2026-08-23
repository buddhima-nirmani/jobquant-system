"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/format";
import { JobDetail, getJob } from "@/lib/api";

import JobProgressCard from "./JobProgressCard";
import JobDesignsCard from "./JobDesignsCard";
import JobPaymentsCard from "./JobPaymentsCard";
import JobInvoiceCard from "./JobInvoiceCard";
import EditJobDialog from "./EditJobDialog";
import EditOrderItemsDialog from "./EditOrderItemsDialog";

export type ViewerRole = "admin" | "staff" | "client";

type JobDetailViewProps = {
  jobId: number;
  viewerRole: ViewerRole;
  basePath: string;
};

export default function JobDetailView({
  jobId,
  viewerRole,
  basePath,
}: JobDetailViewProps) {
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(() => {
    setError("");
    return getJob(jobId)
      .then(setJob)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load job.")
      );
  }, [jobId]);

  useEffect(() => {
    setLoading(true);
    refetch().finally(() => setLoading(false));
  }, [refetch]);

  const canManage = viewerRole === "admin" || viewerRole === "staff";

  if (loading) {
    return <p className="text-sm text-[#94A3B8]">Loading job details...</p>;
  }

  if (error || !job) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        {error || "Job not found."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href={basePath}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#64748B] transition hover:text-[#FF6B00]"
      >
        <ArrowLeft size={16} />
        Back to Jobs
      </Link>

      {/* Header */}
      <Card className="rounded-2xl border border-[#EAEAEA] shadow-sm">
        <CardContent className="flex flex-wrap items-start justify-between gap-4 p-6">
          <div>
            <p className="text-sm font-semibold text-[#FF6B00]">
              {job.job_number}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#0F172A]">
              {job.job_name}
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <StatusBadge status={job.status} />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                {job.priority} Priority
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-[#94A3B8]">
                Final Approved Cost
              </p>
              <p className="text-2xl font-bold text-[#0F172A]">
                {job.final_cost !== null ? formatCurrency(job.final_cost) : "—"}
              </p>
            </div>

            {canManage && <EditJobDialog job={job} onUpdated={refetch} />}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Job Summary */}
        <Card className="rounded-2xl border border-[#EAEAEA] shadow-sm xl:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Job Summary
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <SummaryField label="Client" value={job.client.name} />
              <SummaryField
                label="Assigned Staff"
                value={job.assigned_staff?.name ?? "Unassigned"}
              />
              <SummaryField label="Created By" value={job.created_by.name} />
              <SummaryField label="Order Date" value={job.order_date} />
              <SummaryField label="Due Date" value={job.due_date ?? "—"} />
              <SummaryField label="Job Type" value={job.job_type ?? "—"} />
            </div>

            {job.notes && (
              <div className="mt-6 rounded-xl border border-[#EAEAEA] bg-[#FAFBFC] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                  Notes
                </p>
                <p className="mt-1 text-sm text-[#334155]">{job.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="rounded-2xl border border-[#EAEAEA] shadow-sm">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold text-[#0F172A]">Pricing</h2>

            {viewerRole !== "client" && (
              <SummaryField
                label="Predicted Cost"
                value={
                  job.predicted_cost !== null
                    ? formatCurrency(job.predicted_cost)
                    : "—"
                }
              />
            )}
            <SummaryField
              label="Final Approved Cost"
              value={
                job.final_cost !== null ? formatCurrency(job.final_cost) : "—"
              }
            />
            <SummaryField label="Paid" value={formatCurrency(job.paid_amount)} />
            <SummaryField
              label="Outstanding"
              value={
                job.outstanding_amount !== null
                  ? formatCurrency(job.outstanding_amount)
                  : "—"
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Order Details */}
      <Card className="rounded-2xl border border-[#EAEAEA] shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Order Details
            </h2>

            {canManage && (
              <EditOrderItemsDialog jobId={job.id} items={job.items} onUpdated={refetch} />
            )}
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F1F5F9] text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  <th className="py-2 pr-4">Product</th>
                  <th className="py-2 pr-4">Dimensions</th>
                  <th className="py-2 pr-4">Quantity</th>
                  <th className="py-2 pr-4">Material</th>
                  <th className="py-2 pr-4">Print / Lamination</th>
                  <th className="py-2 pr-4">Installation</th>
                  {viewerRole !== "client" && (
                    <th className="py-2 pr-4 text-right">Predicted Cost</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {job.items.map((item) => (
                  <tr key={item.id} className="border-b border-[#F8FAFC]">
                    <td className="py-3 pr-4 font-medium text-[#0F172A]">
                      {item.product_name}
                      <p className="text-xs font-normal text-[#94A3B8]">
                        {item.product_category}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-[#475569]">
                      {item.width} x {item.height} {item.unit} (
                      {item.area} {item.unit}²)
                    </td>
                    <td className="py-3 pr-4 text-[#475569]">
                      {item.quantity}
                    </td>
                    <td className="py-3 pr-4 text-[#475569]">
                      {item.material}
                      <p className="text-xs text-[#94A3B8]">
                        {item.specification}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-[#475569]">
                      {item.print_type} / {item.lamination}
                    </td>
                    <td className="py-3 pr-4 text-[#475569]">
                      {item.installation}
                    </td>
                    {viewerRole !== "client" && (
                      <td className="py-3 pr-4 text-right font-semibold text-[#0F172A]">
                        {item.predicted_cost !== null
                          ? formatCurrency(item.predicted_cost)
                          : "—"}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-xl border border-[#EAEAEA] bg-[#FAFBFC] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Transportation
            </p>
            <p className="mt-1 text-sm font-medium text-[#0F172A]">
              {job.transportation_required
                ? `Yes — ${job.transport_distance ?? "—"} km`
                : "No"}
            </p>
          </div>
        </CardContent>
      </Card>

      <JobProgressCard job={job} canManage={canManage} onUpdated={refetch} />

      <JobDesignsCard
        jobId={job.id}
        viewerRole={viewerRole}
        canManage={canManage}
      />

      <JobPaymentsCard
        job={job}
        viewerRole={viewerRole}
        canManage={canManage}
        onUpdated={refetch}
      />

      <JobInvoiceCard jobId={job.id} canManage={canManage} />
    </div>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-[#94A3B8]">
        {label}
      </p>
      <p className="mt-1 font-medium text-[#0F172A]">{value}</p>
    </div>
  );
}
