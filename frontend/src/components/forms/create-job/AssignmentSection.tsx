import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AssignmentSection() {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-semibold">
            03
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Assignment
            </h3>

            <p className="text-sm text-muted-foreground">
              Owner and designer for this job.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Designer
            </label>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Designer" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="sara">
                  Sara Khan
                </SelectItem>

                <SelectItem value="john">
                  John Smith
                </SelectItem>

                <SelectItem value="david">
                  David Silva
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Created By
            </label>

            <Input
              value="Admin User"
              readOnly
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
