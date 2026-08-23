"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/toast";

import { createStaff, listStaff, updateStaff } from "@/lib/api";

interface StaffFormProps {
  mode: "create" | "edit";
  staffId?: number;
}

export default function StaffForm({ mode, staffId }: StaffFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "edit" && staffId) {
      listStaff()
        .then((members) => {
          const member = members.find((item) => item.id === staffId);
          if (member) {
            setName(member.name);
            setEmail(member.email);
            setPhone(member.phone ?? "");
          }
        })
        .finally(() => setLoading(false));
    }
  }, [mode, staffId]);

  async function handleSubmit() {
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    if (mode === "create") {
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === "create") {
        await createStaff({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          password,
        });
      } else if (staffId) {
        await updateStaff(staffId, {
          name: name.trim(),
          phone: phone.trim() || null,
        });
      }

      showToast(
        mode === "create"
          ? "Staff member added successfully."
          : "Staff member updated successfully."
      );
      router.push("/admin/staff");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save staff member.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-[#94A3B8]">Loading staff member...</p>;
  }

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
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter the full name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter the email address"
              disabled={mode === "edit"}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone Number
            </label>
            <Input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Enter the contact or phone number"
            />
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
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Confirm Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm password"
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <ConfirmDialog
          trigger={
            <Button variant="outline" className="h-11 rounded-xl">
              Cancel
            </Button>
          }
          title="Cancel this form?"
          description="Any information you've entered will be lost and cannot be recovered."
          confirmLabel="Discard & Leave"
          onConfirm={() => router.push("/admin/staff")}
        />

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="h-11 rounded-xl bg-[#FF6B00] hover:bg-[#E65C00]"
        >
          {isSubmitting
            ? "Saving..."
            : mode === "create"
            ? "Create Staff"
            : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
