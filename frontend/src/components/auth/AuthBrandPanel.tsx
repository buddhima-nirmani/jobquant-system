import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

interface AuthBrandPanelProps {
  badge: string;
  title: string;
  description: string;
}

const features = [
  "Track printing orders",
  "Review design versions",
  "Manage payments",
];

export default function AuthBrandPanel({
  badge,
  title,
  description,
}: AuthBrandPanelProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[linear-gradient(155deg,#F97316_0%,#EA580C_55%,#C2410C_100%)] text-white">

      {/* Decorative Elements */}

      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full border border-white/10 bg-white/5" />

      <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-10 translate-y-10 rounded-full bg-white/5 blur-lg" />

      <div className="absolute right-6 top-40 h-20 w-20 rounded-full border border-white/10" />

      <div className="relative flex h-full flex-col px-6 py-5">

        {/* Logo */}

        <div className="flex items-center gap-3">

          <Image
            src="/jobquant-icon.png"
            alt="JobQuant"
            width={36}
            height={36}
            priority
            style={{
              width: "36px",
              height: "36px",
            }}
          />

          <div>

            <h2 className="text-xl font-bold leading-none">
              JobQuant
            </h2>

            <p className="mt-1 text-[11px] text-white/80">
              JobQuant Portal
            </p>

          </div>

        </div>

        {/* Heading */}

        <div className="mt-6">

          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/75">
            {badge}
          </p>

          <h1 className="mt-2 whitespace-pre-line text-[26px] font-bold leading-tight">
            {title}
          </h1>

          <p className="mt-3 text-[13px] leading-5 text-white/90">
            {description}
          </p>

        </div>

        {/* Features */}

        <div className="mt-5 space-y-2.5">

          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2.5"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">

                <CheckCircle2 size={13} />

              </div>

              <span className="text-[12px] font-medium">
                {feature}
              </span>

            </div>
          ))}

        </div>

        {/* Footer */}

        <div className="mt-10">

          <div className="mb-2 h-px bg-white/20" />

          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/70">
            Developed For
          </p>

          <p className="mt-1 text-[10px] font-semibold leading-4">
            Hansi Graphics & Advertising (Pvt) Ltd.
          </p>

        </div>

      </div>

    </div>
  );
}