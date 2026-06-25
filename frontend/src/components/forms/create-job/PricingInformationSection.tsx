import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PricingInformationSection() {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-semibold">
            05
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Pricing Information
            </h3>

            <p className="text-sm text-muted-foreground">
              AI-assisted pricing and manual adjustments.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Predicted Cost
            </label>

            <Input
              value="LKR 35,000"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Final Approved Cost
            </label>

            <Input
              placeholder="LKR 35,000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Override Adjustment
            </label>

            <Input
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button>
            Predict Cost
          </Button>

          <Button variant="outline">
            Apply Prediction
          </Button>
        </div>

        <div className="rounded-lg border p-4">
          <h4 className="font-medium mb-4">
            Cost Breakdown
          </h4>

          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Material Cost
              </p>

              <p className="font-semibold">
                LKR 12,000
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Production Cost
              </p>

              <p className="font-semibold">
                LKR 15,000
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Finishing Cost
              </p>

              <p className="font-semibold">
                LKR 5,000
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Service Charges
              </p>

              <p className="font-semibold">
                LKR 3,000
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}