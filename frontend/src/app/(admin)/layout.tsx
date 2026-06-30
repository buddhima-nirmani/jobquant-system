import Sidebar from "@/components/navigation/Sidebar";
import Navbar from "@/components/navigation/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      {/* Fixed Sidebar */}
      <Sidebar role="admin" />

      {/* Main Content */}
      <div className="ml-[240px] flex min-h-screen flex-1 flex-col">
        {/* Navbar spans the full width of the content area */}
        <Navbar
  role="admin"
  userName="Wasantha"
/>

        {/* Page Content */}
        <main className="flex-1 bg-[#FAF8F4]">
          <div className="px-10 py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}