import Image from "next/image";
import Link from "next/link";

import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";

export default function LandingFooter() {
  return (
    <footer id="contact" className="border-t border-[#EAEAEA] bg-white">
      <div className="mx-auto max-w-7xl px-8 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Company */}

          <div>
            <div className="flex items-center gap-4">
              <Image src="/jobquant-icon.png" alt="JobQuant" width={52} height={52} />

              <div>
                <h3 className="text-2xl font-bold text-[#0F172A]">JobQuant</h3>

                <p className="text-sm text-[#64748B]">
                  Printing Management System
                </p>
              </div>
            </div>

            <p className="mt-6 leading-7 text-[#64748B]">
              JobQuant enables clients to stay connected throughout their
              printing journey by tracking orders, reviewing design versions,
              managing payments and monitoring progress until delivery.
            </p>

            <div className="mt-6">
              <p className="font-semibold text-[#0F172A]">Developed for</p>

              <p className="mt-1 text-[#64748B]">
                Hansi Graphics & Advertising (Pvt) Ltd.
              </p>
            </div>
          </div>

          {/* Quick Links */}

          <div>
            <h3 className="text-xl font-semibold text-[#0F172A]">
              Quick Links
            </h3>

            <div className="mt-6 flex flex-col gap-4">
              <Link href="/" className="text-[#64748B] hover:text-[#FF6B00]">
                Home
              </Link>

              <Link
                href="#features"
                className="text-[#64748B] hover:text-[#FF6B00]"
              >
                Features
              </Link>

              <Link
                href="#how-it-works"
                className="text-[#64748B] hover:text-[#FF6B00]"
              >
                How It Works
              </Link>

              <Link
                href="/login"
                className="text-[#64748B] hover:text-[#FF6B00]"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="text-[#64748B] hover:text-[#FF6B00]"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Contact */}

          <div>
            <h3 className="text-xl font-semibold text-[#0F172A]">
              Connect With Us
            </h3>

            <div className="mt-6 space-y-5">
              <a
                href="https://www.facebook.com/hansigraphics/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#64748B] transition-colors hover:text-[#FF6B00]"
              >
                <FaFacebookF size={18} />
                Facebook
              </a>

              <a
                href="https://www.instagram.com/hansigraphics/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#64748B] transition-colors hover:text-[#FF6B00]"
              >
                <FaInstagram size={18} />
                Instagram
              </a>

              <a
                href="https://www.tiktok.com/@hansi.graphics"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#64748B] transition-colors hover:text-[#FF6B00]"
              >
                <FaTiktok size={18} />
                @hansi.graphics
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-[#EAEAEA] pt-8">
          <p className="text-center text-sm text-[#64748B]">
            © 2026 JobQuant. Developed for Hansi Graphics & Advertising (Pvt)
            Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
