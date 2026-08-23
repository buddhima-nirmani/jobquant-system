"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

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
import { resetPassword } from "@/lib/api";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is missing its token. Request a new one.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(token, password);
      router.push("/password-reset-success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password.");
    } finally {
      setIsLoading(false);
    }
  }

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

      <form className="space-y-3" onSubmit={handleSubmit}>

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
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
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

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="h-9 w-full rounded-lg bg-[#FF6B00] text-sm font-semibold hover:bg-[#E65C00] disabled:cursor-not-allowed disabled:opacity-70"
        >

          <CheckCircle2 className="mr-2 h-4 w-4" />

          {isLoading ? "Updating..." : "Update Password"}

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
