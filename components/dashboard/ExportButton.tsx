"use client";

import { useState } from "react";
import { Button } from "../ui/button";

type Props = {
  url: string;
  filePrefix: string;
  label?: string;
};

export default function ExportButton({
  url,
  filePrefix,
  label = "Export to Excel",
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Export failed (${res.status})`);

      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `${filePrefix}-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(href);
    } catch {
      alert("Export failed, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={loading}
      className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50">
      {loading ? "Exporting..." : label}
    </Button>
  );
}
