"use client";

import { useTransition, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckoutFormValues, checkoutSchema } from "@/lib/validation";
import { createOrder } from "@/actions/orders-action";
import { GOVERNORATES } from "@/lib/shipping";
import {
  DiscountValidation,
  validateDiscountCode,
} from "@/actions/discount-action";

export default function CheckoutForm({
  variantId,
  quantity,
  subtotal,
  onGovernorateChange,
  onDiscountApplied,
}: {
  variantId?: string;
  quantity?: string;
  subtotal: number;
  onGovernorateChange: (governorate: string) => void;
  onDiscountApplied: (discountAmount: number) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const [isApplyingDiscount, startDiscountTransition] = useTransition();
  const [discountResult, setDiscountResult] =
    useState<DiscountValidation | null>(null);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "CASH" },
  });

  const handleApplyDiscount = () => {
    const code = getValues("discountCode") ?? "";
    startDiscountTransition(async () => {
      const result = await validateDiscountCode(code, subtotal);
      setDiscountResult(result);
      onDiscountApplied(result.valid ? result.discountAmount : 0);
    });
  };

  const onSubmit = (values: CheckoutFormValues) => {
    setServerError(null);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("phone", values.phone);
    formData.append("address", values.address);
    formData.append("city", values.city);
    formData.append("paymentMethod", values.paymentMethod);
    if (values.discountCode) {
      formData.append("discountCode", values.discountCode);
    }

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
        <label className="text-sm text-neutral">Governorate</label>
        <Controller
          control={control}
          name="city"
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={(value) => {
                const next = value ?? "";
                field.onChange(next);
                onGovernorateChange(next);
              }}>
              <SelectTrigger className="w-full rounded-none">
                <SelectValue placeholder="Select your governorate" />
              </SelectTrigger>
              <SelectContent>
                {GOVERNORATES.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label} — EGP {g.fee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.city && (
          <p className="text-xs text-destructive mt-1">{errors.city.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm text-neutral mb-2 block">
          Payment method
        </label>
        <Controller
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
              className="flex gap-6">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="CASH" id="payment-cash" />
                <Label htmlFor="payment-cash">Cash on Delivery</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="INSTAPAY" id="payment-instapay" />
                <Label htmlFor="payment-instapay">InstaPay</Label>
              </div>
            </RadioGroup>
          )}
        />
        {errors.paymentMethod && (
          <p className="text-xs text-destructive mt-1">
            {errors.paymentMethod.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-neutral">Discount code</label>
        <div className="flex gap-2">
          <Input {...register("discountCode")} placeholder="Optional" />
          <Button
            type="button"
            variant="outline"
            disabled={isApplyingDiscount}
            onClick={handleApplyDiscount}>
            {isApplyingDiscount ? "Checking..." : "Apply"}
          </Button>
        </div>
        {discountResult && !discountResult.valid && (
          <p className="text-xs text-destructive mt-1">
            {discountResult.message}
          </p>
        )}
        {discountResult?.valid && (
          <p className="text-xs text-emerald-700 mt-1">
            Code applied — EGP {discountResult.discountAmount} off.
          </p>
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
