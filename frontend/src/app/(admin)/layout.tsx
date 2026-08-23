import PortalGuard from "@/components/layouts/PortalGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalGuard role="admin">{children}</PortalGuard>;
}
