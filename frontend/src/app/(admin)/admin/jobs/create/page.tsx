import PageHeader from "@/components/layouts/PageHeader";

import JobInformationSection from "@/components/forms/create-job/JobInformationSection";
import ClientInformationSection from "@/components/forms/create-job/ClientInformationSection";
import AssignmentSection from "@/components/forms/create-job/AssignmentSection";
import OrderDetailsSection from "@/components/forms/create-job/OrderDetailsSection";
import PricingInformationSection from "@/components/forms/create-job/PricingInformationSection";
import NotesSection from "@/components/forms/create-job/NotesSection";

import { Button } from "@/components/ui/button";

export default function CreateJobPage() {
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

      <div className="flex justify-end gap-3">
        <Button variant="outline">
          Cancel
        </Button>

        <Button>
          Create Job
        </Button>
      </div>
    </div>
  );
}