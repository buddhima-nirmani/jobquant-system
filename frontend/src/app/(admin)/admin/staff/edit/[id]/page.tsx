import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import PageHeader from "@/components/layouts/PageHeader";
import StaffForm from "@/components/staff/StaffForm";
import { Button } from "@/components/ui/button";

interface EditStaffPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditStaffPage({
  params,
}: EditStaffPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-8">
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
          title="Edit Staff"
          description={`Update information for staff member #${id}.`}
        />
      </div>

      <StaffForm mode="edit" />
    </div>
  );
}