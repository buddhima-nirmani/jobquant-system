import Link from "next/link";

import { typography } from "@/lib/typography";
import StatusBadge from "@/components/ui/StatusBadge";

export interface RecentJobEntry {
  id: number;
  jobNumber: string;
  title: string;
  client: string;
  status: string;
}

interface RecentJobsProps {
  jobs: RecentJobEntry[];
  basePath: string;
  primaryIsName?: boolean;

  title?: string;
  subtitle?: string;
  badgeText?: string;
  viewAllText?: string;
  viewAllHref?: string;
}

export default function RecentJobs({
  jobs,
  basePath,
  primaryIsName = false,
  title = "Active Jobs",
  subtitle = "Currently active printing jobs",
  badgeText = "Active",
  viewAllText = "View All",
  viewAllHref = "#",
}: RecentJobsProps) {
  return (
    <div className="rounded-2xl border border-[#EAEAEA] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#F1F5F9] px-6 py-5">
        <div>
          <h2 className={typography.sectionTitle}>
            {title}
          </h2>

          <p className={typography.sectionSubtitle}>
            {subtitle}
          </p>
        </div>

        <Link
          href={viewAllHref}
          className="text-sm font-medium text-[#FF6B00] transition-colors hover:text-[#E65C00]"
        >
          {viewAllText}
        </Link>
      </div>

      <div className="divide-y divide-[#F1F5F9]">
        {jobs.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-[#94A3B8]">
            No jobs to show yet.
          </p>
        )}

        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`${basePath}/${job.id}`}
            className="flex items-center justify-between px-6 py-5 transition-colors hover:bg-[#FAFAFA]"
          >
            <div>
              {primaryIsName ? (
                <>
                  <p className={`${typography.body} font-semibold text-[#0F172A]`}>
                    {job.title}
                  </p>
                  <p className="mt-1 text-sm text-[#64748B]">{job.jobNumber}</p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <p className={`${typography.body} font-semibold text-[#0F172A]`}>
                      {job.jobNumber}
                    </p>

                    <span className="rounded-full bg-[#FFF2E8] px-2 py-1 text-[11px] font-medium text-[#FF6B00]">
                      {badgeText}
                    </span>
                  </div>

                  <p className="mt-2 text-[15px] font-medium text-[#0F172A]">
                    {job.title}
                  </p>

                  <p className="mt-1 text-sm text-[#64748B]">
                    {job.client}
                  </p>
                </>
              )}
            </div>

            <StatusBadge status={job.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
