import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentActivityProps {
  activities: string[];
}

export default function RecentActivity({
  activities,
}: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {activities.map((activity, index) => (
            <li
              key={index}
              className="text-sm"
            >
              • {activity}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}