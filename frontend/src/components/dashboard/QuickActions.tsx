import {
  Plus,
  Users,
  CreditCard,
  Briefcase,
} from "lucide-react";

const actions = [
  {
    title: "Create Job",
    description: "Add a new printing job",
    icon: Plus,
  },
  {
    title: "Manage Clients",
    description: "View client records",
    icon: Users,
  },
  {
    title: "Verify Payments",
    description: "Approve client payments",
    icon: CreditCard,
  },
  {
    title: "Manage Jobs",
    description: "Track active jobs",
    icon: Briefcase,
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#0F172A]">
          Quick Actions
        </h3>

        <p className="mt-1 text-sm text-[#64748B]">
          Frequently used shortcuts
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              className="group flex items-start gap-3 rounded-xl border border-[#ECECEC] bg-white p-4 text-left transition-all duration-200 hover:border-[#FF6B00] hover:bg-[#FFF8F3] hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF2E8] transition-colors group-hover:bg-[#FF6B00]">
                <Icon
                  size={20}
                  className="text-[#FF6B00] transition-colors group-hover:text-white"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#0F172A]">
                  {action.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-[#64748B]">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}