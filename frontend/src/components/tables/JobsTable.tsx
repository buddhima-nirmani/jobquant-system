import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, CalendarDays } from "lucide-react";

import StatusBadge from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/format";
import { typography } from "@/lib/typography";

type Job = {
  id: string;
  title: string;
  client: string;
  assignedStaff: string;
  dueDate: string;
  amount: number;
  priority: string;
  status: string;
};

type JobsTableProps = {
  jobs: Job[];
};

export default function JobsTable({ jobs }: JobsTableProps) {
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
                  Amount
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Status
                </th>

                <th className="w-14"></th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-[#F8FAFC] transition hover:bg-[#FFF8F3]"
                >
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-[#0F172A]">
                      {job.id}
                    </p>

                    <p className="mt-1 text-[15px] font-medium text-[#0F172A]">
                      {job.title}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    {job.client}
                  </td>

                  <td className="px-6 py-5 text-[#475569]">
                    {job.assignedStaff}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[#64748B]">
                      <CalendarDays size={15} />
                      {job.dueDate}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-right font-semibold text-[#0F172A]">
                    {formatCurrency(job.amount)}
                  </td>

                  <td className="px-6 py-5 text-center">
                    <StatusBadge status={job.status} />
                  </td>

                  <td className="px-4 py-5">
                    <button
                      type="button"
                      aria-label={`More actions for ${job.id}`}
                      className="rounded-lg p-2 transition hover:bg-[#FFF2E8]"
                    >
                      <MoreHorizontal
                        size={18}
                        className="text-[#64748B]"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}