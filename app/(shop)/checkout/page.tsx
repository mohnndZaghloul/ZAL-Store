import { redirect } from "next/navigation";
import Image from "next/image";
import { resolveCheckoutData } from "@/lib/checkout";
import CheckoutForm from "@/components/forms/CheckoutForm";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ variantId?: string; quantity?: string }>;
}) {
  const { variantId, quantity } = await searchParams;
  const checkoutData = await resolveCheckoutData(variantId, quantity);

  if (!checkoutData) {
    // Buy Now with a bad/expired variant -> back to home.
    // Empty cart checkout -> back to the cart.
    redirect(variantId ? "/" : "/cart");
  }

  return (
    <div className="container py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <h1 className="text-2xl font-semibold mb-6 text-primary">
          Shipping & Payment
        </h1>

        <CheckoutForm variantId={variantId} quantity={quantity} />
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
        <div className="border-t mt-4 pt-4 flex justify-between font-semibold text-primary">
          <span>Total</span>
          <span>EGP {checkoutData.subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
