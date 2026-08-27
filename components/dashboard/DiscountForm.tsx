"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { createDiscountCode } from "@/actions/discount-action";

export default function DiscountForm() {
  const [state, action, isPending] = useActionState(createDiscountCode, {
    message: undefined,
  });
  const [type, setType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");

  return (
    <form
      action={action}
      className="bg-muted/50 border p-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
      <div className="space-y-2">
        <Label className="uppercase">Code</Label>
        <Input name="code" placeholder="SUMMER25" required />
      </div>

      <div className="space-y-2">
        <Label className="uppercase">Type</Label>
        <Select
          value={type}
          onValueChange={(value) => setType(value as "PERCENTAGE" | "FIXED")}>
          <SelectTrigger className="w-full rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PERCENTAGE">Percentage</SelectItem>
            <SelectItem value="FIXED">Fixed amount</SelectItem>
          </SelectContent>
        </Select>
        <input type="hidden" name="type" value={type} />
      </div>

      <div className="space-y-2">
        <Label className="uppercase">
          Value {type === "PERCENTAGE" ? "(%)" : "(EGP)"}
        </Label>
        <Input name="value" type="number" min={0} required />
      </div>

      <div className="space-y-2">
        <Label className="uppercase">Max uses (optional)</Label>
        <Input name="maxUses" type="number" min={1} placeholder="Unlimited" />
      </div>

      <div className="space-y-2">
        <Label className="uppercase">Min order (EGP, optional)</Label>
        <Input name="minOrderAmount" type="number" min={0} />
      </div>

      <div className="space-y-2">
        <Label className="uppercase">Expires (optional)</Label>
        <Input name="expiresAt" type="date" />
      </div>

      <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
        <Button type="submit" disabled={isPending} className="rounded-none">
          {isPending ? "Creating..." : "Create Code"}
        </Button>
        {state?.message && (
          <p className="text-xs text-destructive">{state.message}</p>
        )}
      </div>
    </form>
  );
}
