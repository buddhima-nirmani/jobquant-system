"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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

const API_URL = "http://127.0.0.1:8000";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          company: company || null,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || "Unable to create your account."
        );
      }

      router.push("/login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the server."
      );
    } finally {
      setIsLoading(false);
    }
  }

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

      <form
        className="space-y-2.5"
        onSubmit={handleSubmit}
      >

        {/* Name + Email */}
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
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-9 rounded-lg bg-[#FCFCFD] pl-9 text-sm"
              />
            </div>
          </div>

        </div>

        {/* Phone + Company */}
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
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
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
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                className="h-9 rounded-lg bg-[#FCFCFD] pl-9 text-sm"
              />
            </div>
          </div>

        </div>

        {/* Password + Confirm */}
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
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
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
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                required
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

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="h-9 w-full rounded-lg bg-[#FF6B00] text-sm font-semibold hover:bg-[#E65C00] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Creating Account..." : "Create Account"}

          {!isLoading && (
            <ArrowRight className="ml-2 h-4 w-4" />
          )}
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