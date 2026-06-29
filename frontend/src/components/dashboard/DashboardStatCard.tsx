import { LucideIcon } from "lucide-react";
import { typography } from "@/lib/typography";

type DashboardStatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  largeValue?: boolean;
};

export default function DashboardStatCard({
  title,
  value,
  icon: Icon,
  largeValue = false,
}: DashboardStatCardProps) {
  return (
    <div className="group rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Header */}

      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className={typography.cardLabel}>
            {title}
          </p>
        </div>

        <div className="ml-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#FFF2E8] transition-all duration-300 group-hover:bg-[#FF6B00]">
          <Icon
            size={20}
            className="text-[#FF6B00] transition-colors duration-300 group-hover:text-white"
          />
        </div>
      </div>

      {/* Value */}

      <div className="mt-6 overflow-hidden">
        <h2
          className={`font-bold leading-none tracking-tight text-[#0F172A] ${
            largeValue
              ? "text-[1.85rem] break-words"
              : typography.cardValue
          }`}
        >
          {value}
        </h2>
      </div>
    </div>
  );
}