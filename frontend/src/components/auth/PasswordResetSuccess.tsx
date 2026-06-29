import Link from "next/link";

import { ArrowRight, CircleCheckBig } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PasswordResetSuccess() {
  return (
    <div className="w-full text-center">

      {/* Icon */}

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF2E8]">

        <CircleCheckBig
          size={34}
          className="text-[#FF6B00]"
        />

      </div>

      {/* Heading */}

      <h1 className="mt-5 text-2xl font-bold text-[#0F172A]">
        Password Updated
      </h1>

      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-[#64748B]">
        Your password has been updated successfully.
        You can now sign in to your JobQuant Client Portal
        using your new password.
      </p>

      {/* Button */}

      <Button
        asChild
        className="mt-8 h-9 w-full rounded-lg bg-[#FF6B00] text-sm font-semibold hover:bg-[#E65C00]"
      >

        <Link href="/login">

          Continue to Sign In

          <ArrowRight className="ml-2 h-4 w-4" />

        </Link>

      </Button>

    </div>
  );
}