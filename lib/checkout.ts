import { prisma } from "@/lib/prisma";
import { getCartProducts } from "@/actions/cart-actions";
import { CheckoutItem_TP } from "@/types";
import { getEffectivePrice } from "./pricing";

export type CheckoutData = {
  mode: "buy-now" | "cart";
  items: CheckoutItem_TP[];
  subtotal: number;
};

export async function resolveCheckoutData(
  variantId?: string,
  quantityParam?: string,
): Promise<CheckoutData | null> {
  if (variantId) {
    const requestedQuantity = Number(quantityParam ?? "1");

    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity < 1
    ) {
      return null;
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant || !variant.product) return null;

    if (
      variant.stock < 1 ||
      requestedQuantity > variant.stock
    ) {
      return null;
    }

    const price =
      getEffectivePrice(
        variant.product.price,
        variant.product.discountPercent,
      ) + variant.priceModifier;

    return {
      mode: "buy-now",
      items: [
        {
          variantId: variant.id,
          productId: variant.productId,
          title: variant.product.title,
          image: variant.product.images[0] ?? "",
          size: variant.size,
          color: variant.color,
          price,
          quantity: requestedQuantity,
          stock: variant.stock,
        },
      ],
      subtotal: price * requestedQuantity,
    };
  }

  const cartItems = await getCartProducts();

  const items: CheckoutItem_TP[] = cartItems
    .filter((item) => item.variant && item.product)
    .map((item) => ({
      cartItemId: item.id,
      variantId: item.variantId,
      productId: item.productId!,
      title: item.product!.title,
      image: item.product!.images[0] ?? "",
      size: item.variant!.size,
      color: item.variant!.color,
      price:
        getEffectivePrice(
          item.product!.price,
          item.product!.discountPercent,
        ) + item.variant!.priceModifier,
      quantity: item.quantity,
      stock: item.variant!.stock,
    }));

  if (items.length === 0) return null;

  // Reject checkout if any cart item is no longer available
  // in the quantity requested by the customer.
  if (
    items.some(
      (item) =>
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.stock < item.quantity,
    )
  ) {
    return null;
  }

  return {
    mode: "cart",
    items,
    subtotal: items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    ),
  };
}