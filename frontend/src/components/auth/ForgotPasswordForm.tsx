"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setResetUrl(null);
    setIsLoading(true);

    try {
      const result = await forgotPassword(email);
      setMessage(result.message);
      setResetUrl(result.reset_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to process your request.");
    } finally {
      setIsLoading(false);
    }
  }

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
          Enter your registered email address and we&apos;ll generate a reset link.
        </p>

      </div>

      {/* Form */}

      <form className="space-y-4" onSubmit={handleSubmit}>

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
              placeholder="Enter the email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="h-9 rounded-lg bg-[#FCFCFD] pl-9 text-sm"
            />

          </div>

        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        {message && (
          <div className="space-y-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
            <p>{message}</p>
            {resetUrl && (
              <Link
                href={resetUrl}
                className="block break-all font-semibold text-[#FF6B00] underline"
              >
                {resetUrl}
              </Link>
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="h-9 w-full rounded-lg bg-[#FF6B00] text-sm font-semibold hover:bg-[#E65C00] disabled:cursor-not-allowed disabled:opacity-70"
        >

          {isLoading ? "Sending..." : "Send Reset Link"}

          {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}

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
