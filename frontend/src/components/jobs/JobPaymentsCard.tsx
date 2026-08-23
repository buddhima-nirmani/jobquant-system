"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Trash2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/toast";

import {
  JobDetail,
  PaymentResponse,
  deletePayment,
  listPayments,
  paymentSlipUrl,
  rejectPayment,
  uploadPaymentSlip,
  verifyPayment,
} from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/format";
import type { ViewerRole } from "./JobDetailView";

function clientLabel(status: string, viewerRole: ViewerRole) {
  if (viewerRole === "client" && status === "Pending") return "Unverified";
  return status;
}

export default function JobPaymentsCard({
  job,
  viewerRole,
  canManage,
  onUpdated,
}: {
  job: JobDetail;
  viewerRole: ViewerRole;
  canManage: boolean;
  onUpdated: () => void;
}) {
  const { showToast } = useToast();
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const refetch = useCallback(() => {
    setError("");
    return listPayments({ jobId: job.id })
      .then(setPayments)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load payments.")
      );
  }, [job.id]);

  useEffect(() => {
    getCurrentUser().then((user) => setCurrentUserId(user?.id));
    setLoading(true);
    refetch().finally(() => setLoading(false));
  }, [refetch]);

  async function handleUploadSlip() {
    const amountValue = Number(amount);
    if (!amount || Number.isNaN(amountValue) || amountValue <= 0) {
      setActionError("Please enter a valid amount.");
      return;
    }

    setIsSubmitting(true);
    setActionError("");

    try {
      await uploadPaymentSlip(job.id, amountValue, method || null, selectedFile);
      setAmount("");
      setMethod("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await refetch();
      onUpdated();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to upload payment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerify(paymentId: number) {
    setActionError("");
    try {
      await verifyPayment(paymentId);
      await refetch();
      onUpdated();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to verify payment.");
    }
  }

  async function handleReject(paymentId: number) {
    const reason = window.prompt("Reason for rejecting this payment:");
    if (!reason) return;

    setActionError("");
    try {
      await rejectPayment(paymentId, reason);
      await refetch();
      onUpdated();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to reject payment.");
    }
  }

  async function handleDelete(paymentId: number) {
    try {
      await deletePayment(paymentId);
      showToast("Payment record deleted.");
      await refetch();
      onUpdated();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to delete payment.", "error");
    }
  }

  return (
    <Card className="rounded-2xl border border-[#EAEAEA] shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-[#0F172A]">Payments</h2>

        {loading && (
          <p className="mt-4 text-sm text-[#94A3B8]">Loading payments...</p>
        )}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {!loading && !error && payments.length === 0 && (
          <p className="mt-4 text-sm text-[#94A3B8]">No payments recorded yet.</p>
        )}

        <div className="mt-4 space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#EAEAEA] px-4 py-3"
            >
              <div>
                <p className="font-semibold text-[#0F172A]">
                  {formatCurrency(payment.amount)}
                </p>
                <p className="text-xs text-[#94A3B8]">
                  {payment.payment_method ?? "—"} · Uploaded by {payment.uploaded_by_name} ·{" "}
                  {new Date(payment.created_at).toLocaleDateString()}
                </p>
                {payment.status === "Rejected" && payment.rejection_reason && (
                  <p className="mt-1 text-xs text-red-600">
                    Rejected: {payment.rejection_reason}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={clientLabel(payment.status, viewerRole)} />

                <a
                  href={paymentSlipUrl(payment.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#0F172A] hover:underline"
                >
                  <Download size={12} /> Slip
                </a>

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
                        className="rounded-lg p-1.5 hover:bg-red-50"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    }
                    title="Delete this payment record?"
                    description="This removes the payment record you uploaded. This cannot be undone."
                    confirmLabel="Delete"
                    onConfirm={() => handleDelete(payment.id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {actionError && (
          <p className="mt-3 text-sm text-red-600">{actionError}</p>
        )}

        {(job.outstanding_amount ?? 0) > 0 && (
          <div className="mt-6 space-y-3 border-t border-[#F1F5F9] pt-5">
            <p className="text-sm font-semibold text-[#0F172A]">
              Upload Payment Slip
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="h-10 w-40"
              />
              <Input
                placeholder="Payment method"
                value={method}
                onChange={(event) => setMethod(event.target.value)}
                className="h-10 w-48"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(event) =>
                  setSelectedFile(event.target.files?.[0] ?? null)
                }
                className="text-sm"
              />
              <Button
                onClick={handleUploadSlip}
                disabled={isSubmitting}
                className="bg-[#FF6B00] hover:bg-[#E65C00]"
              >
                {isSubmitting ? "Uploading..." : "Upload Slip"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
