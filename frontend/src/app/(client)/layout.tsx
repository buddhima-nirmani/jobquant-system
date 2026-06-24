import Sidebar from "@/components/navigation/Sidebar";
import Navbar from "@/components/navigation/Navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar role="client" />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}