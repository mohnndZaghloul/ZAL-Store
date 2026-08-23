"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  XIcon,
  ShoppingBag,
  Minus,
  Plus,
  LoaderCircle,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  useAddToCart,
  useDecrementFromCart,
  useGetCart,
  useRemoveFromCart,
} from "@/hooks/useCart";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import SpecialButton from "../SpecialButton";
import { useRouter } from "next/navigation";

export default function SidebarCart() {
  const { setOpen, setOpenMobile, isMobile } = useSidebar();
  const router = useRouter();
  const { data, isPending } = useGetCart();
  const addMutation = useAddToCart();
  const decrementMutation = useDecrementFromCart();
  const removeMutation = useRemoveFromCart();
  const CartCount = useCartStore((state) => state.count);
  const setCartCount = useCartStore((state) => state.setCartCount);
  const incrementCart = useCartStore((state) => state.incrementCart);
  const decrementCart = useCartStore((state) => state.decrementCart);

  const closeCart = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  const handleAddToCart = (productId: string, variantId: string) => {
    addMutation.mutate({ productId, variantId, quantity: 1 });
    incrementCart();
  };

  const handleDecrement = (cartItemId: string, quantity: number) => {
    decrementMutation.mutate({ cartItemId, quantity });
    decrementCart();
  };
  const handleRemove = (cartItemId: string, quantity: number) => {
    removeMutation.mutate(cartItemId);
    setCartCount(CartCount - quantity);
  };

  // Same formula the checkout page uses (product price + variant price
  // modifier) — keeps the sidebar total consistent with what checkout shows.
  const unitPrice = (product: NonNullable<typeof data>[number]) =>
    (product.product?.price ?? 0) + (product.variant?.priceModifier ?? 0);

  const subtotal =
    data?.reduce((sum, item) => sum + unitPrice(item) * item.quantity, 0) ?? 0;

  const isEmpty = !isPending && (!data || data.length === 0);
  const isMutating =
    addMutation.isPending ||
    decrementMutation.isPending ||
    removeMutation.isPending;

  return (
    <Sidebar side="right">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-between items-center border-b p-4">
            <div className="flex gap-4">
              <ShoppingBag />
              <h3 className="font-light text-2xl">Cart</h3>
            </div>
            <Button
              size="icon-lg"
              variant="outline"
              className="rounded-none"
              onClick={closeCart}>
              <XIcon className="h-4! w-4!" />
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="space-y-4" />

        {isPending ? (
          <div className="flex justify-center py-10">
            <LoaderCircle className="animate-spin" />
          </div>
        ) : isEmpty ? (
          <p className="text-center text-neutral py-10">
            No products in your cart
          </p>
        ) : (
          <div className="space-y-4 px-2">
            {data!.map((product) => (
              <div key={product.id}>
                <div className="flex justify-between gap-2">
                  <div className="relative w-20 h-20">
                    <Image
                      src={product.product?.images[0]!}
                      alt={product.product?.title!}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mr-auto">
                    <p>{product?.product?.title}</p>
                    <p className="opacity-75 text-xs md:text-sm">
                      size : {product?.variant?.size}
                    </p>
                    <p className="opacity-75 text-xs md:text-sm">
                      EGP {unitPrice(product)}
                    </p>
                    <div className="flex mt-2 gap-2 items-center">
                      <div className="flex w-fit items-center gap-1 md:gap-2 border p-1">
                        <Button
                          variant="ghost"
                          disabled={isMutating}
                          onClick={() =>
                            handleDecrement(product.id, product.quantity)
                          }>
                          <Minus className="w-4 h-4 md:w-8 md:h-8" />
                        </Button>
                        {isMutating ? (
                          <LoaderCircle className="animate-spin" />
                        ) : (
                          product.quantity
                        )}
                        <Button
                          variant="ghost"
                          disabled={isMutating}
                          onClick={() =>
                            handleAddToCart(
                              product.productId!,
                              product.variantId,
                            )
                          }>
                          <Plus className="w-4 h-4 md:w-8 md:h-8" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          handleRemove(product.id, product.quantity)
                        }>
                        <Trash2 className="w-5! h-5!" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-nowrap">
                    EGP {(unitPrice(product) * product.quantity).toFixed(2)}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        <SidebarGroup />
      </SidebarContent>

      {!isEmpty && (
        <SidebarFooter>
          <div className="p-4 border-t space-y-3">
            <div className="flex justify-between items-center font-semibold text-primary">
              <span>Total</span>
              <span>EGP {subtotal.toFixed(2)}</span>
            </div>
            <SpecialButton
              className="w-full inline"
              onClick={() => {
                closeCart();
                router.push("/checkout");
              }}>
              checkout
            </SpecialButton>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
