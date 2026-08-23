"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useJobForm } from "./JobFormContext";

export default function JobInformationSection() {
  const {
    jobNumber,
    setJobNumber,
    jobNumberLoading,
    jobName,
    setJobName,
    jobType,
    setJobType,
    orderDate,
    setOrderDate,
    dueDate,
    setDueDate,
    priority,
    setPriority,
  } = useJobForm();

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

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Job ID
            </label>

            <Input
              placeholder={jobNumberLoading ? "Loading..." : "JQ101"}
              value={jobNumber}
              onChange={(event) => setJobNumber(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Job Name / Description
            </label>

            <Input
              placeholder="Vehicle Branding - Toyota Hilux"
              value={jobName}
              onChange={(event) => setJobName(event.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Job Type
            </label>

            <Input
              placeholder="Vehicle Branding"
              value={jobType}
              onChange={(event) => setJobType(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Priority
            </label>

            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Order Date
            </label>

            <Input
              type="date"
              value={orderDate}
              onChange={(event) => setOrderDate(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Expected Completion
            </label>

            <Input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
