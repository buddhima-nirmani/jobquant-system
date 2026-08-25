import { Loader2 } from "lucide-react";

export default function LoadingState({
  label = "Loading...",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 text-sm text-[#94A3B8] ${className}`}>
      <Loader2 size={14} className="animate-spin" />
      {label}
    </div>
  );
}
