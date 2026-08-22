"use client";

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
  Truck,
  RecycleIcon,
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

export default function SidebarCart() {
  const { setOpen } = useSidebar();
  const { data } = useGetCart();
  const addMutation = useAddToCart();
  const decrementMutation = useDecrementFromCart();
  const removeMutation = useRemoveFromCart();
  const CartCount = useCartStore((state) => state.count);
  const setCartCount = useCartStore((state) => state.setCartCount);
  const incrementCart = useCartStore((state) => state.incrementCart);
  const decrementCart = useCartStore((state) => state.decrementCart);

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
              onClick={() => setOpen(false)}>
              <XIcon className="h-4! w-4!" />
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="space-y-4" />
        <div className="space-y-4 px-2">
          {data?.map((product) => (
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
                    EGP {product?.product?.price}
                  </p>
                  <div className="flex mt-2 gap-2 items-center">
                    <div className="flex w-fit items-center gap-1 md:gap-2 border p-1">
                      <Button
                        variant="ghost"
                        disabled={
                          addMutation.isPending ||
                          decrementMutation.isPending ||
                          removeMutation.isPending
                        }
                        onClick={() =>
                          handleDecrement(product.id, product.quantity)
                        }>
                        <Minus className="w-4 h-4 md:w-8 md:h-8" />
                      </Button>
                      {addMutation.isPending ||
                      decrementMutation.isPending ||
                      removeMutation.isPending ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        product.quantity
                      )}
                      <Button
                        variant="ghost"
                        disabled={
                          addMutation.isPending ||
                          decrementMutation.isPending ||
                          removeMutation.isPending
                        }
                        onClick={() =>
                          handleAddToCart(product.productId!, product.variantId)
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
                  EGP {product.quantity * product.product?.price!}
                </h3>
              </div>
            </div>
          ))}
        </div>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
