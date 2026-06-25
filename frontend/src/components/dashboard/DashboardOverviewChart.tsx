import {
    BarChart3,
    CheckCircle2,
    Clock3,
    TrendingUp,
  } from "lucide-react";
  import { typography } from "@/lib/typography";
  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const bars = [45, 72, 58, 88, 64, 95];
  
  export default function DashboardOverviewChart() {
    return (
      <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className={typography.sectionTitle}>
              Jobs Overview
            </h2>
  
            <p className={typography.sectionSubtitle}>
              Monthly printing jobs
            </p>
          </div>
  
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF2E8]">
            <BarChart3
              size={20}
              className="text-[#FF6B00]"
            />
          </div>
        </div>
  
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-[#FFF8F3] p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#FF6B00]" />
              <span className="text-xs text-[#64748B]">
                Completed
              </span>
            </div>
  
            <p className="text-2xl font-bold text-[#0F172A]">
              96
            </p>
          </div>
  
          <div className="rounded-xl bg-[#F8FAFC] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Clock3 size={16} className="text-amber-500" />
              <span className="text-xs text-[#64748B]">
                Ongoing
              </span>
            </div>
  
            <p className="text-2xl font-bold text-[#0F172A]">
              24
            </p>
          </div>
  
          <div className="rounded-xl bg-[#F0FDF4] p-4">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600" />
              <span className="text-xs text-[#64748B]">
                Delivered
              </span>
            </div>
  
            <p className="text-2xl font-bold text-[#0F172A]">
              81
            </p>
          </div>
        </div>
  
        <div className="flex h-64 items-end justify-between rounded-xl border border-[#F1F5F9] bg-[#FCFCFD] px-5 py-4">
          {bars.map((height, index) => (
            <div
              key={months[index]}
              className="flex flex-col items-center gap-3"
            >
              <div
                className="w-8 rounded-t-lg bg-[#FF6B00]"
                style={{ height: `${height * 1.8}px` }}
              />
  
              <span className="text-xs text-[#64748B]">
                {months[index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }