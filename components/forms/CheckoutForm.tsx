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
import {
  CheckoutFormValues,
  checkoutSchema,
} from "@/lib/validation";
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
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

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

      onDiscountApplied(
        result.valid ? result.discountAmount : 0
      );
    });
  };

  const onSubmit = (values: CheckoutFormValues) => {
    setServerError(null);

    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("address", values.address);
    formData.append("city", values.city);
    formData.append("paymentMethod", values.paymentMethod);

    if (values.discountCode) {
      formData.append("discountCode", values.discountCode);
    }

    startTransition(async () => {
      const result = await createOrder(
        variantId,
        quantity,
        formData
      );

      if (result?.success && result.orderId) {
        setSuccessOrderId(result.orderId);
        return;
      }

      if (result?.message) {
        setServerError(result.message);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div>
        <label className="text-sm text-neutral">
          Full name
        </label>

        <Input {...register("name")} />

        {errors.name && (
          <p className="mt-1 text-xs text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-neutral">
          Email
        </label>

        <Input
          type="email"
          {...register("email")}
        />

        {errors.email && (
          <p className="mt-1 text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-neutral">
          Phone
        </label>

        <Input {...register("phone")} />

        {errors.phone && (
          <p className="mt-1 text-xs text-destructive">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-neutral">
          Address
        </label>

        <Input {...register("address")} />

        {errors.address && (
          <p className="mt-1 text-xs text-destructive">
            {errors.address.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-neutral">
          Governorate
        </label>

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
              }}
            >
              <SelectTrigger className="w-full rounded-none">
                <SelectValue placeholder="Select your governorate" />
              </SelectTrigger>

              <SelectContent>
                {GOVERNORATES.map((g) => (
                  <SelectItem
                    key={g.value}
                    value={g.value}
                  >
                    {g.label} — EGP {g.fee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.city && (
          <p className="mt-1 text-xs text-destructive">
            {errors.city.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm text-neutral">
          Payment method
        </label>

        <Controller
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={(value) =>
                field.onChange(value)
              }
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="CASH"
                  id="payment-cash"
                />

                <Label htmlFor="payment-cash">
                  Cash on Delivery
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="INSTAPAY"
                  id="payment-instapay"
                />

                <Label htmlFor="payment-instapay">
                  InstaPay
                </Label>
              </div>
            </RadioGroup>
          )}
        />

        {errors.paymentMethod && (
          <p className="mt-1 text-xs text-destructive">
            {errors.paymentMethod.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-neutral">
          Discount code
        </label>

        <div className="flex gap-2">
          <Input
            {...register("discountCode")}
            placeholder="Optional"
          />

          <Button
            type="button"
            variant="outline"
            disabled={isApplyingDiscount}
            onClick={handleApplyDiscount}
          >
            {isApplyingDiscount
              ? "Checking..."
              : "Apply"}
          </Button>
        </div>

        {discountResult &&
          !discountResult.valid && (
            <p className="mt-1 text-xs text-destructive">
              {discountResult.message}
            </p>
          )}

        {discountResult?.valid && (
          <p className="mt-1 text-xs text-emerald-700">
            Code applied — EGP{" "}
            {discountResult.discountAmount} off.
          </p>
        )}
      </div>

      {serverError && (
        <p className="text-sm text-destructive">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full rounded-none p-4"
      >
        {isPending
          ? "Placing order..."
          : "Place Order"}
      </Button>

      {successOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <svg
                className="h-8 w-8 text-emerald-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12.5 9.5 17 19 7.5"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold text-neutral-900">
              Order Placed Successfully!
            </h2>

            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Thank you for your order. Your order has
              been placed successfully, and we&apos;ve
              sent you an email with all your order
              details.
            </p>

            <div className="mt-5 bg-neutral-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                Order Number
              </p>

              <p className="mt-1 text-sm font-medium text-neutral-900">
                #{successOrderId.slice(0, 8)}
              </p>
            </div>

            <p className="mt-4 text-xs leading-5 text-neutral-500">
              We&apos;ll notify you by email when your
              order is shipped.
            </p>

            <Button
              type="button"
              className="mt-6 w-full rounded-none py-5"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Back to Home
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}