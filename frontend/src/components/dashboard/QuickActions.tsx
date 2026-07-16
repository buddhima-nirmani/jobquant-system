import Link from "next/link";
import { ArrowRight, Plus, UserPlus } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Create New Job",
      description: "Create a new print job",
      href: "/admin/jobs/create",
      icon: Plus,
    },
    {
      title: "Add Staff Member",
      description: "Invite a new team member",
      href: "/admin/staff",
      icon: UserPlus,
    },
  ];

  return (
    <section className="rounded-2xl border border-[#E9E9E9] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-[28px] font-semibold text-[#0F172A]">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-[#64748B]">
          Shortcuts to common workflows
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center justify-between rounded-2xl border border-[#ECECEC] p-6 transition-all hover:border-[#FF6B00] hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF2E8]">
                  <Icon
                    size={22}
                    className="text-[#FF6B00]"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#0F172A]">
                    {action.title}
                  </h3>

                  <p className="mt-1 text-sm text-[#64748B]">
                    {action.description}
                  </p>
                </div>
              </div>

              <ArrowRight
                size={20}
                className="text-[#CBD5E1] transition-all group-hover:translate-x-1 group-hover:text-[#FF6B00]"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}