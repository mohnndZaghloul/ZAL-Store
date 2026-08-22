import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/actions/customers-actions";
import { Button } from "@/components/ui/button";
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
    redirect("/");
  }

  const user = await getCurrentUser();
  const returnUrl = variantId
    ? `/checkout?variantId=${variantId}&quantity=${quantity ?? 1}`
    : "/checkout";

  return (
    <div className="container py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <h1 className="text-2xl font-semibold mb-6 text-primary">
          Shipping & Payment
        </h1>

        {user ? (
          <CheckoutForm variantId={variantId} quantity={quantity} />
        ) : (
          <div className="border p-6 text-center space-y-4">
            <p className="text-neutral">
              Sign in to place your order — browsing and your cart don&apos;t
              require an account, but confirming an order does.
            </p>
            <Button>
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(returnUrl)}`}>
                Sign in to continue
              </Link>
            </Button>
          </div>
        )}
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
                  Size : {item.size} - Color :{" "}
                  <span
                    style={{ background: item.color }}
                    className="rounded-full inline-block w-3 aspect-square"
                  />{" "}
                  × {item.quantity}
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
