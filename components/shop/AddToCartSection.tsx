"use client";

import SpecialButton from "@/components/SpecialButton";
import { Product_TP } from "@/types";
import { Plus, Minus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { addToCart } from "@/actions/cart-actions";
import { useCartStore } from "@/store/cart";

export default function AddToCartSection({ product }: { product: Product_TP }) {
  const [variantId, setVariantId] = useState(product?.variants?.[0].id);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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
  const handleAddToCart = async () => {
    setIsLoading(true);
    const variant = product.variants?.find(
      (variant) => variant.id == variantId,
    );
    await addToCart(product.id, variant?.id!, quantity);
    setCartCount(CartCount + quantity);
    setIsLoading(false);
  };

  return (
    <section className="py-4 space-y-4">
      <div>
        <p>Size</p>
        <div className="flex gap-4 pt-2">
          {product?.variants?.map((item) => {
            const isSelected = item.id === variantId;
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
          disable={isLoading}
          onClick={async () => await handleAddToCart()}
          className="w-full">
          {isLoading ? "adding..." : "add to cart"}
        </SpecialButton>
      </div>
      <SpecialButton className="w-full">buy now</SpecialButton>
      <div className="text-sm">{product.description}</div>
    </section>
  );
}
