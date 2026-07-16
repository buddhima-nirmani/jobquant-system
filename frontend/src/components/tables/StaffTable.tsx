"use client";

import { Staff } from "@/data/staff";
import StaffActionsMenu from "@/components/staff/StaffActionsMenu";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StaffTableProps {
  staff: Staff[];
}

export default function StaffTable({
  staff,
}: StaffTableProps) {
  const roleStyles = {
    Manager:
      "bg-slate-100 text-slate-700 border border-slate-200",

    Receptionist:
      "bg-sky-100 text-sky-700 border border-sky-200",

    Designer:
      "bg-violet-100 text-violet-700 border border-violet-200",
  };

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
                <th className="w-[50%] px-6 py-4 text-left text-sm font-semibold text-slate-500">
                  Staff Member
                </th>

                <th className="w-[20%] px-6 py-4 text-left text-sm font-semibold text-slate-500">
                  Role
                </th>

                <th className="w-[15%] px-6 py-4 text-left text-sm font-semibold text-slate-500">
                  Current Jobs
                </th>

                <th className="w-[15%] px-6 py-4 text-right text-sm font-semibold text-slate-500">
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

                    <td className="px-6">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          roleStyles[member.role]
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>

                    <td className="px-6">
                      <span className="font-semibold text-slate-700">
                        {member.assignedJobs}
                      </span>
                    </td>

                    <td className="px-6 text-right">
                      <StaffActionsMenu member={member} />
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