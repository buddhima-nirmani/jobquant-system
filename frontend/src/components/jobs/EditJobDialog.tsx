"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";

import { JobDetail, StaffSummary, listStaff, updateJob } from "@/lib/api";

export default function EditJobDialog({
  job,
  onUpdated,
}: {
  job: JobDetail;
  onUpdated: () => void;
}) {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [staffMembers, setStaffMembers] = useState<StaffSummary[]>([]);

  const [jobNumber, setJobNumber] = useState(job.job_number);
  const [jobName, setJobName] = useState(job.job_name);
  const [jobType, setJobType] = useState(job.job_type ?? "");
  const [priority, setPriority] = useState(job.priority);
  const [assignedStaffId, setAssignedStaffId] = useState<string>(
    job.assigned_staff ? String(job.assigned_staff.id) : ""
  );
  const [dueDate, setDueDate] = useState(job.due_date ?? "");
  const [finalCost, setFinalCost] = useState(String(job.final_cost ?? ""));
  const [notes, setNotes] = useState(job.notes ?? "");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      listStaff().then(setStaffMembers).catch(() => setStaffMembers([]));
    }
  }, [open]);

  async function handleSave() {
    setError("");
    setIsSaving(true);

    try {
      await updateJob(job.id, {
        job_number: jobNumber.trim(),
        job_name: jobName.trim(),
        job_type: jobType.trim() || null,
        priority,
        assigned_staff_id: assignedStaffId ? Number(assignedStaffId) : null,
        due_date: dueDate || null,
        final_cost: finalCost ? Number(finalCost) : undefined,
        notes: notes.trim() || null,
      });
      showToast("Job updated successfully.");
      setOpen(false);
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update job.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil size={14} className="mr-2" />
          Edit Job
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#64748B]">Job ID</label>
              <Input value={jobNumber} onChange={(e) => setJobNumber(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#64748B]">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#64748B]">Job Name</label>
            <Input value={jobName} onChange={(e) => setJobName(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#64748B]">Job Type</label>
              <Input value={jobType} onChange={(e) => setJobType(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#64748B]">Due Date</label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#64748B]">Assigned Staff</label>
            <Select value={assignedStaffId} onValueChange={setAssignedStaffId}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                {staffMembers.map((member) => (
                  <SelectItem key={member.id} value={String(member.id)}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#64748B]">
              Final Approved Cost
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={finalCost}
              onChange={(e) => setFinalCost(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#64748B]">Notes</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-20" />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#FF6B00] hover:bg-[#E65C00]"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
