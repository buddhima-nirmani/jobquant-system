"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Trash2, Check } from "lucide-react";

type OrderItem = {
  description: string;
  size: string;
  quantity: string;
  saved: boolean;
};

export default function OrderDetailsSection() {
  const [transportation, setTransportation] = useState(false);

  const [items, setItems] = useState<OrderItem[]>([
    {
      description: "",
      size: "",
      quantity: "",
      saved: false,
    },
  ]);

  const updateItem = (index: number, field: keyof OrderItem, value: string) => {
    const updated = [...items];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setItems(updated);
  };

  const saveRow = (index: number) => {
    const updated = [...items];

    updated[index].saved = true;

    setItems(updated);
  };

  const addRow = () => {
    if (!items[items.length - 1].saved) return;

    setItems([
      ...items,
      {
        description: "",
        size: "",
        quantity: "",
        saved: false,
      },
    ]);
  };

  const removeRow = (index: number) => {
    if (items.length === 1) return;

    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <Card className="rounded-2xl border border-[#EAEAEA] shadow-sm">
      <CardContent className="space-y-6 p-6">
        {/* Header */}

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF2E8] font-semibold text-[#FF6B00]">
            04
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#0F172A]">
              Order Details
            </h3>

            <p className="text-sm text-[#64748B]">
              Configure printing specifications.
            </p>
          </div>
        </div>

        {/* Printing Options */}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Print Type
            </label>

            <Select>
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Select Print Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="large">Large Format</SelectItem>

                <SelectItem value="offset">Offset Printing</SelectItem>

                <SelectItem value="digital">Digital Printing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Material
            </label>

            <Select>
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Select Material" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="vinyl">Vinyl</SelectItem>

                <SelectItem value="flex">Flex</SelectItem>

                <SelectItem value="paper">Paper</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Material Type
            </label>

            <Select>
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Select Material Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="matte">Matte</SelectItem>

                <SelectItem value="gloss">Gloss</SelectItem>

                <SelectItem value="satin">Satin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Items Table */}

        <div className="overflow-hidden rounded-xl border border-[#EAEAEA]">
          <table className="w-full">
            <thead className="bg-[#FAFBFC]">
              <tr className="border-b border-[#EAEAEA]">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Description
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Size
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Quantity
                </th>

                <th className="w-14 text-center"></th>

                <th className="w-14 text-center"></th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b last:border-none">
                  <td className="p-3">
                    <Input
                      placeholder="Vehicle Sticker"
                      value={item.description}
                      disabled={item.saved}
                      onChange={(e) =>
                        updateItem(index, "description", e.target.value)
                      }
                    />
                  </td>

                  <td className="p-3">
                    <Input
                      placeholder="4 × 6 ft"
                      value={item.size}
                      disabled={item.saved}
                      onChange={(e) =>
                        updateItem(index, "size", e.target.value)
                      }
                    />
                  </td>

                  <td className="p-3">
                    <Input
                      type="number"
                      placeholder="10"
                      value={item.quantity}
                      disabled={item.saved}
                      onChange={(e) =>
                        updateItem(index, "quantity", e.target.value)
                      }
                    />
                  </td>

                  {/* Save */}

                  <td className="text-center">
                    <Button
                      type="button"
                      size="icon"
                      title="Save Item"
                      onClick={() => saveRow(index)}
                      disabled={
                        item.saved ||
                        !item.description ||
                        !item.size ||
                        !item.quantity
                      }
                      className="h-9 w-9 bg-[#FF6B00] hover:bg-[#E55F00] disabled:bg-[#FFB27A] disabled:opacity-100"
                    >
                      <Check size={18} className="text-white" />
                    </Button>
                  </td>

                  {/* Delete */}

                  <td className="text-center">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      title="Remove Item"
                      onClick={() => removeRow(index)}
                      disabled={
                        index === 0 && items.length === 1 && !item.saved
                      }
                      className="h-9 w-9 hover:bg-red-50"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Item */}

        <div className="flex justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={addRow}
            disabled={!items[items.length - 1].saved}
            className="border-[#FF6B00] text-[#FF6B00] hover:bg-[#FFF2E8]"
          >
            <Plus size={16} className="mr-2" />
            Add Item
          </Button>
        </div>

        {/* Transportation */}

        <div className="rounded-xl border border-[#EAEAEA] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-[#0F172A]">
                Transportation Required?
              </h4>

              <p className="text-sm text-[#64748B]">
                Enable if delivery is required.
              </p>
            </div>

            <Switch
              checked={transportation}
              onCheckedChange={setTransportation}
            />
          </div>

          {transportation && (
            <div className="mt-5">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Distance (KM)
              </label>

              <Input type="number" placeholder="25" className="h-11" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
