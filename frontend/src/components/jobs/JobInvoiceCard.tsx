"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, FileUp, Trash2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import LoadingState from "@/components/ui/LoadingState";
import { useToast } from "@/components/ui/toast";

import {
  InvoiceResponse,
  deleteInvoice,
  downloadAuthenticatedFile,
  invoiceFileUrl,
  listInvoices,
  uploadInvoice,
} from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { parseApiDate } from "@/lib/format";

export default function JobInvoiceCard({
  jobId,
  canManage,
}: {
  jobId: number;
  canManage: boolean;
}) {
  const { showToast } = useToast();
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refetch = useCallback(() => {
    setError("");
    return listInvoices(jobId)
      .then(setInvoices)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unable to load invoices.")
      );
  }, [jobId]);

  useEffect(() => {
    getCurrentUser().then((user) => setCurrentUserId(user?.id));
    setLoading(true);
    refetch().finally(() => setLoading(false));
  }, [refetch]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      await uploadInvoice(jobId, file);
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to upload invoice.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(invoiceId: number) {
    try {
      await deleteInvoice(invoiceId);
      showToast("Invoice deleted.");
      await refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to delete invoice.", "error");
    }
  }

  async function handleDownload(invoice: InvoiceResponse) {
    try {
      await downloadAuthenticatedFile(
        invoiceFileUrl(invoice.id),
        `invoice-${invoice.id}`
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to download invoice.", "error");
    }
  }

  return (
    <Card className="rounded-2xl border border-[#EAEAEA] shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0F172A]">Invoice</h2>

          {canManage && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={handleUpload}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <FileUp size={16} className="mr-2" />
                {isUploading ? "Uploading..." : "Upload Invoice"}
              </Button>
            </>
          )}
        </div>

        {loading && (
          <LoadingState label="Loading invoices..." className="mt-4" />
        )}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {!loading && !error && invoices.length === 0 && (
          <p className="mt-4 text-sm text-[#94A3B8]">
            No invoice has been uploaded for this job yet.
          </p>
        )}

        <div className="mt-4 space-y-2">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between rounded-xl border border-[#EAEAEA] px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium text-[#0F172A]">
                  Uploaded by {invoice.uploaded_by_name}
                </p>
                <p className="text-xs text-[#94A3B8]">
                  {parseApiDate(invoice.uploaded_at).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleDownload(invoice)}
                  className="inline-flex items-center gap-1 font-medium text-[#FF6B00] hover:underline"
                >
                  <Download size={14} /> Download
                </button>

                {currentUserId === invoice.uploaded_by && (
                  <ConfirmDialog
                    trigger={
                      <button
                        type="button"
                        aria-label="Delete invoice"
                        className="rounded-lg p-1.5 hover:bg-red-50"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    }
                    title="Delete this invoice?"
                    description="This removes the invoice you uploaded. This cannot be undone."
                    confirmLabel="Delete"
                    onConfirm={() => handleDelete(invoice.id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
