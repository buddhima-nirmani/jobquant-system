"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";

import { API_URL, setToken } from "@/lib/api";
import { ROLE_HOME_ROUTE } from "@/lib/auth";

type LoginResponse = {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
  };
};

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || "Invalid email or password."
        );
      }

      const loginData = data as LoginResponse;

      // Stored in sessionStorage (not localStorage) so each browser tab
      // keeps its own independent session.
      setToken(loginData.access_token);

      router.push(
        ROLE_HOME_ROUTE[loginData.user.role as keyof typeof ROLE_HOME_ROUTE] ??
          "/portal/dashboard"
      );
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
      <div className="mb-4">
        <span className="inline-flex rounded-full bg-[#FFF2E8] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#FF6B00]">
          JobQuant Login
        </span>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A]">
          Welcome Back
        </h1>

        <p className="mt-1 text-[13px] leading-5 text-[#64748B]">
        Sign in to your JobQuant account to continue.
        </p>
      </div>

      {/* Form */}
      <form className="space-y-3" onSubmit={handleSubmit}>
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
              placeholder="Enter the email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
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

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        {/* Sign In Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="h-9 w-full rounded-lg bg-[#FF6B00] text-sm font-semibold hover:bg-[#E65C00] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Signing In..." : "Sign In"}

          {!isLoading && (
            <ArrowRight className="ml-2 h-4 w-4" />
          )}
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