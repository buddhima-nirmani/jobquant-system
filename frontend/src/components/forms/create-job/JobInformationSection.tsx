import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

export default function JobInformationSection() {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-semibold">
            01
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Job Information
            </h3>

            <p className="text-sm text-muted-foreground">
              Basic identifiers and timeline for this job.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-muted-foreground">
            Job Name / Description
          </label>

          <Input
            placeholder="Banner Printing"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Job Number
            </label>

            <Input
              placeholder="JQ-2419"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Order Date
            </label>

            <Input type="date" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Expected Completion
            </label>

            <Input type="date" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}