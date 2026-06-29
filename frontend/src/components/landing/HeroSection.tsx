import Link from "next/link";

import { Button } from "@/components/ui/button";

import {
  ArrowRight,
  Sparkles,
  ClipboardList,
  Palette,
  CreditCard,
  FileText,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#FFF2E8,transparent_45%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-8 py-16">

        {/* Left */}

        <div className="max-w-2xl">

          {/* Badge */}

          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF2E8] px-5 py-2">

            <Sparkles
              size={16}
              className="text-[#FF6B00]"
            />

            <span className="font-medium text-[#FF6B00]">
              Next-Gen Print Job Management System
            </span>

          </div>

          {/* Heading */}

          <h1 className="mt-8 text-6xl font-bold leading-tight text-[#0F172A]">

            Stay Connected Throughout Your

            <span className="block text-[#FF6B00]">
              Printing Journey
            </span>

          </h1>

          {/* Description */}

          <p className="mt-8 max-w-xl text-lg leading-8 text-[#64748B]">
            With JobQuant, you can track your orders, review design versions,
            manage payments, and stay updated throughout the entire printing
            process from design approval to final delivery.
          </p>

          {/* Buttons */}

          <div className="mt-10 flex gap-4">

            <Button
              asChild
              size="lg"
              className="bg-[#FF6B00] px-8 hover:bg-[#E65C00]"
            >
              <Link href="/register">
                Get Started

                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[#FF6B00] text-[#FF6B00] hover:bg-[#FFF2E8]"
            >
              <Link href="/login">
                Login
              </Link>
            </Button>

          </div>

        </div>

        {/* Right */}

        <div className="ml-auto hidden lg:block">

          <div className="grid gap-6">

            {/* Main Card */}

            <div className="rounded-3xl border border-[#EAEAEA] bg-white p-8 shadow-lg">

              <ClipboardList
                className="mb-5 text-[#FF6B00]"
                size={34}
              />

              <h3 className="text-2xl font-semibold text-[#0F172A]">
                Track Your Orders
              </h3>

              <p className="mt-3 leading-7 text-[#64748B]">
                Monitor the latest status of your printing orders,
                from production to final completion.
              </p>

            </div>

            {/* Bottom Cards */}

            <div className="grid grid-cols-3 gap-5">

              <div className="rounded-3xl border border-[#EAEAEA] bg-white p-6 shadow-lg">

                <Palette
                  className="mb-4 text-[#FF6B00]"
                  size={28}
                />

                <h4 className="font-semibold text-[#0F172A]">
                  Review Designs
                </h4>

                <p className="mt-2 text-sm leading-6 text-[#64748B]">
                  Review and approve design versions.
                </p>

              </div>

              <div className="rounded-3xl border border-[#EAEAEA] bg-white p-6 shadow-lg">

                <CreditCard
                  className="mb-4 text-[#FF6B00]"
                  size={28}
                />

                <h4 className="font-semibold text-[#0F172A]">
                  Payments
                </h4>

                <p className="mt-2 text-sm leading-6 text-[#64748B]">
                  Upload payment confirmations securely.
                </p>

              </div>

              <div className="rounded-3xl border border-[#EAEAEA] bg-white p-6 shadow-lg">

                <FileText
                  className="mb-4 text-[#FF6B00]"
                  size={28}
                />

                <h4 className="font-semibold text-[#0F172A]">
                  Order Details
                </h4>

                <p className="mt-2 text-sm leading-6 text-[#64748B]">
                  View specifications and job information.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}