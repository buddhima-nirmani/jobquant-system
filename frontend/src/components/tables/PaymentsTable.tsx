import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import StatusBadge from "@/components/ui/StatusBadge";

import {
  CalendarDays,
  MoreHorizontal,
} from "lucide-react";

type Payment = {
  id: string;
  jobId: string;
  amount: number;
  status: string;
  uploaded: string;
};

type PaymentsTableProps = {
  payments: Payment[];
};

export default function PaymentsTable({
  payments,
}: PaymentsTableProps) {
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
                  Payment ID
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Job ID
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

                <th className="w-14"></th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-[#F8FAFC] transition hover:bg-[#FFF8F3]"
                >
                  <td className="px-6 py-5 font-semibold text-[#FF6B00]">
                    {payment.id}
                  </td>

                  <td className="px-6 py-5 font-medium text-[#0F172A]">
                    {payment.jobId}
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
                    <StatusBadge
                      status={payment.status}
                    />
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[#64748B]">
                      <CalendarDays
                        size={15}
                      />

                      {payment.uploaded}
                    </div>
                  </td>

                  <td className="px-4 py-5">
                    <button
                      type="button"
                      aria-label={`More actions for ${payment.id}`}
                      title="More actions"
                      className="rounded-lg p-2 transition hover:bg-[#FFF2E8]"
                    >
                      <MoreHorizontal
                        size={18}
                        className="text-[#64748B]"
                      />
                    </button>
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
