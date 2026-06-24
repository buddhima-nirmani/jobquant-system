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
        return "default";

      case "pending":
        return "secondary";

      case "rejected":
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