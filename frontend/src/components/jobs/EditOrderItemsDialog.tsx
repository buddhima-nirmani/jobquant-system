"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

import { JobItemPayload, JobItemResponse, updateJobItems } from "@/lib/api";

const FIELDS: { key: keyof JobItemPayload; label: string; type?: string }[] = [
  { key: "product_category", label: "Category" },
  { key: "product_name", label: "Product Name" },
  { key: "width", label: "Width", type: "number" },
  { key: "height", label: "Height", type: "number" },
  { key: "quantity", label: "Quantity", type: "number" },
  { key: "unit", label: "Unit" },
  { key: "material", label: "Material" },
  { key: "specification", label: "Specification" },
  { key: "print_type", label: "Print Type" },
  { key: "lamination", label: "Lamination" },
  { key: "installation", label: "Installation" },
];

function toEditable(item: JobItemResponse): JobItemPayload {
  return {
    product_category: item.product_category,
    product_name: item.product_name,
    width: item.width,
    height: item.height,
    area: item.area,
    unit: item.unit,
    quantity: item.quantity,
    material: item.material,
    specification: item.specification,
    print_type: item.print_type,
    lamination: item.lamination,
    installation: item.installation,
    predicted_cost: item.predicted_cost,
  };
}

export default function EditOrderItemsDialog({
  jobId,
  items,
  onUpdated,
}: {
  jobId: number;
  items: JobItemResponse[];
  onUpdated: () => void;
}) {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<JobItemPayload[]>(items.map(toEditable));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  function openDialog() {
    setRows(items.map(toEditable));
    setError("");
    setOpen(true);
  }

  function updateRow(index: number, key: keyof JobItemPayload, value: string) {
    setRows((current) =>
      current.map((row, i) => {
        if (i !== index) return row;
        const numericKeys: (keyof JobItemPayload)[] = ["width", "height", "quantity"];
        const updated = {
          ...row,
          [key]: numericKeys.includes(key) ? Number(value) : value,
        };
        if (key === "width" || key === "height") {
          updated.area = Number(updated.width) * Number(updated.height);
        }
        return updated;
      })
    );
  }

  function addRow() {
    setRows((current) => [
      ...current,
      {
        product_category: "",
        product_name: "",
        width: 0,
        height: 0,
        area: 0,
        unit: "ft",
        quantity: 1,
        material: "",
        specification: "",
        print_type: "",
        lamination: "",
        installation: "No",
        predicted_cost: null,
      },
    ]);
  }

  function removeRow(index: number) {
    setRows((current) => current.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (rows.length === 0) {
      setError("At least one order item is required.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await updateJobItems(jobId, rows);
      showToast("Order details updated successfully.");
      setOpen(false);
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update order details.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? openDialog() : setOpen(false))}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil size={14} className="mr-2" />
          Edit Order Details
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Order Details</DialogTitle>
        </DialogHeader>

        <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
          {rows.map((row, index) => (
            <div key={index} className="rounded-xl border border-[#EAEAEA] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-[#0F172A]">Item {index + 1}</p>
                {rows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="rounded-lg p-1.5 hover:bg-red-50"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {FIELDS.map((field) => (
                  <div key={field.key}>
                    <label className="mb-1 block text-[10px] font-semibold uppercase text-[#94A3B8]">
                      {field.label}
                    </label>
                    <Input
                      type={field.type ?? "text"}
                      value={String(row[field.key] ?? "")}
                      onChange={(event) => updateRow(index, field.key, event.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addRow}>
            <Plus size={15} className="mr-2" />
            Add Item
          </Button>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#FF6B00] hover:bg-[#E65C00]"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
