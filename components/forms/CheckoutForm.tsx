"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckoutFormValues, checkoutSchema } from "@/lib/validation";
import { createOrder } from "@/actions/orders-action";

export default function CheckoutForm({
  variantId,
  quantity,
}: {
  variantId?: string;
  quantity?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = (values: CheckoutFormValues) => {
    setServerError(null);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("phone", values.phone);
    formData.append("address", values.address);
    formData.append("city", values.city);

    startTransition(async () => {
      const result = await createOrder(variantId, quantity, formData);
      if (result?.message) setServerError(result.message);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm text-neutral">Full name</label>
        <Input {...register("name")} />
        {errors.name && (
          <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm text-neutral">Phone</label>
        <Input {...register("phone")} />
        {errors.phone && (
          <p className="text-xs text-destructive mt-1">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-neutral">Address</label>
        <Input {...register("address")} />
        {errors.address && (
          <p className="text-xs text-destructive mt-1">
            {errors.address.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-neutral">City</label>
        <Input {...register("city")} />
        {errors.city && (
          <p className="text-xs text-destructive mt-1">{errors.city.message}</p>
        )}
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full rounded-none p-4">
        {isPending ? "Placing order..." : "Place Order"}
      </Button>
    </form>
  );
}
