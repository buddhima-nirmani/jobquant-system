import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: LucideIcon;
};

export default function StatCard({
  title,
  value,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="group rounded-2xl border border-[#E9E9E9] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="flex items-center justify-between p-6">

        <div className="space-y-3">

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">
            {title}
          </p>

          <h2 className="text-[42px] font-bold leading-none text-slate-900">
            {value}
          </h2>

        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF2E8] transition-all duration-300 group-hover:bg-[#FF6B00]">

          <Icon className="h-6 w-6 text-[#FF6B00] transition-all duration-300 group-hover:text-white" />

        </div>

      </CardContent>
    </Card>
  );
}