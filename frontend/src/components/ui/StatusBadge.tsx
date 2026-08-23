type StatusBadgeProps = {
  status: string;
};

const styles: Record<string, string> = {
  Pending: "bg-[#FFF7ED] text-[#EA580C]",
  Design: "bg-[#EFF6FF] text-[#2563EB]",
  "Awaiting Client Approval": "bg-[#FEFCE8] text-[#CA8A04]",
  Approved: "bg-[#ECFDF5] text-[#16A34A]",
  Production: "bg-[#EFF6FF] text-[#2563EB]",
  "In Progress": "bg-[#EFF6FF] text-[#2563EB]",
  "Ready for Delivery": "bg-[#F5F3FF] text-[#7C3AED]",
  Completed: "bg-[#ECFDF5] text-[#16A34A]",
  Cancelled: "bg-[#FEF2F2] text-[#DC2626]",

  "Pending Review": "bg-[#FFF7ED] text-[#EA580C]",
  "Revision Requested": "bg-[#FEF2F2] text-[#DC2626]",
  Superseded: "bg-[#F8FAFC] text-[#94A3B8]",

  Verified: "bg-[#ECFDF5] text-[#16A34A]",
  Rejected: "bg-[#FEF2F2] text-[#DC2626]",

  Active: "bg-[#ECFDF5] text-[#16A34A]",
  Inactive: "bg-[#F8FAFC] text-[#94A3B8]",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const className = styles[status] ?? "bg-[#F8FAFC] text-[#64748B]";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {status}
    </span>
  );
}
