import { CalendarDays } from "lucide-react";
import { typography } from "@/lib/typography";

interface PageHeaderProps {
  title: string;
  description: string;
  date?: string;
}

export default function PageHeader({
  title,
  description,
  date,
}: PageHeaderProps) {
  return (
    <div className="space-y-3">
      {date && (
        <div className="flex items-center gap-2 text-[#64748B]">
          <CalendarDays
            size={16}
            className="text-[#FF6B00]"
          />

          <span className="text-sm font-medium">
            {date}
          </span>
        </div>
      )}

      <div className="border-l-4 border-[#FF6B00] pl-6">
        <h1 className={typography.pageTitle}>
          {title}
        </h1>

        <p className={`${typography.pageSubtitle} mt-2`}>
          {description}
        </p>
      </div>
    </div>
  );
}