"use client";

import SpecialButton from "@/components/SpecialButton";
import { Product_TP } from "@/types";
import { Plus, Minus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { useAddToCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";

export default function AddToCartSection({ product }: { product: Product_TP }) {
  const [variantId, setVariantId] = useState(product?.variants?.[0].id);
  const [quantity, setQuantity] = useState(1);
  const addMutation = useAddToCart();
  const router = useRouter();
  const CartCount = useCartStore((state) => state.count);
  const setCartCount = useCartStore((state) => state.setCartCount);

  const handleAdding = () => {
    const variant = product.variants?.find(
      (variant) => variant.id == variantId,
    );
    if (quantity < variant?.stock!) {
      setQuantity((prev) => ++prev);
    }
  };
  const handleRemove = () => {
    if (quantity > 1) {
      setQuantity((prev) => --prev);
    }
  };

  const handleAddToCart = () => {
    const variant = product.variants?.find(
      (variant) => variant.id == variantId,
    );
    addMutation.mutate({
      productId: product.id,
      variantId: variant?.id!,
      quantity,
    });
    setCartCount(CartCount + quantity);
  };

  const handleCheckout = () => {
    router.push(`./checkout?variantId=${variantId}&quantity=${quantity}`);
  };

  return (
    <section className="py-4 space-y-4">
      <div>
        <p>Size</p>
        <div className="flex gap-4 pt-2">
          {product?.variants?.map((item) => {
            const isSelected = item.id === variantId;
            if (item.stock === 0) {
              return (
                <div className="group space-x-2">
                  <SpecialButton key={item.id} destructive>
                    {item.size}
                  </SpecialButton>
                  <span className="text-destructive  group-focus-within:opacity-100 opacity-0">
                    out of stock
                  </span>
                </div>
              );
            }
            return (
              <SpecialButton
                key={item.id}
                info={!isSelected}
                onClick={() => setVariantId(item.id)}>
                {item.size}
              </SpecialButton>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between gap-2">
        <div className="flex items-center gap-4 border p-2">
          <Button variant="ghost" onClick={handleRemove}>
            <Minus className="w-8 h-8" />
          </Button>
          {quantity}
          <Button variant="ghost" onClick={handleAdding}>
            <Plus className="w-8 h-8" />
          </Button>
        </div>
        <SpecialButton
          disable={addMutation.isPending}
          onClick={async () => await handleAddToCart()}
          className="w-full">
          {addMutation.isPending ? "adding..." : "add to cart"}
        </SpecialButton>
      </div>
      <SpecialButton className="w-full" onClick={handleCheckout}>
        buy now
      </SpecialButton>
      <div className="text-sm">{product.description}</div>
    </section>
  );
}
