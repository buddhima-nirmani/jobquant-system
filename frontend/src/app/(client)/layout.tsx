import type { ReactNode } from "react";

import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";

export default function ClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <Sidebar role="client" />

      <div className="ml-[240px] flex min-h-screen flex-1 flex-col">
        <Navbar
          role="client"
          userName="Nirmani"
        />

        <main className="flex-1 bg-[#FAF8F4]">
          <div className="px-10 py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}