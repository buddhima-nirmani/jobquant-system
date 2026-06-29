"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">

      {/* Header */}

      <div className="mb-4">

        <span className="inline-flex rounded-full bg-[#FFF2E8] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#FF6B00]">
          Client Login
        </span>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A]">
          Welcome Back
        </h1>

        <p className="mt-1 text-[13px] leading-5 text-[#64748B]">
          Sign in to access your client portal and manage your printing orders.
        </p>

      </div>

      {/* Form */}

      <form className="space-y-3">

        {/* Email */}

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

        {/* Password */}

        <div>

          <div className="mb-1 flex items-center justify-between">

            <label className="text-xs font-semibold text-[#334155]">
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-[11px] font-medium text-[#FF6B00] hover:underline"
            >
              Forgot Password?
            </Link>

          </div>

          <div className="relative">

            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="h-9 rounded-lg bg-[#FCFCFD] px-9 text-sm"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors hover:text-[#FF6B00]"
            >
              {showPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>

          </div>

        </div>

        {/* Remember Me */}

        <div className="flex items-center justify-between">

          <label className="flex items-center gap-2 text-xs text-[#64748B]">

            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded accent-[#FF6B00]"
            />

            Remember me

          </label>

        </div>

        {/* Button */}

        <Button className="h-9 w-full rounded-lg bg-[#FF6B00] text-sm font-semibold hover:bg-[#E65C00]">

          Sign In

          <ArrowRight className="ml-2 h-4 w-4" />

        </Button>

      </form>

      {/* Footer */}

      <div className="mt-4 border-t border-[#EAEAEA] pt-3 text-center">

        <p className="text-xs text-[#64748B]">

          Don&apos;t have an account?{" "}

          <Link
            href="/register"
            className="font-semibold text-[#FF6B00] hover:underline"
          >
            Create Account
          </Link>

        </p>

      </div>

    </div>
  );
}