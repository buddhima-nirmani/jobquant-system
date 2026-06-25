import { LucideIcon } from "lucide-react";
import { typography } from "@/lib/typography";

type DashboardStatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
};

export default function DashboardStatCard({
  title,
  value,
  icon: Icon,
}: DashboardStatCardProps) {
  return (
    <div className="group rounded-2xl border border-[#EAEAEA] bg-white px-6 py-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className={typography.cardLabel}>
            {title}
          </p>

          <h2 className={`mt-4 ${typography.cardValue}`}>
            {value}
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF2E8] transition-colors duration-300 group-hover:bg-[#FF6B00]">
          <Icon
            size={18}
            className="text-[#FF6B00] transition-colors duration-300 group-hover:text-white"
          />
        </div>
      </div>
    </div>
  );
}