"use client";

import SpecialButton from "@/components/SpecialButton";
import { Product_TP } from "@/types";
import { Plus, Minus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { useAddToCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";

export default function AddToCartSection({
  product,
}: {
  product: Product_TP;
}) {
  const variants = product.variants ?? [];
  const allOutOfStock =
  variants.length === 0 ||
  variants.every((variant) => variant.stock <= 0);

  const [variantId, setVariantId] = useState(
    variants.find((variant) => variant.stock > 0)?.id ?? ""
  );
  const [quantity, setQuantity] = useState(1);

  const addMutation = useAddToCart();
  const router = useRouter();

  const setCartCount = useCartStore((state) => state.setCartCount);
  const cartCount = useCartStore((state) => state.count);

  const selectedVariant = variants.find(
    (variant) => variant.id === variantId
  );

  const isAvailable = (selectedVariant?.stock ?? 0) > 0;
  const maxQuantity = selectedVariant?.stock ?? 0;
  const isBusy = addMutation.isPending;

  const handleSelectVariant = (id: string) => {
    setVariantId(id);
    setQuantity(1);
  };

  const handleAdding = () => {
    if (!isAvailable || quantity >= maxQuantity) return;
    setQuantity((prev) => prev + 1);
  };

  const handleRemove = () => {
    if (quantity <= 1) return;
    setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || !isAvailable || isBusy) return;
    if (quantity > selectedVariant.stock) return;

    try {
      await addMutation.mutateAsync({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
      });

      setCartCount(cartCount + quantity);
    } catch (error) {
      console.error("Could not add product to cart:", error);
    }
  };

  const handleCheckout = () => {
    if (!selectedVariant || !isAvailable || isBusy) return;
    if (quantity > selectedVariant.stock) return;

    router.push(
      `./checkout?variantId=${selectedVariant.id}&quantity=${quantity}`
    );
  };

  return (
    <section className="py-4 space-y-4">
      <div>
        <p>Size</p>

        <div className="flex flex-wrap gap-4 pt-2">
          {variants.map((item) => {
            const isSelected = item.id === variantId;
            const outOfStock = item.stock <= 0;

            return (
              <div key={item.id} className="group space-x-2">
                <SpecialButton
                  destructive={outOfStock}
                  info={!isSelected && !outOfStock}
                  disable={outOfStock || isBusy}
                  onClick={() => {
                    if (!outOfStock) {
                      handleSelectVariant(item.id);
                    }
                  }}
                >
                  {item.size}
                </SpecialButton>

                {outOfStock && (
                  <span className="text-xs text-destructive">
                    Out of stock
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!isAvailable && (
        <p className="text-sm text-destructive">
          This item is out of stock.
        </p>
      )}

      <div className="flex justify-between gap-2">
        <div className="flex items-center gap-2 border p-2">
          <Button
            type="button"
            variant="ghost"
            disabled={!isAvailable || quantity <= 1 || isBusy}
            onClick={handleRemove}
            aria-label="Decrease quantity"
          >
            <Minus className="w-8 h-8" />
          </Button>

          <span>{quantity}</span>

          <Button
            type="button"
            variant="ghost"
            disabled={
              !isAvailable || quantity >= maxQuantity || isBusy
            }
            onClick={handleAdding}
            aria-label="Increase quantity"
          >
            <Plus className="w-8 h-8" />
          </Button>
        </div>


<SpecialButton
  destructive={allOutOfStock}
  disable={!isAvailable || isBusy || allOutOfStock}
  onClick={handleAddToCart}
  className="w-full"
>
  {allOutOfStock
    ? "Out of Stock"
    : isBusy
      ? "Adding..."
      : "Add to Cart"}
</SpecialButton>
      </div>


<SpecialButton
  className="w-full"
  destructive={allOutOfStock}
  disable={!isAvailable || isBusy || allOutOfStock}
  onClick={handleCheckout}
>
  {allOutOfStock ? "Out of Stock" : "Buy Now"}
</SpecialButton>

      <div className="text-sm">{product.description}</div>
    </section>
  );
}