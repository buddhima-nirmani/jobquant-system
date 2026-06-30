import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
} from "lucide-react";

import { typography } from "@/lib/typography";

interface PaymentSummaryCardProps {
  outstandingAmount: string;
  paidThisMonth: string;
  nextDueDate: string;
  href?: string;
}

export default function PaymentSummaryCard({
  outstandingAmount,
  paidThisMonth,
  nextDueDate,
  href = "/portal/payments",
}: PaymentSummaryCardProps) {
  return (
    <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <h2 className={typography.sectionTitle}>
            Payment Summary
          </h2>

          <p className={typography.sectionSubtitle}>
            Overview of your account payments
          </p>

        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF2E8]">

          <CreditCard
            size={20}
            className="text-[#FF6B00]"
          />

        </div>

      </div>

      <div className="mt-8">

        <p className="text-sm text-[#64748B]">
          Outstanding Balance
        </p>

        <h3 className="mt-2 text-3xl font-bold text-[#0F172A]">
          {outstandingAmount}
        </h3>

      </div>

      <div className="my-6 h-px bg-[#EEF2F7]" />

      <div className="flex items-center justify-between">

        <span className="text-sm text-[#64748B]">
          Paid This Month
        </span>

        <span className="font-semibold text-[#0F172A]">
          {paidThisMonth}
        </span>

      </div>

      <div className="mt-4 flex items-center justify-between">

        <span className="flex items-center gap-2 text-sm text-[#64748B]">

          <CalendarDays
            size={15}
            className="text-[#FF6B00]"
          />

          Next Due

        </span>

        <span className="font-semibold text-[#0F172A]">
          {nextDueDate}
        </span>

      </div>

      <Link
        href={href}
        className="mt-8 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#FF6B00] font-medium text-white transition hover:bg-[#E65C00]"
      >

        View Payments

        <ArrowRight size={18} />

      </Link>

    </div>
  );
}