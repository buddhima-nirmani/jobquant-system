import {
  BarChart3,
  CheckCircle2,
  Clock3,
  TrendingUp,
} from "lucide-react";
import { typography } from "@/lib/typography";
import type { TrendPoint } from "@/lib/api";
import JobsTrendChart from "./JobsTrendChart";

type DashboardOverviewChartProps = {
  pending: number;
  inProgress: number;
  completed: number;
  trend: TrendPoint[];
};

export default function DashboardOverviewChart({
  pending,
  inProgress,
  completed,
  trend,
}: DashboardOverviewChartProps) {
  const total = pending + inProgress + completed || 1;
  const segments = [
    { label: "Pending", value: pending, color: "bg-amber-400" },
    { label: "In Progress", value: inProgress, color: "bg-[#FF6B00]" },
    { label: "Completed", value: completed, color: "bg-green-500" },
  ];

  return (
    <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className={typography.sectionTitle}>Jobs Overview</h2>
          <p className={typography.sectionSubtitle}>
            Current pipeline breakdown
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF2E8]">
          <BarChart3 size={20} className="text-[#FF6B00]" />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-[#F8FAFC] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Clock3 size={16} className="text-amber-500" />
            <span className="text-xs text-[#64748B]">Pending</span>
          </div>
          <p className="text-2xl font-bold text-[#0F172A]">{pending}</p>
        </div>

        <div className="rounded-xl bg-[#FFF8F3] p-4">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#FF6B00]" />
            <span className="text-xs text-[#64748B]">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-[#0F172A]">{inProgress}</p>
        </div>

        <div className="rounded-xl bg-[#F0FDF4] p-4">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-600" />
            <span className="text-xs text-[#64748B]">Completed</span>
          </div>
          <p className="text-2xl font-bold text-[#0F172A]">{completed}</p>
        </div>
      </div>

      <div className="flex h-4 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={segment.color}
            style={{ width: `${(segment.value / total) * 100}%` }}
            title={`${segment.label}: ${segment.value}`}
          />
        ))}
      </div>

      <div className="mt-6 border-t border-[#F1F5F9] pt-5">
        <p className="mb-1 text-sm font-semibold text-[#0F172A]">
          Created vs Completed (last 8 weeks)
        </p>
        {trend.length === 0 ? (
          <p className="text-sm text-[#94A3B8]">Not enough data yet.</p>
        ) : (
          <JobsTrendChart points={trend} />
        )}
      </div>
    </div>
  );
}
