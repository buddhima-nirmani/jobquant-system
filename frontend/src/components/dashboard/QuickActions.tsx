import {
  Briefcase,
  CreditCard,
  Plus,
  Users,
} from "lucide-react";
import { typography } from "@/lib/typography";

const actions = [
  {
    title: "Create Job",
    description: "Create a new print job",
    icon: Plus,
  },
  {
    title: "Manage Clients",
    description: "View and edit clients",
    icon: Users,
  },
  {
    title: "Manage Jobs",
    description: "Track active jobs",
    icon: Briefcase,
  },
  {
    title: "Verify Payments",
    description: "Approve payments",
    icon: CreditCard,
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className={typography.sectionTitle}>
          Quick Actions
        </h2>

        <p className={typography.sectionSubtitle}>
          Frequently used shortcuts
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              className="group flex flex-col items-start rounded-xl border border-[#ECECEC] bg-white p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#FF6B00] hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF2E8] transition-colors duration-200 group-hover:bg-[#FF6B00]">
                <Icon
                  size={20}
                  className="text-[#FF6B00] transition-colors duration-200 group-hover:text-white"
                />
              </div>

              <h3 className={`${typography.body} font-semibold text-[#0F172A]`}>
                {action.title}
              </h3>

              <p className="mt-1 text-xs leading-5 text-[#64748B]">
                {action.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}