import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import StatusBadge from "@/components/ui/StatusBadge";

interface StaffMember {
  id: number;
  name: string;
  role: string;
  email: string;
  assignedJobs: number;
  status: string;
}

interface StaffTableProps {
  staff: StaffMember[];
}

export default function StaffTable({ staff }: StaffTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Staff Members</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left">Name</th>
                <th className="py-3 text-left">Role</th>
                <th className="py-3 text-left">Email</th>
                <th className="py-3 text-left">Assigned Jobs</th>
                <th className="py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {staff.map((member) => (
                <tr key={member.id} className="border-b hover:bg-muted/40">
                  <td className="py-4 font-medium">{member.name}</td>

                  <td>{member.role}</td>

                  <td>{member.email}</td>

                  <td>{member.assignedJobs}</td>

                  <td>
                    <StatusBadge status={member.status} />
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
