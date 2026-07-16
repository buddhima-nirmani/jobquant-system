import { LucideIcon } from "lucide-react";

interface ClientPaymentStatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

export default function ClientPaymentStatCard({
  title,
  value,
  icon: Icon,
}: ClientPaymentStatCardProps) {
  return (
    <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">
            {title}
          </p>

          <h2 className="mt-4 text-3xl font-bold text-[#0F172A]">
            {value}
          </h2>

        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF2E8]">

          <Icon
            size={22}
            className="text-[#FF6B00]"
          />

        </div>

      </div>

    </div>
  );
}