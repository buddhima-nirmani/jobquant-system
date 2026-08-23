"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";

import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/toast";
import { deletePayment, type PaymentResponse } from "@/lib/api";

interface ClientPaymentsTableProps {
  payments: PaymentResponse[];
  currentUserId?: number;
  onChanged?: () => void;
}

function clientLabel(status: string) {
  return status === "Pending" ? "Unverified" : status;
}

export default function ClientPaymentsTable({
  payments,
  currentUserId,
  onChanged,
}: ClientPaymentsTableProps) {
  const { showToast } = useToast();

  async function handleDelete(id: number) {
    try {
      await deletePayment(id);
      showToast("Payment slip deleted.");
      onChanged?.();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to delete payment.", "error");
    }
  }

  return (
    <div className="rounded-2xl border border-[#EAEAEA] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#EEF2F7] px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A]">
            Payment History
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            View all uploaded payment slips. Upload a new slip from an
            order&apos;s details page.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-[#EEF2F7] bg-[#FAFAFA]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Job
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
              <th className="w-32"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EEF2F7]">
            {payments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-[#94A3B8]">
                  No payments uploaded yet.
                </td>
              </tr>
            )}

            {payments.map((payment) => (
              <tr key={payment.id} className="transition hover:bg-[#FAFAFA]">
                <td className="px-6 py-5 font-semibold text-[#0F172A]">
                  {payment.job_number}
                </td>

                <td className="px-6 py-5 font-medium text-[#0F172A]">
                  {payment.amount.toLocaleString("en-LK", {
                    style: "currency",
                    currency: "LKR",
                    minimumFractionDigits: 0,
                  })}
                </td>

                <td className="px-6 py-5 text-[#64748B]">
                  {new Date(payment.created_at).toLocaleDateString()}
                </td>

                <td className="px-6 py-5">
                  <StatusBadge status={clientLabel(payment.status)} />
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/portal/orders/${payment.job_id}`}
                      className="text-sm font-medium text-[#FF6B00] hover:underline"
                    >
                      View Order
                    </Link>

                    {currentUserId === payment.uploaded_by && (
                      <ConfirmDialog
                        trigger={
                          <button
                            type="button"
                            aria-label="Delete payment slip"
                            className="rounded-lg p-1.5 transition hover:bg-red-50"
                          >
                            <Trash2 size={15} className="text-red-500" />
                          </button>
                        }
                        title="Delete this payment slip?"
                        description="This removes the payment slip you uploaded. This cannot be undone."
                        confirmLabel="Delete"
                        onConfirm={() => handleDelete(payment.id)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
