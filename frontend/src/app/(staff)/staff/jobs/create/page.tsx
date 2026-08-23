import CreateJobPageContent from "@/components/forms/create-job/CreateJobPageContent";
import { JobFormProvider } from "@/components/forms/create-job/JobFormContext";

export default function StaffCreateJobPage() {
  return (
    <JobFormProvider>
      <CreateJobPageContent basePath="/staff/jobs" />
    </JobFormProvider>
  );
}
