"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { StaffSummary } from "@/lib/api";
import { parseApiDate } from "@/lib/format";
import { addPdfLetterhead } from "@/lib/pdf";

export default function StaffExportButton({
  staff,
}: {
  staff: StaffSummary[];
}) {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport() {
    setIsExporting(true);

    try {
      const { default: jsPDF } = await import("jspdf");
      const { autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF();
      const startY = await addPdfLetterhead(doc, "Staff Members");

      autoTable(doc, {
        startY,
        head: [["Name", "Email", "Phone", "Assigned Jobs", "Status", "Joined"]],
        body: staff.map((member) => [
          member.name,
          member.email,
          member.phone ?? "—",
          String(member.assigned_jobs),
          member.is_active ? "Active" : "Inactive",
          parseApiDate(member.created_at).toLocaleDateString(),
        ]),
        headStyles: { fillColor: [255, 107, 0] },
        styles: { fontSize: 9 },
      });

      doc.save(`jobquant-staff-${new Date().toISOString().slice(0, 10)}.pdf`);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting || staff.length === 0}
      variant="outline"
      className="h-11 rounded-xl"
    >
      <FileDown size={18} className="mr-2" />
      {isExporting ? "Generating..." : "Export Staff List (PDF)"}
    </Button>
  );
}
