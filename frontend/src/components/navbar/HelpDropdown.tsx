"use client";

import { useState } from "react";

import {
  CircleHelp,
  BookOpen,
  PhoneCall,
  Info,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  children: React.ReactNode;
};

type PanelKey = "support" | "faq" | "about" | null;

const faqs = [
  {
    q: "How do I track the progress of my job?",
    a: "Open the job from your dashboard or orders list — the Progress section shows the current stage and full history.",
  },
  {
    q: "How is my job's cost decided?",
    a: "Staff/Admin generate a machine-learning cost prediction from your job's specifications, then confirm a Final Approved Cost — that final amount is what you're billed.",
  },
  {
    q: "When can I download the final, unwatermarked design?",
    a: "Once your payment for the job has been fully verified, the original design file becomes available for download.",
  },
  {
    q: "How do I request a change to a design?",
    a: "On the job's design section, use \"Request Revision\" and describe the change — the assigned staff member will be notified.",
  },
];

export default function HelpDropdown({ children }: Props) {
  const [panel, setPanel] = useState<PanelKey>(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-72 rounded-xl border-[#EAEAEA]"
        >
          <div className="px-4 py-3">
            <p className="font-semibold text-[#0F172A]">Help Center</p>
            <p className="text-sm text-[#64748B]">Need assistance?</p>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-[#94A3B8]" disabled>
            <BookOpen className="mr-2 h-4 w-4" />
            User Guide (coming soon)
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setPanel("support")}
          >
            <PhoneCall className="mr-2 h-4 w-4" />
            Contact Support
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setPanel("faq")}
          >
            <CircleHelp className="mr-2 h-4 w-4" />
            FAQ
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setPanel("about")}
          >
            <Info className="mr-2 h-4 w-4" />
            About JobQuant
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={panel === "support"} onOpenChange={(open) => !open && setPanel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
            <DialogDescription>
              Reach Hansi Graphics & Advertising directly for help with your account or an order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm text-[#334155]">
            <p><strong>Email:</strong> hansigraphics@gmail.com</p>
            <p><strong>Phone:</strong> 0753 661 661</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={panel === "faq"} onOpenChange={(open) => !open && setPanel(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Frequently Asked Questions</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 space-y-4 overflow-y-auto text-sm">
            {faqs.map((item) => (
              <div key={item.q}>
                <p className="font-semibold text-[#0F172A]">{item.q}</p>
                <p className="mt-1 text-[#64748B]">{item.a}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={panel === "about"} onOpenChange={(open) => !open && setPanel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About JobQuant</DialogTitle>
            <DialogDescription>
              A web-based job management system with machine-learning cost prediction, built
              for small-scale advertising and printing firms.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-[#64748B]">
            JobQuant brings job tracking, design approvals, payments and invoicing into one
            platform for Hansi Graphics &amp; Advertising (Pvt) Ltd.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
