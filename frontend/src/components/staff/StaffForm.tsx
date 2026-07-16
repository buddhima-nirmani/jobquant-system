"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface StaffFormProps {
  mode: "create" | "edit";
  defaultValues?: {
    fullName?: string;
    email?: string;
    phone?: string;
    role?: string;
  };
}

export default function StaffForm({
  mode,
  defaultValues,
}: StaffFormProps) {
  const values = defaultValues ?? {};

  return (
    <div className="space-y-8">
      {/* Personal Information */}

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">
          Personal Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <Input
              defaultValue={values.fullName}
              placeholder="John Silva"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email Address
            </label>

            <Input
              type="email"
              defaultValue={values.email}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone Number
            </label>

            <Input
              defaultValue={values.phone}
              placeholder="+94 77 123 4567"
            />
          </div>
        </div>
      </div>

      {/* Employment Details */}

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">
          Employment Details
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Role
            </label>

            <select
              defaultValue={values.role}
              className="h-11 w-full rounded-xl border border-[#CBD5E1] bg-white px-3 outline-none transition focus:border-[#FF6B00]"
            >
              <option value="">Select Role</option>
              <option value="Manager">Manager</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Designer">Designer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security */}

      {mode === "create" && (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-slate-900">
            Account Security
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <Input
                type="password"
                placeholder="Enter password"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Confirm Password
              </label>

              <Input
                type="password"
                placeholder="Confirm password"
              />
            </div>
          </div>
        </div>
      )}

      {/* Actions */}

      <div className="flex justify-end gap-4">
        <Button
          asChild
          variant="outline"
          className="h-11 rounded-xl"
        >
          <Link href="/admin/staff">
            Cancel
          </Link>
        </Button>

        <Button className="h-11 rounded-xl bg-[#FF6B00] hover:bg-[#E65C00]">
          {mode === "create"
            ? "Create Staff"
            : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}