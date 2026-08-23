"use client";

import { Card, CardContent } from "@/components/ui/card";

import { Textarea } from "@/components/ui/textarea";

import { useJobForm } from "./JobFormContext";

export default function NotesSection() {
  const { notes, setNotes } = useJobForm();

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-semibold">
            06
          </div>

          <div>
            <h3 className="text-lg font-semibold">Notes & Instructions</h3>

            <p className="text-sm text-muted-foreground">
              Additional job requirements and special instructions.
            </p>
          </div>
        </div>

        <Textarea
          placeholder="Enter any special instructions, design requirements, delivery notes, or additional information..."
          className="min-h-32"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </CardContent>
    </Card>
  );
}
