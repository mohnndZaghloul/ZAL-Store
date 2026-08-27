"use client";

import { useTransition } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  deleteDiscountCode,
  toggleDiscountCode,
} from "@/actions/discount-action";
import { DiscountCode } from "@/generated/prisma/client";
import { Switch } from "@/components/ui/switch";

function ActiveToggle({ id, isActive }: { id: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Switch
      checked={isActive}
      disabled={isPending}
      onCheckedChange={(checked) =>
        startTransition(() => toggleDiscountCode(id, checked))
      }
    />
  );
}

function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant="destructive"
      size="icon"
      disabled={isPending}
      onClick={() => startTransition(() => deleteDiscountCode(id))}>
      <Trash2 size={16} />
    </Button>
  );
}

export const DiscountColumns: ColumnDef<DiscountCode>[] = [
  { accessorKey: "code", header: "Code" },
  { accessorKey: "type", header: "Type" },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) =>
      row.original.type === "PERCENTAGE"
        ? `${row.original.value}%`
        : `EGP ${row.original.value}`,
  },
  {
    id: "uses",
    header: "Uses",
    cell: ({ row }) =>
      `${row.original.usedCount} / ${row.original.maxUses ?? "∞"}`,
  },
  {
    accessorKey: "expiresAt",
    header: "Expires",
    cell: ({ row }) =>
      row.original.expiresAt
        ? new Date(row.original.expiresAt).toLocaleDateString("en-EG")
        : "—",
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => (
      <ActiveToggle id={row.original.id} isActive={row.original.isActive} />
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <DeleteButton id={row.original.id} />,
  },
];
