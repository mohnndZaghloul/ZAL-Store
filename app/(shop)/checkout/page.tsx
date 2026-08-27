import { redirect } from "next/navigation";
import { resolveCheckoutData } from "@/lib/checkout";
import CheckoutPageClient from "@/components/shop/CheckoutPageClient";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ variantId?: string; quantity?: string }>;
}) {
  const { variantId, quantity } = await searchParams;
  const checkoutData = await resolveCheckoutData(variantId, quantity);

  if (!checkoutData) {
    redirect(variantId ? "/" : "/cart");
  }

  return (
    <CheckoutPageClient
      checkoutData={checkoutData}
      variantId={variantId}
      quantity={quantity}
    />
  );
}
