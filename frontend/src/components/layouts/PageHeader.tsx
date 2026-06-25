import { CalendarDays } from "lucide-react";
import { typography } from "@/lib/typography";

type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      {description && (
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays
            size={16}
            className="text-[#FF6B00]"
          />

          <p className={typography.caption}>
            {description}
          </p>
        </div>
      )}

      <div className="border-l-4 border-[#FF6B00] pl-5">
        <h1 className={typography.pageTitle}>
          {title}
        </h1>

        <p className={`${typography.pageSubtitle} mt-2`}>
          Manage your printing and advertising operations from one place.
        </p>
      </div>
    </div>
  );
}