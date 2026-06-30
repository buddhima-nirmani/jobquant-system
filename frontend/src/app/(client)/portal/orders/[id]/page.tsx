import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CreditCard,
  Package,
  User,
} from "lucide-react";

import PageHeader from "@/components/layouts/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";

export default function OrderDetailsPage() {
  return (
    <div className="space-y-8">

      <div className="flex items-center">

        <Link
          href="/portal/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#64748B] transition hover:text-[#FF6B00]"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

      </div>

      <PageHeader
        title="Acrylic Signboard"
        description="Order ID: JQ-1045"
      />

      <div className="grid gap-6 xl:grid-cols-3">

        {/* Order Summary */}

        <div className="xl:col-span-2 rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-[#0F172A]">
            Order Summary
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div>
              <p className="text-sm text-[#64748B]">Job Name</p>
              <p className="mt-1 font-medium text-[#0F172A]">
                Acrylic Signboard
              </p>
            </div>

            <div>
              <p className="text-sm text-[#64748B]">Category</p>
              <p className="mt-1 font-medium text-[#0F172A]">
                Signage
              </p>
            </div>

            <div>
              <p className="text-sm text-[#64748B]">Current Status</p>

              <div className="mt-2">
                <StatusBadge status="In Progress" />
              </div>

            </div>

            <div>
              <p className="text-sm text-[#64748B]">Estimated Completion</p>
              <p className="mt-1 font-medium text-[#0F172A]">
                03 Jul 2026
              </p>
            </div>

          </div>

        </div>

        {/* Payment */}

        <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-[#FFF2E8] p-3">
              <CreditCard
                size={20}
                className="text-[#FF6B00]"
              />
            </div>

            <div>

              <h3 className="font-semibold text-[#0F172A]">
                Payment
              </h3>

              <p className="text-sm text-[#64748B]">
                Outstanding Balance
              </p>

            </div>

          </div>

          <h2 className="mt-6 text-3xl font-bold text-[#0F172A]">
            LKR 24,500
          </h2>

        </div>

      </div>

      {/* Job Information */}

      <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-[#0F172A]">
          Job Information
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-3">

          <div className="flex items-center gap-3">

            <Package
              size={20}
              className="text-[#FF6B00]"
            />

            <div>

              <p className="text-sm text-[#64748B]">
                Quantity
              </p>

              <p className="font-medium">
                2 Units
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <CalendarDays
              size={20}
              className="text-[#FF6B00]"
            />

            <div>

              <p className="text-sm text-[#64748B]">
                Ordered On
              </p>

              <p className="font-medium">
                24 Jun 2026
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <User
              size={20}
              className="text-[#FF6B00]"
            />

            <div>

              <p className="text-sm text-[#64748B]">
                Assigned Designer
              </p>

              <p className="font-medium">
                John Perera
              </p>

            </div>

          </div>

        </div>

      </div>

      <div className="flex justify-end">

        <Link
          href="/portal/orders/JQ-1045/designs"
          className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-5 py-3 font-medium text-white transition hover:bg-[#E65C00]"
        >
          View Design Versions

          <ArrowRight size={18} />
        </Link>

      </div>

    </div>
  );
}