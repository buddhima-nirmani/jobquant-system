import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="bg-[#FF6B00] py-24">
      <div className="mx-auto max-w-4xl px-8 text-center">

        <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white">
          CUSTOMER PORTAL
        </span>

        <h2 className="mt-8 text-5xl font-bold leading-tight text-white">
          Stay Connected With
          <br />
          Every Printing Order
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/90">
          Access your orders, review design versions, upload payment
          confirmations and stay informed throughout every stage of
          your printing journey with JobQuant.
        </p>

        <div className="mt-12 flex justify-center gap-4">

          <Button
            asChild
            size="lg"
            className="bg-white text-[#FF6B00] hover:bg-[#F8F8F8]"
          >
            <Link href="/register">
              Register
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white bg-transparent text-white hover:bg-white hover:text-[#FF6B00]"
          >
            <Link href="/login">
              Login
            </Link>
          </Button>

        </div>

      </div>
    </section>
  );
}