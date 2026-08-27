"use client";

import { useState } from "react";
import Image from "next/image";
import CheckoutForm from "@/components/forms/CheckoutForm";
import { getShippingFee } from "@/lib/shipping";
import type { CheckoutData } from "@/lib/checkout";

export default function CheckoutPageClient({
  checkoutData,
  variantId,
  quantity,
}: {
  checkoutData: CheckoutData;
  variantId?: string;
  quantity?: string;
}) {
  const [governorate, setGovernorate] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const shippingFee = getShippingFee(governorate);
  const total = Math.max(
    0,
    checkoutData.subtotal + shippingFee - discountAmount,
  );

  return (
    <div className="container py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <h1 className="text-2xl font-semibold mb-6 text-primary">
          Shipping & Payment
        </h1>

        <CheckoutForm
          variantId={variantId}
          quantity={quantity}
          subtotal={checkoutData.subtotal}
          onGovernorateChange={setGovernorate}
          onDiscountApplied={setDiscountAmount}
        />
      </div>

      <div className="bg-tertiary p-6 border">
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Order Summary
        </h2>
        <div className="space-y-4">
          {checkoutData.items.map((item) => (
            <div key={item.variantId} className="flex gap-4">
              <div className="relative w-16 h-16 shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-neutral">
                  {item.size} / {item.color} × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium text-nowrap">
                EGP {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm text-neutral">
            <span>Subtotal</span>
            <span>EGP {checkoutData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-neutral">
            <span>Shipping</span>
            <span>
              {governorate
                ? `EGP ${shippingFee.toFixed(2)}`
                : "Select governorate"}
            </span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-emerald-700">
              <span>Discount</span>
              <span>- EGP {discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-primary pt-2 border-t">
            <span>Total</span>
            <span>EGP {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
