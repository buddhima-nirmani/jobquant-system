import { LucideIcon } from "lucide-react";

type DashboardStatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
};

export default function DashboardStatCard({
  title,
  value,
  icon: Icon,
  subtitle,
}: DashboardStatCardProps) {
  return (
    <div className="group h-[145px] rounded-2xl border border-[#E9ECEF] bg-white px-7 py-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-full items-center justify-between">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.20em] text-[#64748B]">
            {title}
          </p>

          <h2 className="mt-4 text-[42px] font-bold leading-none text-[#0F172A]">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-[#64748B]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF2E8] transition-all duration-200 group-hover:bg-[#FF6B00]">
          <Icon
            size={22}
            className="text-[#FF6B00] transition-colors duration-200 group-hover:text-white"
          />
        </div>
      </div>
    </div>
  );
}