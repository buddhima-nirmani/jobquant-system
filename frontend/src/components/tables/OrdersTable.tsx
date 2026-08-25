"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import StatusBadge from "@/components/ui/StatusBadge";
import type { JobListItem } from "@/lib/api";

interface OrdersTableProps {
  orders: JobListItem[];
}

function paymentStatus(order: JobListItem): string {
  if (order.final_cost === null || order.final_cost === 0) return "—";
  if (order.paid_amount <= 0) return "Unpaid";
  if ((order.outstanding_amount ?? 0) <= 0) return "Verified";
  return "Pending";
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-2xl border border-[#EAEAEA] bg-white shadow-sm">
      <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-[#EEF2F7] bg-[#FAFAFA]">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Job
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Order Date
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Due Date
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Payment
            </th>
            <th className="w-14"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#EEF2F7]">
          {orders.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-10 text-center text-sm text-[#94A3B8]"
              >
                No orders found.
              </td>
            </tr>
          )}

          {orders.map((order) => (
            <tr
              key={order.id}
              onClick={() => router.push(`/portal/orders/${order.id}`)}
              className="cursor-pointer transition-colors hover:bg-[#FAFAFA]"
            >
              <td className="px-6 py-5">
                <p className="font-semibold text-[#0F172A]">{order.job_name}</p>
                <p className="mt-1 text-sm text-[#64748B]">{order.job_number}</p>
              </td>

              <td className="px-6 py-5 text-sm text-[#64748B]">
                {order.order_date}
              </td>

              <td className="px-6 py-5 text-sm text-[#64748B]">
                {order.due_date ?? "—"}
              </td>

              <td className="px-6 py-5">
                <StatusBadge status={order.status} />
              </td>

              <td className="px-6 py-5">
                <StatusBadge status={paymentStatus(order)} />
              </td>

              <td className="px-6 py-5 text-right">
                <ArrowRight size={16} className="ml-auto text-[#FF6B00]" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
