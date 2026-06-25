import { typography } from "@/lib/typography";
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
    <div className="rounded-2xl border border-[#EAEAEA] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#F1F5F9] px-6 py-5">
        <div>
          <h2 className={typography.sectionTitle}>
            Active Jobs
          </h2>

          <p className={typography.sectionSubtitle}>
            Currently active printing jobs
          </p>
        </div>

        <button className="text-sm font-medium text-[#FF6B00] transition-colors hover:text-[#E65C00]">
          View All
        </button>
      </div>

      <div className="divide-y divide-[#F1F5F9]">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex items-center justify-between px-6 py-5 transition-colors hover:bg-[#FAFAFA]"
          >
            <div>
              <p className={`${typography.body} font-semibold text-[#0F172A]`}>
                {job.id}
              </p>

              <p className="mt-1 text-sm text-[#64748B]">
                {job.client}
              </p>
            </div>

            <StatusBadge status={job.status} />
          </div>
        ))}
      </div>
    </div>
  );
}