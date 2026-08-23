"use client";

import { useRouter } from "next/navigation";

import PageHeader from "@/components/layouts/PageHeader";

import JobInformationSection from "@/components/forms/create-job/JobInformationSection";
import ClientInformationSection from "@/components/forms/create-job/ClientInformationSection";
import AssignmentSection from "@/components/forms/create-job/AssignmentSection";
import OrderDetailsSection from "@/components/forms/create-job/OrderDetailsSection";
import PricingInformationSection from "@/components/forms/create-job/PricingInformationSection";
import NotesSection from "@/components/forms/create-job/NotesSection";

import { useJobForm } from "@/components/forms/create-job/JobFormContext";

import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function CreateJobPageContent({
  basePath,
}: {
  basePath: string;
}) {
  const router = useRouter();
  const { submitJob, isSubmitting, submitError } = useJobForm();

  async function handleCreate() {
    try {
      const job = await submitJob();
      router.push(`${basePath}/${job.id}`);
    } catch {
      // submitError is already set inside the context; nothing else to do.
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Job"
        description="Create a new printing job"
      />

      <JobInformationSection />

      <ClientInformationSection />

      <AssignmentSection />

      <OrderDetailsSection />

      <PricingInformationSection />

      <NotesSection />

      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {submitError}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <ConfirmDialog
          trigger={<Button variant="outline">Cancel</Button>}
          title="Cancel this job?"
          description="Any information you've entered will be lost and cannot be recovered."
          confirmLabel="Discard & Leave"
          onConfirm={() => router.push(basePath)}
        />

        <Button
          onClick={handleCreate}
          disabled={isSubmitting}
          className="bg-[#FF6B00] hover:bg-[#E65C00]"
        >
          {isSubmitting ? "Creating Job..." : "Create Job"}
        </Button>
      </div>
    </div>
  );
}
