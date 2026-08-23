import CreateJobPageContent from "@/components/forms/create-job/CreateJobPageContent";
import { JobFormProvider } from "@/components/forms/create-job/JobFormContext";

export default function CreateJobPage() {
  return (
    <JobFormProvider>
      <CreateJobPageContent basePath="/admin/jobs" />
    </JobFormProvider>
  );
}
