import {
  ClipboardCheck,
  CreditCard,
  UserPlus,
  Truck,
} from "lucide-react";

export type Activity = {
  id: number;
  title: string;
  time: string;
  type: "job" | "payment" | "client" | "delivery";
};

type Props = {
  activities: Activity[];
};

const icons = {
  job: ClipboardCheck,
  payment: CreditCard,
  client: UserPlus,
  delivery: Truck,
};

export default function RecentActivity({
  activities,
}: Props) {
  return (
    <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#0F172A]">
            Recent Activity
          </h3>

          <p className="mt-1 text-sm text-[#64748B]">
            Latest actions in the system
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {activities.map((activity) => {
          const Icon = icons[activity.type];

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF2E8]">
                <Icon
                  size={18}
                  className="text-[#FF6B00]"
                />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-[#0F172A]">
                  {activity.title}
                </p>

                <p className="mt-1 text-xs text-[#94A3B8]">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}