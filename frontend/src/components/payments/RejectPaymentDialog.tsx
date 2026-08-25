"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type RejectPaymentDialogProps = {
  trigger: React.ReactNode;
  onConfirm: (reason: string) => void | Promise<void>;
};

export default function RejectPaymentDialog({
  trigger,
  onConfirm,
}: RejectPaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setReason("");
  }

  async function handleConfirm() {
    if (!reason.trim()) return;

    setIsSubmitting(true);
    try {
      await onConfirm(reason.trim());
      setReason("");
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject this payment?</DialogTitle>
          <DialogDescription>
            Let the client know why this payment slip couldn&apos;t be verified —
            they&apos;ll see this reason and can upload a corrected slip.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="e.g. The amount on the slip doesn't match the order total."
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className="min-h-24"
          autoFocus
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting || !reason.trim()}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isSubmitting ? "Rejecting..." : "Reject Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
