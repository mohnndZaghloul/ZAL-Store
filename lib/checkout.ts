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
    const requestedQuantity = Math.max(
      1,
      parseInt(quantityParam ?? "1", 10) || 1,
    );

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant || !variant.product) return null;
    if (variant.stock < 1) return null;

    const quantity = Math.min(requestedQuantity, variant.stock);
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
          quantity,
          stock: variant.stock,
        },
      ],
      subtotal: price * quantity,
    };
  }

  // Cart mode — pulls from the same owner-scoped query used by the sidebar
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
        getEffectivePrice(item.product!.price, item.product!.discountPercent) +
        item.variant!.priceModifier,
      quantity: Math.min(item.quantity, item.variant!.stock),
      stock: item.variant!.stock,
    }));

  if (items.length === 0) return null;

  return {
    mode: "cart",
    items,
    subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  };
}
