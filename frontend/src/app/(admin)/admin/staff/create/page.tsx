import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import PageHeader from "@/components/layouts/PageHeader";
import StaffForm from "@/components/staff/StaffForm";
import { Button } from "@/components/ui/button";

export default function CreateStaffPage() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <Link href="/admin/staff">

            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl"
            >
              <ArrowLeft size={18} />
            </Button>

          </Link>

          <PageHeader
            title="Create Staff"
            description="Create a new staff account and assign system access."
          />

        </div>

      </div>

      <StaffForm mode="create" />

    </div>
  );
}