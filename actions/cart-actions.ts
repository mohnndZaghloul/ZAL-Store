"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./customers-actions";
import { getOrCreateGuestId } from "@/lib/guest-cart";

// Returns either { userId } for a logged-in user or { guestId } for an
// anonymous visitor. Spreading this into a Prisma `where` scopes every
// query to whoever owns the cart, without branching logic in each action.
async function getCartOwner() {
  const user = await getCurrentUser();
  if (user) {
    return { userId: user.id, guestId: undefined as string | undefined };
  }
  return {
    userId: undefined as string | undefined,
    guestId: await getOrCreateGuestId(),
  };
}

export const addToCart = async (
  productId: string,
  variantId: string,
  quantity: number = 1,
) => {
  const owner = await getCartOwner();

  // variantId is the real identity of a cart line (it encodes size/color).
  // productId is kept alongside as a convenience field for display/queries.
  const itemIsExist = await prisma.cartItem.findFirst({
    where: { ...owner, variantId },
  });

  if (itemIsExist) {
    await prisma.cartItem.update({
      where: { id: itemIsExist.id },
      data: { quantity: { increment: quantity } },
    });
  } else {
    await prisma.cartItem.create({
      data: { ...owner, productId, variantId, quantity },
    });
  }
  revalidatePath("/cart");
};

export const removeFromCart = async (CartItemId: string) => {
  const owner = await getCartOwner();

  // deleteMany + owner in the where clause means: delete this row only if
  // it actually belongs to the current user/guest. Deletes 0 rows if not.
  await prisma.cartItem.deleteMany({
    where: { id: CartItemId, ...owner },
  });
  revalidatePath("/cart");
};

export const decrementFromCart = async (
  CartItemId: string,
  quantity: number,
) => {
  const owner = await getCartOwner();

  const itemIsExist = await prisma.cartItem.findFirst({
    where: { id: CartItemId, ...owner },
  });

  if (!itemIsExist) return; // not found, or doesn't belong to this owner

  if (quantity > 1) {
    await prisma.cartItem.update({
      where: { id: itemIsExist.id },
      data: { quantity: { decrement: 1 } },
    });
  } else {
    await removeFromCart(CartItemId);
  }
  revalidatePath("/cart");
};

export const getCart = async () => {
  const owner = await getCartOwner();
  return prisma.cartItem.findMany({ where: owner });
};

export const getCartProducts = async () => {
  const owner = await getCartOwner();
  return prisma.cartItem.findMany({
    where: owner,
    include: { product: true, variant: true },
    orderBy: { createdAt: "asc" },
  });
};
