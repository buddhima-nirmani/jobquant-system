import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

export default function AssignmentSection() {
  return (
    <Card className="rounded-2xl border border-[#EAEAEA] shadow-sm">
      <CardContent className="space-y-6 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF2E8] font-semibold text-[#FF6B00]">
            03
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#0F172A]">
              Assignment
            </h3>

            <p className="text-sm text-[#64748B]">
              Assign the job and record who created it.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Assigned Staff */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Assigned Staff
            </label>

            <Select>
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Select Staff Member" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="john">
                  John Smith
                </SelectItem>

                <SelectItem value="sarah">
                  Sarah Lee
                </SelectItem>

                <SelectItem value="david">
                  David Silva
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Created By */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Created By
            </label>

            <Input
              value="Buddhima (Administrator)"
              readOnly
              className="h-11 bg-[#F8FAFC]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}