import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PricingInformationSection() {
  return (
    <Card className="rounded-2xl border border-[#EAEAEA] shadow-sm">
      <CardContent className="space-y-6 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF2E8] font-semibold text-[#FF6B00]">
            05
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#0F172A]">
              Pricing Information
            </h3>

            <p className="text-sm text-[#64748B]">
              AI-assisted pricing estimation.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Estimated Cost
            </label>

            <Input
              value="Waiting for prediction..."
              readOnly
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Final Approved Cost
            </label>

            <Input placeholder="LKR 0.00" />
          </div>
        </div>

        <Button className="bg-[#FF6B00] hover:bg-[#E65C00]">
          Predict Cost
        </Button>

        <div className="rounded-xl border border-[#EAEAEA] bg-[#FAFBFC] p-5">
          <h4 className="mb-4 font-semibold text-[#0F172A]">
            Cost Breakdown
          </h4>

          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-[#64748B]">
                Material
              </p>

              <p className="font-semibold">
                —
              </p>
            </div>

            <div>
              <p className="text-sm text-[#64748B]">
                Printing
              </p>

              <p className="font-semibold">
                —
              </p>
            </div>

            <div>
              <p className="text-sm text-[#64748B]">
                Finishing
              </p>

              <p className="font-semibold">
                —
              </p>
            </div>

            <div>
              <p className="text-sm text-[#64748B]">
                Transportation
              </p>

              <p className="font-semibold">
                —
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}