import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const getVariant = () => {
  switch (status.toLowerCase()) {
    case "completed":
    case "verified":
    case "approved":
    case "active":
      return "default";

    case "pending":
    case "in progress":
      return "secondary";

    case "rejected":
    case "inactive":
      return "destructive";

    default:
      return "outline";
  }
};

  return (
    <Badge variant={getVariant()}>
      {status}
    </Badge>
  );
}