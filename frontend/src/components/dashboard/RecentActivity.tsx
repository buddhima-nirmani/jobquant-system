import Link from "next/link";

import {
  ClipboardCheck,
  CreditCard,
  Truck,
  UserPlus,
} from "lucide-react";

import { typography } from "@/lib/typography";

export type Activity = {
  id: number;
  title: string;
  time: string;
  type: "job" | "payment" | "client" | "delivery";
};

interface RecentActivityProps {
  activities: Activity[];

  title?: string;
  subtitle?: string;
  viewAllText?: string;
  viewAllHref?: string;
}

const icons = {
  job: ClipboardCheck,
  payment: CreditCard,
  client: UserPlus,
  delivery: Truck,
};

export default function RecentActivity({
  activities,
  title = "Recent Activity",
  subtitle = "Latest updates across the system",
  viewAllText,
  viewAllHref = "#",
}: RecentActivityProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-start justify-between">

        <div>

          <h2 className={typography.sectionTitle}>
            {title}
          </h2>

          <p className={typography.sectionSubtitle}>
            {subtitle}
          </p>

        </div>

        {viewAllText && (
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-[#FF6B00] transition-colors hover:text-[#E65C00]"
          >
            {viewAllText}
          </Link>
        )}

      </div>

      <div className="flex-1 space-y-5">

        {activities.map((activity, index) => {
          const Icon = icons[activity.type];

          return (
            <div key={activity.id}>

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF2E8]">

                  <Icon
                    size={18}
                    className="text-[#FF6B00]"
                  />

                </div>

                <div className="min-w-0 flex-1">

                  <p
                    className={`${typography.body} font-medium text-[#0F172A]`}
                  >
                    {activity.title}
                  </p>

                  <p className="mt-1 text-xs text-[#94A3B8]">
                    {activity.time}
                  </p>

                </div>

              </div>

              {index !== activities.length - 1 && (
                <div className="ml-[22px] mt-5 h-6 w-px bg-[#E2E8F0]" />
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
}