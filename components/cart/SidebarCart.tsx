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
import { XIcon, ShoppingBag, Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import useGetCart from "@/hooks/useGetCart";
import Image from "next/image";
import { addToCart, decrementFromCart } from "@/actions/cart-actions";

export default function SidebarCart() {
  const { setOpen } = useSidebar();
  const { data } = useGetCart();

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
              <XIcon className="h-5! w-5!" />
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
                  <div className="flex mt-2 w-fit items-center gap-2 md:gap-4 border p-1">
                    <Button
                      variant="ghost"
                      onClick={async () =>
                        await decrementFromCart(product.id, product.quantity)
                      }>
                      <Minus className="w-4 h-4 md:w-8 md:h-8" />
                    </Button>
                    {product.quantity}
                    <Button
                      variant="ghost"
                      onClick={async () =>
                        await addToCart(
                          product.id,
                          product.variantId,
                          product.quantity,
                        )
                      }>
                      <Plus className="w-4 h-4 md:w-8 md:h-8" />
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
