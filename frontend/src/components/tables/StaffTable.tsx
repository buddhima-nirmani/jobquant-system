"use client";

import type { StaffSummary } from "@/lib/api";
import StaffActionsMenu from "@/components/staff/StaffActionsMenu";
import StatusBadge from "@/components/ui/StatusBadge";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StaffTableProps {
  staff: StaffSummary[];
  onChanged: () => void;
}

export default function StaffTable({ staff, onChanged }: StaffTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <CardHeader className="border-b bg-white px-6 py-5">
        <CardTitle className="text-xl font-semibold">
          Staff Members
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="w-[45%] px-6 py-4 text-left text-sm font-semibold text-slate-500">
                  Staff Member
                </th>
                <th className="w-[15%] px-6 py-4 text-left text-sm font-semibold text-slate-500">
                  Status
                </th>
                <th className="w-[20%] px-6 py-4 text-left text-sm font-semibold text-slate-500">
                  Assigned Jobs
                </th>
                <th className="w-[20%] px-6 py-4 text-right text-sm font-semibold text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {staff.map((member) => {
                const initials = member.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <tr
                    key={member.id}
                    className="border-t transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF2E8] font-semibold text-[#FF6B00]">
                          {initials}
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            {member.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={member.is_active ? "Active" : "Inactive"} />
                    </td>

                    <td className="px-6 py-5">
                      <span className="font-semibold text-slate-700">
                        {member.assigned_jobs}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <StaffActionsMenu member={member} onChanged={onChanged} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {staff.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <h3 className="text-lg font-semibold text-slate-700">
                No staff members found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Add a staff member to get started.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
