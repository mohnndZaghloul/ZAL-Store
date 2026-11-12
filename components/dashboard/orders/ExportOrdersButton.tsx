"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ExportOrdersButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders/export");
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={loading}
      className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50">
      {loading ? "Exporting..." : "Export to Excel"}
    </Button>
  );
}
