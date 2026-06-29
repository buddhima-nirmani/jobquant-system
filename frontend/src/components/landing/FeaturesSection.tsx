import FeatureCard from "./FeatureCard";

import {
  ClipboardList,
  Palette,
  CreditCard,
  FileText,
} from "lucide-react";

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-white py-24"
    >
      <div className="mx-auto max-w-7xl px-8">

        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-[#FFF2E8] px-4 py-2 text-sm font-semibold text-[#FF6B00]">
            FEATURES
          </span>

          <h2 className="mt-6 text-5xl font-bold text-[#0F172A]">
            Everything You Need in One Place
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#64748B]">
            Stay connected with your printing orders, review design
            versions, manage payments, and monitor every stage of your
            printing journey through JobQuant.
          </p>

        </div>

        {/* Feature Cards */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          <FeatureCard
            icon={ClipboardList}
            title="Track Orders"
            description="Monitor your printing orders and stay informed about their progress from production to completion."
          />

          <FeatureCard
            icon={Palette}
            title="Review Design Versions"
            description="Preview uploaded design drafts, compare revisions and approve the final artwork before printing."
          />

          <FeatureCard
            icon={CreditCard}
            title="Manage Payments"
            description="Upload payment confirmations securely and review your payment history whenever you need."
          />

          <FeatureCard
            icon={FileText}
            title="View Order Details"
            description="Access order specifications, completion dates and detailed job information anytime."
          />

        </div>

      </div>
    </section>
  );
}