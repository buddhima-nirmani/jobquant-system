"use client";

import Link from "next/link";
import { useState } from "react";

import PasswordStrength from "@/components/auth/PasswordStrength";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";

export default function RegisterForm() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full">

      {/* Header */}

      <div className="mb-3">

        <span className="inline-flex rounded-full bg-[#FFF2E8] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#FF6B00]">
          Client Registration
        </span>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A]">
          Create Account
        </h1>

        <p className="mt-1 text-[13px] leading-5 text-[#64748B]">
          Create your client account to track printing orders,
          review design versions and manage payments.
        </p>

      </div>

      {/* Form */}

      <form className="space-y-2.5">

        {/* Row 1 */}

        <div className="grid grid-cols-2 gap-3">

          <div>

            <label className="mb-1 block text-xs font-semibold text-[#334155]">
              Full Name
            </label>

            <div className="relative">

              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              />

              <Input
                placeholder="John Doe"
                className="h-9 rounded-lg bg-[#FCFCFD] pl-9 text-sm"
              />

            </div>

          </div>

          <div>

            <label className="mb-1 block text-xs font-semibold text-[#334155]">
              Email
            </label>

            <div className="relative">

              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              />

              <Input
                type="email"
                placeholder="name@email.com"
                className="h-9 rounded-lg bg-[#FCFCFD] pl-9 text-sm"
              />

            </div>

          </div>

        </div>

        {/* Row 2 */}

        <div className="grid grid-cols-2 gap-3">

          <div>

            <label className="mb-1 block text-xs font-semibold text-[#334155]">
              Contact Number
            </label>

            <div className="relative">

              <Phone
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              />

              <Input
                placeholder="07X XXX XXXX"
                className="h-9 rounded-lg bg-[#FCFCFD] pl-9 text-sm"
              />

            </div>

          </div>

          <div>

            <label className="mb-1 block text-xs font-semibold text-[#334155]">
              Company
              <span className="ml-1 text-[10px] text-[#94A3B8]">
                Optional
              </span>
            </label>

            <div className="relative">

              <Building2
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              />

              <Input
                placeholder="Company"
                className="h-9 rounded-lg bg-[#FCFCFD] pl-9 text-sm"
              />

            </div>

          </div>

        </div>

        {/* Row 3 */}

        <div className="grid grid-cols-2 gap-3">

          <div>

            <label className="mb-1 block text-xs font-semibold text-[#334155]">
              Password
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
                placeholder="Password"
                className="h-9 rounded-lg bg-[#FCFCFD] px-9 text-sm"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              >
                {showPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>

            </div>

          </div>

          <div>

            <label className="mb-1 block text-xs font-semibold text-[#334155]">
              Confirm
            </label>

            <div className="relative">

              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              />

              <Input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm"
                className="h-9 rounded-lg bg-[#FCFCFD] px-9 text-sm"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              >
                {showConfirmPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>

            </div>

          </div>

        </div>

        <PasswordStrength password={password} />

        <Button className="h-9 w-full rounded-lg bg-[#FF6B00] text-sm font-semibold hover:bg-[#E65C00]">

          Create Account

          <ArrowRight className="ml-2 h-4 w-4" />

        </Button>

      </form>

      <p className="mt-2 text-center text-[10px] leading-4 text-[#94A3B8]">
        By creating an account, you agree to the Terms of Service
        and Privacy Policy.
      </p>

      <div className="mt-2 border-t border-[#EAEAEA] pt-2 text-center">

        <p className="text-xs text-[#64748B]">

          Already have an account?{" "}

          <Link
            href="/login"
            className="font-semibold text-[#FF6B00] hover:underline"
          >
            Sign In
          </Link>

        </p>

      </div>

    </div>
  );
}