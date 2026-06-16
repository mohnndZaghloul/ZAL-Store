"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./customers-actions";
import { unauthorized } from "next/navigation";

export const addToCart = async (productId: string) => {
  const user = await getCurrentUser();
  if (!user) unauthorized();

  const itemIsExist = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId: user.id,
        productId,
      },
    },
  });

  if (itemIsExist) {
    await prisma.cartItem.update({
      where: { id: itemIsExist.id },
      data: {
        quantity: { increment: 1 },
      },
    });
  } else {
    await prisma.cartItem.create({
      data: { userId: user.id, productId, quantity: 1 },
    });
  }
  revalidatePath("/cart");
};

export const removeFromCart = async (CartItemId: string) => {
  const user = await getCurrentUser();
  if (!user) unauthorized();

  await prisma.cartItem.delete({
    where: { id: CartItemId },
  });
  revalidatePath("/cart");
};

export const decrementFromCart = async (
  CartItemId: string,
  quantity: number,
) => {
  const itemIsExist = await prisma.cartItem.findUnique({
    where: { id: CartItemId },
  });

  if (itemIsExist && quantity > 1) {
    await prisma.cartItem.update({
      where: { id: itemIsExist.id },
      data: {
        quantity: { decrement: 1 },
      },
    });
  } else {
    await removeFromCart(CartItemId);
  }
  revalidatePath("/cart");
};

export const getCart = async () => {
  const user = await getCurrentUser();

  const AllCart = await prisma.cartItem.findMany({
    where: { userId: user?.id },
  });
  return AllCart;
};

export const getCartProducts = async () => {
  const user = await getCurrentUser();

  return await prisma.cartItem.findMany({
    where: { userId: user?.id },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });
};
