import Link from "next/link";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
} from "lucide-react";

import PageHeader from "@/components/layouts/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";

const designs = [
  {
    id: 1,
    version: "Version 3",
    uploaded: "30 Jun 2026",
    status: "Pending",
    notes: "Updated colours and logo placement.",
  },
  {
    id: 2,
    version: "Version 2",
    uploaded: "28 Jun 2026",
    status: "Approved",
    notes: "Typography revised based on feedback.",
  },
  {
    id: 3,
    version: "Version 1",
    uploaded: "25 Jun 2026",
    status: "Completed",
    notes: "Initial concept submitted.",
  },
];

export default function DesignVersionsPage() {
  return (
    <div className="space-y-8">

      <Link
        href="/portal/orders/JQ-1045"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#64748B] hover:text-[#FF6B00]"
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
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex gap-5">

                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-[#FFF2E8] text-sm font-semibold text-[#FF6B00]">
                  Preview
                </div>

                <div>

                  <div className="flex items-center gap-3">

                    <h2 className="text-lg font-semibold text-[#0F172A]">
                      {design.version}
                    </h2>

                    <StatusBadge status={design.status} />

                  </div>

                  <p className="mt-2 text-sm text-[#64748B]">
                    Uploaded on {design.uploaded}
                  </p>

                  <p className="mt-4 text-sm leading-6 text-[#475569]">
                    {design.notes}
                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                <button className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#475569] transition hover:bg-[#FAFAFA]">

                  <Eye size={16} />

                  Preview

                </button>

                <button className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#475569] transition hover:bg-[#FAFAFA]">

                  <Download size={16} />

                  Download

                </button>

                {design.status === "Pending" && (

                  <button className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E65C00]">

                    <CheckCircle2 size={16} />

                    Approve

                  </button>

                )}

                {design.status === "Approved" && (

                  <div className="inline-flex items-center gap-2 rounded-xl bg-[#ECFDF3] px-4 py-2 text-sm font-medium text-[#15803D]">

                    <CheckCircle2 size={16} />

                    Approved

                  </div>

                )}

                {design.status === "Completed" && (

                  <div className="inline-flex items-center gap-2 rounded-xl bg-[#F8FAFC] px-4 py-2 text-sm font-medium text-[#475569]">

                    <Clock3 size={16} />

                    Archived

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