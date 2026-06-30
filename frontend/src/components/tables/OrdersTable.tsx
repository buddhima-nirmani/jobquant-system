import Link from "next/link";
import { ArrowRight } from "lucide-react";

import StatusBadge from "@/components/ui/StatusBadge";
import { typography } from "@/lib/typography";

export interface Order {
  id: string;
  name: string;
  category: string;
  dueDate: string;
  status: string;
}

interface OrdersTableProps {
  orders: Order[];
}

export default function OrdersTable({
  orders,
}: OrdersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#EAEAEA] bg-white shadow-sm">

      <table className="w-full">

        <thead className="border-b border-[#EEF2F7] bg-[#FAFAFA]">

          <tr>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Order ID
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Job Name
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Category
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Due Date
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Status
            </th>

            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Action
            </th>

          </tr>

        </thead>

        <tbody className="divide-y divide-[#EEF2F7]">

          {orders.map((order) => (

            <tr
              key={order.id}
              className="transition-colors hover:bg-[#FAFAFA]"
            >

              <td className="px-6 py-5">
                <p className={`${typography.body} font-semibold`}>
                  {order.id}
                </p>
              </td>

              <td className="px-6 py-5">
                <p className="font-medium text-[#0F172A]">
                  {order.name}
                </p>
              </td>

              <td className="px-6 py-5 text-sm text-[#64748B]">
                {order.category}
              </td>

              <td className="px-6 py-5 text-sm text-[#64748B]">
                {order.dueDate}
              </td>

              <td className="px-6 py-5">
                <StatusBadge status={order.status} />
              </td>

              <td className="px-6 py-5 text-right">

                <Link
                  href={`/portal/orders/${order.id}`}
                  className="inline-flex items-center gap-2 font-medium text-[#FF6B00] transition hover:text-[#E65C00]"
                >
                  View

                  <ArrowRight size={16} />

                </Link>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}