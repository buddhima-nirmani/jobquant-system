import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="group rounded-2xl border border-[#EAEAEA] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF2E8] transition-colors duration-300 group-hover:bg-[#FF6B00]">
        <Icon
          size={28}
          className="text-[#FF6B00] transition-colors duration-300 group-hover:text-white"
        />
      </div>

      <h3 className="text-xl font-semibold text-[#0F172A]">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-[#64748B]">
        {description}
      </p>
    </div>
  );
}