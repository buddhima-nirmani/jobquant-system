"use client";

import { useParams } from "next/navigation";

import JobDetailView from "@/components/jobs/JobDetailView";

export default function AdminJobDetailsPage() {
  const params = useParams<{ id: string }>();
  const jobId = Number(params.id);

  return (
    <JobDetailView jobId={jobId} viewerRole="admin" basePath="/admin/jobs" />
  );
}
