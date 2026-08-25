"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ClientSummary } from "@/lib/api";
import { parseApiDate } from "@/lib/format";
import { addPdfLetterhead } from "@/lib/pdf";

export default function ExportClientsButton({
  clients,
}: {
  clients: ClientSummary[];
}) {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport() {
    setIsExporting(true);

    try {
      const { default: jsPDF } = await import("jspdf");
      const { autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF();
      const startY = await addPdfLetterhead(doc, "Registered Clients");

      autoTable(doc, {
        startY,
        head: [["Name", "Company", "Email", "Phone", "Active Jobs", "Status", "Joined"]],
        body: clients.map((client) => [
          client.name,
          client.company ?? "—",
          client.email,
          client.phone ?? "—",
          String(client.active_jobs),
          client.is_active ? "Active" : "Inactive",
          parseApiDate(client.created_at).toLocaleDateString(),
        ]),
        headStyles: { fillColor: [255, 107, 0] },
        styles: { fontSize: 9 },
      });

      doc.save(`jobquant-clients-${new Date().toISOString().slice(0, 10)}.pdf`);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting || clients.length === 0}
      className="h-11 rounded-xl bg-[#FF6B00] hover:bg-[#E55F00]"
    >
      <FileDown size={18} className="mr-2" />
      {isExporting ? "Generating..." : "Export Client List (PDF)"}
    </Button>
  );
}
