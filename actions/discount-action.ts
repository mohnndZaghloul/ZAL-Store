"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./customers-actions";
import { Prisma } from "@/generated/prisma/client";
import { DiscountType } from "@/generated/prisma/enums";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function getAllDiscountCodes() {
  await requireAdmin();
  return prisma.discountCode.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createDiscountCode(
  prevState: { message?: string } | undefined,
  formData: FormData,
) {
  await requireAdmin();

  const code = (formData.get("code") as string)?.trim().toUpperCase();
  const type = formData.get("type") as DiscountType;
  const value = Number(formData.get("value"));
  const maxUsesRaw = formData.get("maxUses") as string;
  const minOrderAmountRaw = formData.get("minOrderAmount") as string;
  const expiresAtRaw = formData.get("expiresAt") as string;

  if (!code) return { message: "Code is required." };
  if (!value || value <= 0) return { message: "Enter a valid discount value." };
  if (type === "PERCENTAGE" && value > 100) {
    return { message: "Percentage can't exceed 100." };
  }

  try {
    await prisma.discountCode.create({
      data: {
        code,
        type,
        value,
        maxUses: maxUsesRaw ? Number(maxUsesRaw) : null,
        minOrderAmount: minOrderAmountRaw ? Number(minOrderAmountRaw) : null,
        expiresAt: expiresAtRaw ? new Date(expiresAtRaw) : null,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { message: "This code already exists." };
    }
    console.error("createDiscountCode failed:", error);
    return { message: "Something went wrong creating the code." };
  }

  revalidatePath("/dashboard/discounts");
  return { message: undefined };
}

export async function toggleDiscountCode(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.discountCode.update({ where: { id }, data: { isActive } });
  revalidatePath("/dashboard/discounts");
}

export async function deleteDiscountCode(id: string) {
  await requireAdmin();
  await prisma.discountCode.delete({ where: { id } });
  revalidatePath("/dashboard/discounts");
}

// Shared validator — used for the live preview on the checkout page AND
// re-run authoritatively inside createOrder. Never trust a discount
// amount computed on the client; this is always the source of truth.
export type DiscountValidation =
  | {
      valid: true;
      discountCodeId: string;
      code: string;
      discountAmount: number;
    }
  | { valid: false; message: string };

export async function validateDiscountCode(
  rawCode: string,
  subtotal: number,
): Promise<DiscountValidation> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { valid: false, message: "Enter a code." };

  const discount = await prisma.discountCode.findUnique({ where: { code } });

  if (!discount || !discount.isActive) {
    return { valid: false, message: "Invalid discount code." };
  }
  if (discount.expiresAt && discount.expiresAt < new Date()) {
    return { valid: false, message: "This code has expired." };
  }
  if (discount.maxUses !== null && discount.usedCount >= discount.maxUses) {
    return { valid: false, message: "This code has reached its usage limit." };
  }
  if (discount.minOrderAmount && subtotal < discount.minOrderAmount) {
    return {
      valid: false,
      message: `This code requires a minimum order of EGP ${discount.minOrderAmount}.`,
    };
  }

  const discountAmount =
    discount.type === "PERCENTAGE"
      ? Math.round((subtotal * discount.value) / 100)
      : Math.min(Math.round(discount.value), subtotal);

  return {
    valid: true,
    discountCodeId: discount.id,
    code: discount.code,
    discountAmount,
  };
}
