import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

export default function JobInformationSection() {
  return (
    <Card className="rounded-2xl border border-[#EAEAEA] shadow-sm">
      <CardContent className="space-y-6 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF2E8] font-semibold text-[#FF6B00]">
            01
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#0F172A]">
              Job Information
            </h3>

            <p className="text-sm text-[#64748B]">
              Basic details about the printing job.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            Job Name / Description
          </label>

          <Input placeholder="e.g. Vehicle Branding - Toyota Hilux" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Job ID
            </label>

            <Input placeholder="JQ-001" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Job Type
            </label>

            <Input placeholder="Banner Printing" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Order Date
            </label>

            <Input type="date" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Expected Completion
            </label>

            <Input type="date" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}