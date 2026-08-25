"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useJobForm } from "./JobFormContext";

function formatLKR(value: number) {
  return `LKR ${value.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function PricingInformationSection() {
  const {
    items,
    estimatedCost,
    isPredicting,
    predictionError,
    hasPredicted,
    predictCost,
    finalCost,
    setFinalCost,
  } = useJobForm();

  const savedItems = items.filter((item) => item.saved);

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
              Predicted Cost
            </label>

            <Input
              value={
                estimatedCost !== null
                  ? formatLKR(estimatedCost)
                  : "Waiting for prediction..."
              }
              readOnly
              className="bg-[#FAF8F4]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Final Approved Cost
            </label>

            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={finalCost}
              onChange={(event) => setFinalCost(event.target.value)}
            />
          </div>

        </div>

        <div className="flex items-center gap-4">
          <Button
            type="button"
            onClick={predictCost}
            disabled={isPredicting || savedItems.length === 0}
            className="bg-[#FF6B00] hover:bg-[#E65C00]"
          >
            {isPredicting
              ? "Predicting..."
              : hasPredicted
              ? "Re-Predict Cost"
              : "Predict Cost"}
          </Button>

          {estimatedCost !== null && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setFinalCost(estimatedCost.toFixed(2))}
            >
              Use Predicted Cost
            </Button>
          )}
        </div>

        {predictionError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {predictionError}
          </div>
        )}

        <div className="rounded-xl border border-[#EAEAEA] bg-[#FAFBFC] p-5">

          <h4 className="mb-4 font-semibold text-[#0F172A]">
            Cost Breakdown by Item
          </h4>

          {savedItems.length === 0 ? (
            <p className="text-sm text-[#64748B]">
              Save order items above to see a per-item cost breakdown.
            </p>
          ) : (
            <div className="space-y-3">
              {savedItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <p className="text-[#64748B]">
                    {item.productName || `Item ${index + 1}`}{" "}
                    <span className="text-[#94A3B8]">
                      (Qty: {item.quantity || 0}
                      {item.width && item.height
                        ? `, ${item.width}x${item.height} ${item.unit}`
                        : ""}
                      )
                    </span>
                  </p>

                  <p className="font-semibold text-[#0F172A]">
                    {item.predictedCost !== null
                      ? formatLKR(item.predictedCost)
                      : "—"}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

      </CardContent>
    </Card>
  );
}
