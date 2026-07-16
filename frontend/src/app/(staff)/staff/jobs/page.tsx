import PageHeader from "@/components/layouts/PageHeader";
import JobsTable from "@/components/tables/JobsTable";

const staffJobs = [
  {
    id: "JQ-1045",
    title: "Acrylic Signboard",
    client: "ABC Holdings",
    assignedStaff: "Buddhima",
    dueDate: "03 Jul 2026",
    amount: 24500,
    priority: "High",
    status: "In Progress",
  },
  {
    id: "JQ-1042",
    title: "Business Cards",
    client: "Vision Tech",
    assignedStaff: "Buddhima",
    dueDate: "05 Jul 2026",
    amount: 8200,
    priority: "Medium",
    status: "Pending",
  },
  {
    id: "JQ-1038",
    title: "Vehicle Wrap",
    client: "AutoCare",
    assignedStaff: "Buddhima",
    dueDate: "28 Jun 2026",
    amount: 65000,
    priority: "High",
    status: "Completed",
  },
  {
    id: "JQ-1032",
    title: "Pull-up Banner",
    client: "Creative Studio",
    assignedStaff: "Buddhima",
    dueDate: "08 Jul 2026",
    amount: 12800,
    priority: "Low",
    status: "Printing",
  },
];

export default function StaffJobsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Job Management"
        description="Create and manage assigned printing jobs."
        date="Monday, 30 June 2026"
      />

      <JobsTable jobs={staffJobs} />
    </div>
  );
}