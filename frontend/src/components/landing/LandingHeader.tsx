import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#EAEAEA] bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

        {/* Logo */}

        <Link
          href="/"
          className="flex items-center gap-4"
        >
          <Image
            src="/logo.png"
            alt="JobQuant"
            width={48}
            height={48}
          />

          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">
              JobQuant
            </h1>

            <p className="text-sm text-[#64748B]">
              Printing Management System
            </p>
          </div>
        </Link>

        {/* Navigation */}

        <nav className="hidden items-center gap-10 lg:flex">

          <Link
            href="/"
            className="font-medium text-[#0F172A] transition hover:text-[#FF6B00]"
          >
            Home
          </Link>

          <Link
            href="#features"
            className="font-medium text-[#0F172A] transition hover:text-[#FF6B00]"
          >
            Features
          </Link>

          <Link
            href="#how-it-works"
            className="font-medium text-[#0F172A] transition hover:text-[#FF6B00]"
          >
            How It Works
          </Link>

          <Link
            href="#contact"
            className="font-medium text-[#0F172A] transition hover:text-[#FF6B00]"
          >
            Contact
          </Link>

        </nav>

        {/* Buttons */}

        <div className="flex items-center gap-3">

          <Button
            asChild
            variant="outline"
            className="border-[#FF6B00] text-[#FF6B00] hover:bg-[#FFF2E8]"
          >
            <Link href="/login">
              Login
            </Link>
          </Button>

          <Button
            asChild
            className="bg-[#FF6B00] hover:bg-[#E65C00]"
          >
            <Link href="/register">
              Register
            </Link>
          </Button>

        </div>

      </div>
    </header>
  );
}