type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const styles = {
    Pending:
      "bg-[#FFF7ED] text-[#EA580C]",
    "In Progress":
      "bg-[#EFF6FF] text-[#2563EB]",
    Completed:
      "bg-[#ECFDF5] text-[#16A34A]",
    Verified:
      "bg-[#ECFDF5] text-[#16A34A]",
    Rejected:
      "bg-[#FEF2F2] text-[#DC2626]",
  };

  const className =
    styles[status as keyof typeof styles] ??
    "bg-[#F8FAFC] text-[#64748B]";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {status}
    </span>
  );
}