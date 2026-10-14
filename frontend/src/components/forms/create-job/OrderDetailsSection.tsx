"use client";

import { useJobForm } from "./JobFormContext";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { Plus, Trash2, Check } from "lucide-react";

export default function OrderDetailsSection() {
  const {
    items,
    setItems,
    transportation,
    setTransportation,
    distance,
    setDistance,
  } = useJobForm();

  const updateItem = (
    index: number,
    field:
      | "productCategory"
      | "productName"
      | "width"
      | "height"
      | "area"
      | "unit"
      | "quantity"
      | "material"
      | "specification"
      | "printType"
      | "lamination"
      | "installation",
    value: string
  ) => {
    const updated = [...items];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    if (field === "width" || field === "height") {
      const width =
        field === "width"
          ? Number(value)
          : Number(updated[index].width);

      const height =
        field === "height"
          ? Number(value)
          : Number(updated[index].height);

      if (width > 0 && height > 0) {
        updated[index].area = (width * height).toFixed(2);
      } else {
        updated[index].area = "";
      }
    }

    setItems(updated);
  };

  const itemError = (item: (typeof items)[number]): string | null => {
    if (Number(item.width) <= 0) {
      return "Width must be greater than 0.";
    }
    if (Number(item.height) <= 0) {
      return "Height must be greater than 0.";
    }
    if (Number(item.quantity) <= 0) {
      return "Quantity must be greater than 0.";
    }
    return null;
  };

  const saveRow = (index: number) => {
    if (itemError(items[index])) {
      return;
    }

    const updated = [...items];

    updated[index] = {
      ...updated[index],
      saved: true,
    };

    setItems(updated);
  };

  const addRow = () => {
    const lastItem = items[items.length - 1];

    if (!lastItem.saved) {
      return;
    }

    setItems([
      ...items,
      {
        productCategory: "",
        productName: "",
        width: "",
        height: "",
        area: "",
        unit: "",
        quantity: "",
        material: "",
        specification: "",
        printType: "",
        lamination: "",
        installation: "",
        predictedCost: null,
        saved: false,
      },
    ]);
  };

  const removeRow = (index: number) => {
    if (items.length === 1) {
      return;
    }

    setItems(items.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <Card className="rounded-2xl border border-[#EAEAEA] shadow-sm">
      <CardContent className="space-y-6 p-6">

        {/* Section Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF2E8] font-semibold text-[#FF6B00]">
            04
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#0F172A]">
              Order Details
            </h3>

            <p className="text-sm text-[#64748B]">
              Enter the printing specifications used for cost estimation.
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-[#EAEAEA] p-5"
            >
              {/* Item Header */}
              <div className="mb-5 flex items-center justify-between">
                <h4 className="font-medium text-[#0F172A]">
                  Item {index + 1}
                </h4>

                {items.length > 1 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    title="Remove Item"
                    onClick={() => removeRow(index)}
                    disabled={item.saved}
                    className="h-9 w-9 hover:bg-red-50"
                  >
                    <Trash2
                      size={17}
                      className="text-red-500"
                    />
                  </Button>
                )}
              </div>

              {/* Product Information */}
              <div className="grid gap-6 lg:grid-cols-2">

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Product Category
                  </label>

                  <Input
                    placeholder="Vehicle Wrap"
                    value={item.productCategory}
                    disabled={item.saved}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "productCategory",
                        event.target.value
                      )
                    }
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Product Name
                  </label>

                  <Input
                    placeholder="Toyota Hilux Vehicle Wrap"
                    value={item.productName}
                    disabled={item.saved}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "productName",
                        event.target.value
                      )
                    }
                    className="h-11"
                  />
                </div>

              </div>

              {/* Dimensions */}
              <div className="mt-6 grid gap-6 lg:grid-cols-4">

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Width
                  </label>

                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="6"
                    value={item.width}
                    disabled={item.saved}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "width",
                        event.target.value
                      )
                    }
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Height
                  </label>

                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="3"
                    value={item.height}
                    disabled={item.saved}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "height",
                        event.target.value
                      )
                    }
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Area
                  </label>

                  <Input
                    value={item.area}
                    readOnly
                    placeholder="Calculated"
                    className="h-11 bg-[#FAF8F4]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Unit
                  </label>

                  <Input
                    placeholder="ft"
                    value={item.unit}
                    disabled={item.saved}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "unit",
                        event.target.value
                      )
                    }
                    className="h-11"
                  />
                </div>

              </div>

              {/* Quantity / Material / Specification */}
              <div className="mt-6 grid gap-6 lg:grid-cols-3">

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Quantity
                  </label>

                  <Input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={item.quantity}
                    disabled={item.saved}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "quantity",
                        event.target.value
                      )
                    }
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Material
                  </label>

                  <Input
                    placeholder="Vinyl"
                    value={item.material}
                    disabled={item.saved}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "material",
                        event.target.value
                      )
                    }
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Specification
                  </label>

                  <Input
                    placeholder="Cast Vinyl - Matte"
                    value={item.specification}
                    disabled={item.saved}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "specification",
                        event.target.value
                      )
                    }
                    className="h-11"
                  />
                </div>

              </div>

              {/* Printing / Finishing */}
              <div className="mt-6 grid gap-6 lg:grid-cols-3">

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Print Type
                  </label>

                  <Input
                    placeholder="Digital"
                    value={item.printType}
                    disabled={item.saved}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "printType",
                        event.target.value
                      )
                    }
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Lamination
                  </label>

                  <Input
                    placeholder="Matte"
                    value={item.lamination}
                    disabled={item.saved}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "lamination",
                        event.target.value
                      )
                    }
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Installation
                  </label>

                  <Input
                    placeholder="Yes"
                    value={item.installation}
                    disabled={item.saved}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "installation",
                        event.target.value
                      )
                    }
                    className="h-11"
                  />
                </div>

              </div>

              {/* Save Item */}
              {(() => {
                const allFieldsFilled =
                  !!item.productCategory &&
                  !!item.productName &&
                  !!item.width &&
                  !!item.height &&
                  !!item.area &&
                  !!item.unit &&
                  !!item.quantity &&
                  !!item.material &&
                  !!item.specification &&
                  !!item.printType &&
                  !!item.lamination &&
                  !!item.installation;

                const currentItemError = allFieldsFilled
                  ? itemError(item)
                  : null;

                return (
                  <div className="mt-5 space-y-2">
                    {currentItemError && !item.saved && (
                      <p className="text-right text-sm text-red-600">
                        {currentItemError}
                      </p>
                    )}

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={() => saveRow(index)}
                        disabled={item.saved || !allFieldsFilled || !!currentItemError}
                        className="bg-[#FF6B00] hover:bg-[#E55F00] disabled:bg-[#FFB27A]"
                      >
                        <Check size={17} className="mr-2" />

                        {item.saved ? "Saved" : "Save Item"}
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          ))}
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
                This determines the Transport value used by the model.
              </p>
            </div>

            <Switch
              checked={transportation}
              onCheckedChange={setTransportation}
            />
          </div>

          {transportation && (
            <div className="mt-5 max-w-sm">

              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Distance (KM)
              </label>

              <Input
                type="number"
                min="0"
                step="0.1"
                placeholder="25"
                value={distance}
                onChange={(event) =>
                  setDistance(event.target.value)
                }
                className="h-11"
              />

            </div>
          )}

        </div>

      </CardContent>
    </Card>
  );
}