"use client";

import { useParams } from "next/navigation";

import JobDetailView from "@/components/jobs/JobDetailView";

export default function StaffJobDetailsPage() {
  const params = useParams<{ id: string }>();
  const jobId = Number(params.id);

  return (
    <JobDetailView jobId={jobId} viewerRole="staff" basePath="/staff/jobs" />
  );
}
