import PortalGuard from "@/components/layouts/PortalGuard";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalGuard role="staff">{children}</PortalGuard>;
}
