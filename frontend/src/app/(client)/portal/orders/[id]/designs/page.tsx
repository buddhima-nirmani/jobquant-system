"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  MessageSquare,
  Send,
  XCircle,
} from "lucide-react";

import PageHeader from "@/components/layouts/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";

type DesignVersion = {
  id: number;
  version: string;
  uploaded: string;
  status: "Pending" | "Approved" | "Completed";
  notes: string;
  customerFeedback: string;
  approved: boolean;
};

const initialDesigns: DesignVersion[] = [
  {
    id: 1,
    version: "Version 3",
    uploaded: "30 Jun 2026",
    status: "Pending",
    notes:
      "Updated colours and logo placement according to your previous feedback.",
    customerFeedback: "",
    approved: false,
  },
  {
    id: 2,
    version: "Version 2",
    uploaded: "28 Jun 2026",
    status: "Approved",
    notes: "Typography revised based on your feedback.",
    customerFeedback: "Looks good. Please proceed with the next stage.",
    approved: true,
  },
  {
    id: 3,
    version: "Version 1",
    uploaded: "25 Jun 2026",
    status: "Completed",
    notes: "Initial concept submitted.",
    customerFeedback:
      "Initial concept approved before requesting a revised version.",
    approved: true,
  },
];

export default function DesignVersionsPage() {
  const [designs, setDesigns] = useState(initialDesigns);

  const [feedback, setFeedback] = useState<Record<number, string>>({});

  const submitFeedback = (id: number) => {
    if (!feedback[id]?.trim()) return;

    setDesigns((prev) =>
      prev.map((design) =>
        design.id === id
          ? {
              ...design,
              customerFeedback: feedback[id],
            }
          : design,
      ),
    );
  };

  const approveDesign = (id: number) => {
    setDesigns((prev) =>
      prev.map((design) =>
        design.id === id
          ? {
              ...design,
              approved: true,
              status: "Approved",
            }
          : design,
      ),
    );
  };

  return (
    <div className="space-y-8">
      <Link
        href="/portal/orders/JQ-1045"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#64748B] transition hover:text-[#FF6B00]"
      >
        <ArrowLeft size={16} />
        Back to Order Details
      </Link>

      <PageHeader
        title="Design Versions"
        description="Review every submitted design revision for this order."
      />

      <div className="grid gap-6">
        {designs.map((design) => (
          <div
            key={design.id}
            className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
              <div className="flex gap-5">
                <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-[#FFF2E8] font-semibold text-[#FF6B00]">
                  Preview
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-[#0F172A]">
                      {design.version}
                    </h2>

                    <StatusBadge status={design.status} />
                  </div>

                  <p className="mt-2 text-sm text-[#64748B]">
                    Uploaded on {design.uploaded}
                  </p>

                  <div className="mt-5 rounded-xl bg-[#FAFAFA] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                      Designer Notes
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#475569]">
                      {design.notes}
                    </p>
                  </div>

                  <div className="mt-5 rounded-xl border border-[#EEF2F7] p-5">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={18} className="text-[#FF6B00]" />

                      <h3 className="font-semibold text-[#0F172A]">
                        Customer Feedback
                      </h3>
                    </div>
                    {design.approved ? (
                      <div className="mt-5 rounded-xl bg-[#ECFDF3] p-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={18} className="text-[#16A34A]" />

                          <p className="font-semibold text-[#15803D]">
                            Design Approved
                          </p>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-[#475569]">
                          {design.customerFeedback}
                        </p>
                      </div>
                    ) : (
                      <>
                        <textarea
                          rows={4}
                          value={feedback[design.id] || ""}
                          onChange={(e) =>
                            setFeedback({
                              ...feedback,
                              [design.id]: e.target.value,
                            })
                          }
                          placeholder="Describe any changes you would like..."
                          className="mt-5 w-full rounded-xl border border-[#E5E7EB] bg-white p-4 text-sm outline-none transition focus:border-[#FF6B00]"
                        />

                        <div className="mt-5 flex flex-wrap justify-end gap-3">
                          <button
                            onClick={() => submitFeedback(design.id)}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                          >
                            <XCircle size={16} />
                            Request Changes
                          </button>

                          <button
                            onClick={() => approveDesign(design.id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E65C00]"
                          >
                            <CheckCircle2 size={16} />
                            Approve Design
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#475569] transition hover:bg-[#FAFAFA]">
                  <Eye size={16} />
                  Preview
                </button>

                <button className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#475569] transition hover:bg-[#FAFAFA]">
                  <Download size={16} />
                  Download
                </button>

                {design.status === "Completed" && (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-[#F8FAFC] px-4 py-2 text-sm font-medium text-[#475569]">
                    <Clock3 size={16} />
                    Archived
                  </div>
                )}

                {!design.approved && (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-[#FFF7ED] px-4 py-2 text-sm font-medium text-[#EA580C]">
                    <Send size={16} />
                    Waiting for Review
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
