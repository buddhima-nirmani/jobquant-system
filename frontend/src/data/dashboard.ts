import type { Activity } from "@/components/dashboard/RecentActivity";

export const recentActivities: Activity[] = [
  {
    id: 1,
    title: "John Smith assigned to Vehicle Branding - Toyota Hilux",
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
    title: "Corporate Office Signage completed",
    time: "2 hours ago",
    type: "delivery",
  },
];

export const recentJobs = [
  {
    id: "JQ-101",
    title: "Vehicle Branding - Toyota Hilux",
    client: "ABC Company",
    status: "Pending",
  },
  {
    id: "JQ-102",
    title: "Outdoor LED Billboard Installation",
    client: "XYZ Printers",
    status: "In Progress",
  },
  {
    id: "JQ-103",
    title: "Corporate Office Signage",
    client: "Green Holdings",
    status: "Completed",
  },
];