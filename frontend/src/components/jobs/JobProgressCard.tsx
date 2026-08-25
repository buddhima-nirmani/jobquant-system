"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { JobDetail, updateJobProgress } from "@/lib/api";
import { parseApiDate } from "@/lib/format";

const JOB_STATUSES = [
  "Pending",
  "Design",
  "Awaiting Client Approval",
  "Approved",
  "Production",
  "Ready for Delivery",
  "Completed",
  "Cancelled",
];

export default function JobProgressCard({
  job,
  canManage,
  onUpdated,
}: {
  job: JobDetail;
  canManage: boolean;
  onUpdated: () => void;
}) {
  const [nextStatus, setNextStatus] = useState(job.status);
  const [note, setNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  async function handleUpdate() {
    setIsUpdating(true);
    setError("");

    try {
      await updateJobProgress(job.id, {
        status: nextStatus,
        note: note.trim() || null,
      });
      setNote("");
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update progress.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Card className="rounded-2xl border border-[#EAEAEA] shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-[#0F172A]">Progress</h2>

        {/* Timeline */}
        <div className="mt-5 flex flex-wrap gap-3">
          {JOB_STATUSES.filter((status) => status !== "Cancelled").map(
            (status) => {
              const reached = job.progress_history.some(
                (entry) => entry.status === status
              );
              const isCurrent = job.status === status;

              return (
                <span
                  key={status}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    isCurrent
                      ? "bg-[#FF6B00] text-white"
                      : reached
                      ? "bg-[#ECFDF5] text-[#16A34A]"
                      : "bg-[#F8FAFC] text-[#94A3B8]"
                  }`}
                >
                  {reached && !isCurrent && <Check size={12} />}
                  {status}
                </span>
              );
            }
          )}
        </div>

        {/* History */}
        <div className="mt-6 space-y-3 border-t border-[#F1F5F9] pt-5">
          {job.progress_history
            .slice()
            .reverse()
            .map((entry) => (
              <div key={entry.id} className="flex items-start justify-between text-sm">
                <div>
                  <p className="font-medium text-[#0F172A]">{entry.status}</p>
                  {entry.note && (
                    <p className="text-[#64748B]">{entry.note}</p>
                  )}
                  <p className="text-xs text-[#94A3B8]">
                    by {entry.updated_by_name}
                  </p>
                </div>
                <p className="text-xs text-[#94A3B8]">
                  {parseApiDate(entry.created_at).toLocaleString()}
                </p>
              </div>
            ))}
        </div>

        {/* Update control */}
        {canManage && (
          <div className="mt-6 space-y-3 border-t border-[#F1F5F9] pt-5">
            <p className="text-sm font-semibold text-[#0F172A]">
              Update Progress
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Select value={nextStatus} onValueChange={setNextStatus}>
                <SelectTrigger className="h-10 w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOB_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Optional note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="h-10 w-64"
              />

              <Button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="bg-[#FF6B00] hover:bg-[#E65C00]"
              >
                {isUpdating ? "Updating..." : "Update Stage"}
              </Button>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
