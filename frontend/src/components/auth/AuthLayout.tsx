import { ReactNode } from "react";

interface AuthLayoutProps {
  left: ReactNode;
  right: ReactNode;
}

export default function AuthLayout({
  left,
  right,
}: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAF8F4] px-6 py-6">

      {/* Background */}

      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute -right-56 -top-56 h-[720px] w-[720px] rounded-full bg-[#FF6B00]/10 blur-[150px]" />

        <div className="absolute -bottom-48 -left-48 h-[620px] w-[620px] rounded-full bg-[#FFE6D3] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right,#0F172A 1px,transparent 1px),
              linear-gradient(to bottom,#0F172A 1px,transparent 1px)
            `,
            backgroundSize: "38px 38px",
          }}
        />

      </div>

      {/* Card */}

      <div className="relative z-10 grid h-[570px] w-full max-w-[1080px] overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_28px_70px_rgba(15,23,42,0.12)] lg:grid-cols-[24%_76%]">

        {/* Branding */}

        <div className="hidden lg:block">
          {left}
        </div>

        {/* Form */}

        <div className="flex items-center justify-center px-14 py-7">

          <div className="w-full max-w-[560px]">
            {right}
          </div>

        </div>

      </div>

    </main>
  );
}