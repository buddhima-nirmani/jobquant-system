"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OrderDetailsSection() {
  const [transportation, setTransportation] =
    useState(false);

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-semibold">
            04
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Order Details
            </h3>

            <p className="text-sm text-muted-foreground">
              Configure printing specifications.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Print Type
            </label>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="large">
                  Large Format
                </SelectItem>

                <SelectItem value="offset">
                  Offset Printing
                </SelectItem>

                <SelectItem value="digital">
                  Digital Printing
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Material
            </label>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Material" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="vinyl">
                  Vinyl
                </SelectItem>

                <SelectItem value="flex">
                  Flex
                </SelectItem>

                <SelectItem value="paper">
                  Paper
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Material Type
            </label>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Finish" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="satin">
                  Satin Finish
                </SelectItem>

                <SelectItem value="matte">
                  Matte Finish
                </SelectItem>

                <SelectItem value="gloss">
                  Gloss Finish
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">
                  Description
                </th>

                <th className="p-3 text-left">
                  Size
                </th>

                <th className="p-3 text-left">
                  Quantity
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="p-3">
                  Satin Banner
                </td>

                <td className="p-3">
                  4x6 ft
                </td>

                <td className="p-3">
                  2
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">
                Transportation Required?
              </h4>

              <p className="text-sm text-muted-foreground">
                Enable if delivery is required.
              </p>
            </div>

            <Switch
              checked={transportation}
              onCheckedChange={setTransportation}
            />
          </div>

          {transportation && (
            <div className="mt-4">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Distance (KM)
              </label>

              <Input
                type="number"
                placeholder="25"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}