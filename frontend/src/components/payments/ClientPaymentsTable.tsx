import {
    ArrowUpFromLine,
    Search,
    SlidersHorizontal,
  } from "lucide-react";
  
  import StatusBadge from "@/components/ui/StatusBadge";
  
  export interface ClientPayment {
    id: string;
    jobId: string;
    amount: number;
    status: string;
    uploaded: string;
  }
  
  interface ClientPaymentsTableProps {
    payments: ClientPayment[];
  }
  
  export default function ClientPaymentsTable({
    payments,
  }: ClientPaymentsTableProps) {
    return (
      <div className="rounded-2xl border border-[#EAEAEA] bg-white shadow-sm">
  
        {/* Toolbar */}
  
        <div className="flex flex-col gap-4 border-b border-[#EEF2F7] p-5 lg:flex-row lg:items-center lg:justify-between">
  
          <div className="relative w-full max-w-md">
  
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />
  
            <input
              type="text"
              placeholder="Search payments..."
              className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] pl-11 pr-4 text-sm outline-none transition focus:border-[#FF6B00] focus:bg-white"
            />
  
          </div>
  
          <div className="flex gap-3">
  
            <button
              title="Filter payments"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-[#475569] transition hover:bg-[#FAFAFA]"
            >
              <SlidersHorizontal size={17} />
              Filters
            </button>
  
            <button
              title="Upload payment slip"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#FF6B00] px-4 text-sm font-medium text-white transition hover:bg-[#E65C00]"
            >
              <ArrowUpFromLine size={17} />
              Upload Slip
            </button>
  
          </div>
  
        </div>
  
        {/* Title */}
  
        <div className="flex items-center justify-between border-b border-[#EEF2F7] px-6 py-5">
  
          <div>
  
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Payment History
            </h2>
  
            <p className="mt-1 text-sm text-[#64748B]">
              View all uploaded payment slips.
            </p>
  
          </div>
  
        </div>
  
        {/* Table */}
  
        <div className="overflow-x-auto">
  
          <table className="w-full">
  
            <thead className="border-b border-[#EEF2F7] bg-[#FAFAFA]">
  
              <tr>
  
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Payment ID
                </th>
  
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Job ID
                </th>
  
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Amount
                </th>
  
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Uploaded
                </th>
  
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Status
                </th>
  
              </tr>
  
            </thead>
  
            <tbody className="divide-y divide-[#EEF2F7]">
  
              {payments.map((payment) => (
  
                <tr
                  key={payment.id}
                  className="cursor-pointer transition hover:bg-[#FAFAFA]"
                >
  
                  <td className="px-6 py-5 font-semibold text-[#0F172A]">
                    {payment.id}
                  </td>
  
                  <td className="px-6 py-5 text-[#475569]">
                    {payment.jobId}
                  </td>
  
                  <td className="px-6 py-5 font-medium text-[#0F172A]">
                    {payment.amount.toLocaleString("en-LK", {
                      style: "currency",
                      currency: "LKR",
                      minimumFractionDigits: 0,
                    })}
                  </td>
  
                  <td className="px-6 py-5 text-[#64748B]">
                    {payment.uploaded}
                  </td>
  
                  <td className="px-6 py-5">
                    <StatusBadge status={payment.status} />
                  </td>
  
                </tr>
  
              ))}
  
            </tbody>
  
          </table>
  
        </div>
  
      </div>
    );
  }