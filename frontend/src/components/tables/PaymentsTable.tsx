"use client";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/toast";

import { CalendarDays, Trash2 } from "lucide-react";

import {
  PaymentResponse,
  deletePayment,
  rejectPayment,
  verifyPayment,
} from "@/lib/api";

type PaymentsTableProps = {
  payments: PaymentResponse[];
  jobBasePath: string;
  currentUserId?: number;
  canManage?: boolean;
  onChanged?: () => void;
};

export default function PaymentsTable({
  payments,
  jobBasePath,
  currentUserId,
  canManage = false,
  onChanged,
}: PaymentsTableProps) {
  const { showToast } = useToast();

  async function handleVerify(id: number) {
    try {
      await verifyPayment(id);
      showToast("Payment marked as verified.");
      onChanged?.();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to verify payment.", "error");
    }
  }

  async function handleReject(id: number) {
    const reason = window.prompt("Reason for rejecting this payment:");
    if (!reason) return;
    try {
      await rejectPayment(id, reason);
      showToast("Payment rejected.");
      onChanged?.();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to reject payment.", "error");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deletePayment(id);
      showToast("Payment record deleted.");
      onChanged?.();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to delete payment.", "error");
    }
  }

  return (
    <Card className="rounded-2xl border border-[#EAEAEA] shadow-sm">
      <CardHeader className="border-b border-[#F1F5F9] pb-5">
        <CardTitle className="text-xl font-semibold text-[#0F172A]">
          All Payments
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FAFBFC]">
              <tr className="border-b border-[#F1F5F9]">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Job
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Amount
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Uploaded
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-[#94A3B8]">
                    No payments found.
                  </td>
                </tr>
              )}

              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-[#F8FAFC] transition hover:bg-[#FFF8F3]"
                >
                  <td className="px-6 py-5 font-semibold text-[#FF6B00]">
                    {payment.job_number}
                  </td>

                  <td className="px-6 py-5 font-medium text-[#0F172A]">
                    {payment.client_name}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                        LKR
                      </span>
                      <span className="text-lg font-bold text-[#0F172A]">
                        {payment.amount.toLocaleString()}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <StatusBadge status={payment.status} />
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[#64748B]">
                      <CalendarDays size={15} />
                      {new Date(payment.created_at).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="px-4 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`${jobBasePath}/${payment.job_id}`}
                        className="text-sm font-medium text-[#FF6B00] hover:underline"
                      >
                        View Job
                      </Link>

                      {canManage && payment.status === "Pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleVerify(payment.id)}
                            className="bg-[#16A34A] hover:bg-[#15803D]"
                          >
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(payment.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {currentUserId === payment.uploaded_by && (
                        <ConfirmDialog
                          trigger={
                            <button
                              type="button"
                              aria-label="Delete payment"
                              className="rounded-lg p-2 transition hover:bg-red-50"
                            >
                              <Trash2 size={15} className="text-red-500" />
                            </button>
                          }
                          title="Delete this payment record?"
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
      </CardContent>
    </Card>
  );
}
