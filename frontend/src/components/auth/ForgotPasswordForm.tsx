"use client";

import Link from "next/link";

import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordForm() {
  return (
    <div className="w-full">

      {/* Header */}

      <div className="mb-4">

        <span className="inline-flex rounded-full bg-[#FFF2E8] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#FF6B00]">
          Password Recovery
        </span>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A]">
          Forgot Password
        </h1>

        <p className="mt-1 text-[13px] leading-5 text-[#64748B]">
          Enter your registered email address and we&apos;ll send you instructions
          to reset your password.
        </p>

      </div>

      {/* Form */}

      <form className="space-y-4">

        <div>

          <label className="mb-1 block text-xs font-semibold text-[#334155]">
            Email Address
          </label>

          <div className="relative">

            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />

            <Input
              type="email"
              placeholder="name@example.com"
              className="h-9 rounded-lg bg-[#FCFCFD] pl-9 text-sm"
            />

          </div>

        </div>

        <Button className="h-9 w-full rounded-lg bg-[#FF6B00] text-sm font-semibold hover:bg-[#E65C00]">

          Send Reset Link

          <ArrowRight className="ml-2 h-4 w-4" />

        </Button>

      </form>

      {/* Footer */}

      <div className="mt-5 border-t border-[#EAEAEA] pt-4 text-center">

        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#64748B] transition-colors hover:text-[#FF6B00]"
        >

          <ArrowLeft size={14} />

          Back to Sign In

        </Link>

      </div>

    </div>
  );
}