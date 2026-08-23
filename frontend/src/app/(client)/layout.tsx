import PortalGuard from "@/components/layouts/PortalGuard";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalGuard role="client">{children}</PortalGuard>;
}
