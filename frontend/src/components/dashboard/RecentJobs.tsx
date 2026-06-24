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
  status: string;
}

interface RecentJobsProps {
  jobs: Job[];
}

export default function RecentJobs({
  jobs,
}: RecentJobsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Jobs</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <div>
                <p className="font-medium">
                  {job.id}
                </p>

                <p className="text-sm text-muted-foreground">
                  {job.client}
                </p>
              </div>

              <StatusBadge
                status={job.status}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}