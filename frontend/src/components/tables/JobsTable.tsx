import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import StatusBadge from "@/components/ui/StatusBadge";

interface Job {
  id: string;
  client: string;
  assignedStaff: string;
  amount: string;
  status: string;
}

interface JobsTableProps {
  jobs: Job[];
}

export default function JobsTable({
  jobs,
}: JobsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Jobs</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left">Job ID</th>
                <th className="py-3 text-left">Client</th>
                <th className="py-3 text-left">Assigned Staff</th>
                <th className="py-3 text-left">Amount</th>
                <th className="py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b hover:bg-muted/40"
                >
                  <td className="py-4 font-medium">
                    {job.id}
                  </td>

                  <td>{job.client}</td>

                  <td>{job.assignedStaff}</td>

                  <td>{job.amount}</td>

                  <td>
                    <StatusBadge
                      status={job.status}
                    />
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