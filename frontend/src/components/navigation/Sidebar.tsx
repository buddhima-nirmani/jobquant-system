"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  role: "admin" | "staff" | "client";
};


const navItems = {
  admin: [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Job Management", href: "/admin/jobs" },
    { name: "Client Management", href: "/admin/clients" },
    { name: "Staff Management", href: "/admin/staff" },
    { name: "Payments", href: "/admin/payments" },
  ],

  staff: [
    { name: "Dashboard", href: "/staff/dashboard" },
    { name: "Job Management", href: "/staff/jobs" },
    { name: "Client Management", href: "/staff/clients" },
    { name: "Payments", href: "/staff/payments" },
  ],

  client: [
    { name: "Dashboard", href: "/portal/dashboard" },
    { name: "My Orders", href: "/portal/orders" },
    { name: "Payments", href: "/portal/payments" },
  ],
};

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-5">
      <h2 className="text-xl font-bold mb-6">
        JobQuant
      </h2>

      <nav className="space-y-3">
        {navItems[role].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded transition ${
              pathname === item.href ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}