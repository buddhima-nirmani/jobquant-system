"use client";

import { useState } from "react";
import { CheckCircle2, MessageSquare, XCircle } from "lucide-react";

interface DesignFeedbackProps {
  status: "Pending" | "Approved" | "Completed";
}

export default function DesignFeedback({ status }: DesignFeedbackProps) {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (status === "Approved") {
    return (
      <div className="mt-6 rounded-xl border border-[#DCFCE7] bg-[#F0FDF4] p-5">
        <div className="flex items-center gap-2 text-[#15803D]">
          <CheckCircle2 size={18} />
          <h3 className="font-semibold">Design Approved</h3>
        </div>

        <p className="mt-3 text-sm text-[#475569]">
          Thank you. This design has been approved and will proceed to
          production.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mt-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
        <div className="flex items-center gap-2 text-[#0F172A]">
          <MessageSquare size={18} />
          <h3 className="font-semibold">Feedback Submitted</h3>
        </div>

        <p className="mt-3 text-sm text-[#64748B]">&quot;{feedback}&quot;</p>

        <p className="mt-4 text-xs text-[#94A3B8]">
          The designer will review your feedback and upload a revised version.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-[#EAEAEA] p-5">
      <h3 className="font-semibold text-[#0F172A]">Your Feedback</h3>

      <textarea
        rows={4}
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Describe the changes you would like..."
        className="mt-4 w-full rounded-xl border border-[#E5E7EB] p-4 text-sm outline-none transition focus:border-[#FF6B00]"
      />

      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={() => setSubmitted(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <XCircle size={16} />
          Request Changes
        </button>

        <button className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-4 py-2 text-sm font-medium text-white hover:bg-[#E65C00]">
          <CheckCircle2 size={16} />
          Approve Design
        </button>
      </div>
    </div>
  );
}
