import type { Activity } from "@/components/dashboard/RecentActivity";

export const recentActivities: Activity[] = [
  {
    id: 1,
    title: "John Smith assigned to JOB-101",
    time: "5 minutes ago",
    type: "job",
  },
  {
    id: 2,
    title: "Payment PAY-003 verified",
    time: "18 minutes ago",
    type: "payment",
  },
  {
    id: 3,
    title: "New client registered",
    time: "1 hour ago",
    type: "client",
  },
  {
    id: 4,
    title: "Vehicle branding job completed",
    time: "2 hours ago",
    type: "delivery",
  },
];

export const recentJobs = [
  {
    id: "JOB-101",
    client: "ABC Company",
    status: "Pending",
  },
  {
    id: "JOB-102",
    client: "XYZ Printers",
    status: "In Progress",
  },
  {
    id: "JOB-103",
    client: "Green Holdings",
    status: "Completed",
  },
];