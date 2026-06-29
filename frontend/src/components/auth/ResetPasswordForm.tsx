"use client";

import Link from "next/link";
import { useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

import PasswordStrength from "@/components/auth/PasswordStrength";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  return (
    <div className="w-full">

      {/* Header */}

      <div className="mb-4">

        <span className="inline-flex rounded-full bg-[#FFF2E8] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#FF6B00]">
          Password Reset
        </span>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A]">
          Create New Password
        </h1>

        <p className="mt-1 text-[13px] leading-5 text-[#64748B]">
          Your new password must be different from your previous password.
        </p>

      </div>

      <form className="space-y-3">

        {/* Password */}

        <div>

          <label className="mb-1 block text-xs font-semibold text-[#334155]">
            New Password
          </label>

          <div className="relative">

            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />

            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="h-9 rounded-lg bg-[#FCFCFD] px-9 text-sm"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#FF6B00]"
            >
              {showPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>

          </div>

        </div>

        {/* Confirm */}

        <div>

          <label className="mb-1 block text-xs font-semibold text-[#334155]">
            Confirm Password
          </label>

          <div className="relative">

            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />

            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="h-9 rounded-lg bg-[#FCFCFD] px-9 text-sm"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#FF6B00]"
            >
              {showConfirmPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>

          </div>

        </div>

        <PasswordStrength password={password} />

        <Button className="h-9 w-full rounded-lg bg-[#FF6B00] text-sm font-semibold hover:bg-[#E65C00]">

          <CheckCircle2 className="mr-2 h-4 w-4" />

          Update Password

        </Button>

      </form>

      <div className="mt-4 border-t border-[#EAEAEA] pt-3 text-center">

        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#64748B] hover:text-[#FF6B00]"
        >

          <ArrowLeft size={14} />

          Back to Sign In

        </Link>

      </div>

    </div>
  );
}