import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

export default function ClientInformationSection() {
  return (
    <Card className="rounded-2xl border border-[#EAEAEA] shadow-sm">
      <CardContent className="space-y-6 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF2E8] font-semibold text-[#FF6B00]">
            02
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#0F172A]">
              Client Information
            </h3>

            <p className="text-sm text-[#64748B]">
              Enter client details.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Client Name
            </label>

            <Input placeholder="John Perera" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Company Name (Optional)
            </label>

            <Input placeholder="ABC Company" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Email Address
            </label>

            <Input
              type="email"
              placeholder="john@email.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Contact Number
            </label>

            <Input placeholder="+94 77 123 4567" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}