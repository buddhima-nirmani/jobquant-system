import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-3">
        <Button>Create Job</Button>

        <Button variant="outline">
          Add Staff
        </Button>

        <Button variant="outline">
          View Payments
        </Button>

        <Button variant="outline">
          Manage Clients
        </Button>
      </CardContent>
    </Card>
  );
}