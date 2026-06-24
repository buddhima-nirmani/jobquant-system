import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: LucideIcon;
};

export default function StatCard({
  title,
  value,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <Icon className="h-8 w-8 text-orange-500" />
      </CardContent>
    </Card>
  );
}