"use client";

import { useEffect, useState } from "react";

import PageHeader from "@/components/layouts/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import LoadingState from "@/components/ui/LoadingState";

import { CurrentUser, getCurrentUser } from "@/lib/auth";
import { updateProfile } from "@/lib/api";

export default function ProfilePageContent() {
  const { showToast } = useToast();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCurrentUser().then((current) => {
      if (current) {
        setUser(current);
        setName(current.name);
        setPhone(current.phone ?? "");
        setCompany(current.company ?? "");
      }
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setError("");
    setIsSaving(true);
    try {
      await updateProfile({
        name,
        phone: phone || null,
        company: company || null,
      });
      showToast("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update profile.");
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return <LoadingState label="Loading profile..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" description="View and update your account details." />

      <Card className="max-w-xl rounded-2xl border border-[#EAEAEA] shadow-sm">
        <CardContent className="space-y-5 p-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Full Name
            </label>
            <Input
              placeholder="Enter the full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Email Address
            </label>
            <Input value={user?.email ?? ""} readOnly className="bg-[#F8FAFC]" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Phone Number
            </label>
            <Input
              placeholder="Enter the contact or phone number"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>

          {user?.role === "client" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Company
              </label>
              <Input
                placeholder="Enter the company name"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
              />
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#FF6B00] hover:bg-[#E65C00]"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
