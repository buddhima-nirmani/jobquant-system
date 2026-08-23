"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import StatusBadge from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/format";
import { typography } from "@/lib/typography";
import type { JobListItem } from "@/lib/api";

type JobsTableProps = {
  jobs: JobListItem[];
  basePath: string;
  onDelete?: (jobId: number) => void;
};

export default function JobsTable({ jobs, basePath, onDelete }: JobsTableProps) {
  const router = useRouter();

  return (
    <Card className="rounded-2xl border border-[#EAEAEA] shadow-sm">
      <CardHeader className="border-b border-[#F1F5F9] pb-5">
        <CardTitle className={typography.sectionTitle}>
          All Jobs
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FAFBFC]">
              <tr className="border-b border-[#F1F5F9]">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Job
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Client
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Assigned Staff
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Due Date
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Final Cost
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Status
                </th>

                {onDelete && <th className="w-14"></th>}
              </tr>
            </thead>

            <tbody>
              {jobs.length === 0 && (
                <tr>
                  <td
                    colSpan={onDelete ? 7 : 6}
                    className="px-6 py-10 text-center text-sm text-[#94A3B8]"
                  >
                    No jobs found.
                  </td>
                </tr>
              )}

              {jobs.map((job) => (
                <tr
                  key={job.id}
                  onClick={() => router.push(`${basePath}/${job.id}`)}
                  className="cursor-pointer border-b border-[#F8FAFC] transition hover:bg-[#FFF8F3]"
                >
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-[#0F172A]">
                      {job.job_number}
                    </p>

                    <p className="mt-1 text-[15px] font-medium text-[#0F172A]">
                      {job.job_name}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    {job.client_name}
                  </td>

                  <td className="px-6 py-5 text-[#475569]">
                    {job.assigned_staff_name ?? "Unassigned"}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[#64748B]">
                      <CalendarDays size={15} />
                      {job.due_date ?? "—"}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-right font-semibold text-[#0F172A]">
                    {job.final_cost !== null
                      ? formatCurrency(job.final_cost)
                      : "—"}
                  </td>

                  <td className="px-6 py-5 text-center">
                    <StatusBadge status={job.status} />
                  </td>

                  {onDelete && (
                    <td
                      className="px-4 py-5 text-right"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <ConfirmDialog
                        trigger={
                          <button
                            type="button"
                            aria-label={`Delete ${job.job_number}`}
                            className="rounded-lg p-2 transition hover:bg-red-50"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        }
                        title="Delete this job?"
                        description={`This will permanently delete ${job.job_number} - ${job.job_name}, including its order details, designs, payments and invoices. This cannot be undone.`}
                        confirmLabel="Delete Job"
                        onConfirm={() => onDelete(job.id)}
                      />
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
