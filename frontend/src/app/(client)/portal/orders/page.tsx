import { Search, SlidersHorizontal } from "lucide-react";

import PageHeader from "@/components/layouts/PageHeader";
import OrdersTable, {
  Order,
} from "@/components/tables/OrdersTable";

const orders: Order[] = [
  {
    id: "JQ-1045",
    name: "Acrylic Signboard",
    category: "Signage",
    dueDate: "03 Jul 2026",
    status: "In Progress",
  },
  {
    id: "JQ-1042",
    name: "Business Cards",
    category: "Business Cards",
    dueDate: "01 Jul 2026",
    status: "Pending",
  },
  {
    id: "JQ-1038",
    name: "Vehicle Wrap",
    category: "Vehicle Branding",
    dueDate: "28 Jun 2026",
    status: "Completed",
  },
  {
    id: "JQ-1032",
    name: "Pull-up Banner",
    category: "Banner",
    dueDate: "06 Jul 2026",
    status: "In Progress",
  },
  {
    id: "JQ-1028",
    name: "Restaurant Menu",
    category: "Printing",
    dueDate: "10 Jul 2026",
    status: "Pending",
  },
];

export default function ClientOrdersPage() {
  return (
    <div className="space-y-8">

      <PageHeader
        title="My Orders"
        description="View and track all your printing orders."
      />

      <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full max-w-md">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />

            <input
              type="text"
              placeholder="Search orders..."
              className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] pl-11 pr-4 text-sm outline-none transition focus:border-[#FF6B00] focus:bg-white"
            />

          </div>

          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-5 text-sm font-medium text-[#475569] transition hover:bg-[#FFF7F2] hover:text-[#FF6B00]">

            <SlidersHorizontal size={18} />

            Filters

          </button>

        </div>

      </div>

      <OrdersTable orders={orders} />

    </div>
  );
}