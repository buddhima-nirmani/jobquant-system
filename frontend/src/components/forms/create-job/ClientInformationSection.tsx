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

export default function ClientInformationSection() {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-semibold">
            02
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Client Information
            </h3>

            <p className="text-sm text-muted-foreground">
              Selecting a client auto-fills saved details.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Select Client
            </label>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Client" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="northwind">
                  Northwind Cafe Co.
                </SelectItem>

                <SelectItem value="abc">
                  ABC Company
                </SelectItem>

                <SelectItem value="xyz">
                  XYZ Printers
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Client / Company Name
            </label>

            <Input
              placeholder="Northwind Cafe Co."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Email Address
            </label>

            <Input
              placeholder="orders@northwindcafe.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Contact Number
            </label>

            <Input
              placeholder="+94 77 123 4567"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}