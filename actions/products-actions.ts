"use server";

import { prisma } from "@/lib/prisma";
import { ProductActionState, ProductFormErrors } from "@/types/index";
import { ProductSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./customers-actions";
import { Prisma } from "@/generated/prisma/client";

export const AddProduct = async (
  meta: { mode: string; productId?: string },
  prevState: ProductActionState,
  FormData: FormData,
) => {
  const user = await getCurrentUser();

  const rawData = {
    title: (FormData.get("title") as string) || "",
    description: (FormData.get("description") as string) || "",
    price: (FormData.get("price") as string) || "",
    categories: (FormData.get("categories") as string) || "[]",
    variants: (FormData.get("variants") as string) || "[]",
    images: (FormData.get("images") as string) || "[]",
  };

  const emptyErrors: ProductFormErrors = {
    title: [],
    description: [],
    price: [],
    variants: [],
    images: [],
    general: [],
  };

  if (!user?.id) {
    return {
      errors: {
        ...emptyErrors,
        general: ["you are unauthorized for adding product"],
      },
      inputs: rawData,
    };
  }

  const validated = ProductSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: {
        ...emptyErrors,
        ...validated.error.flatten().fieldErrors,
      },
      inputs: rawData,
    };
  }

  const { title, price, description, variants, images, categories } =
    validated.data;

  try {
    if (meta.mode === "add-product") {
      await prisma.product.create({
        data: {
          title,
          description,
          price,
          images,
          createdById: user?.id,
          categories: {
            connect: categories.map((id) => ({ id })),
          },
          variants: { createMany: { data: variants } },
        },
      });
    } else {
      if (meta.mode !== "add-product" && !meta.productId) {
        throw new Error("Product ID is required for update");
      }

      // Diff against what's actually in the DB instead of wiping and
      // recreating everything — deleting a variant that an order already
      // references violates the OrderItem foreign key and corrupts order
      // history, which is exactly what just happened.
      const existingVariants = await prisma.productVariant.findMany({
        where: { productId: meta.productId },
        select: { id: true },
      });
      const existingIds = new Set(existingVariants.map((v) => v.id));
      const submittedIds = new Set(
        variants.filter((v) => v.id).map((v) => v.id as string),
      );

      // Anything without an id, or with an id that no longer matches a
      // real row (shouldn't normally happen, but avoids silently losing
      // it if it does) counts as a new row to create.
      const toCreate = variants.filter((v) => !v.id || !existingIds.has(v.id));
      const toUpdate = variants.filter((v) => v.id && existingIds.has(v.id));
      const toDeleteIds = [...existingIds].filter(
        (id) => !submittedIds.has(id),
      );

      await prisma.$transaction([
        prisma.product.update({
          where: { id: meta.productId },
          data: {
            title,
            description,
            price,
            images,
            categories: { set: categories.map((id) => ({ id })) },
          },
        }),
        ...toUpdate.map((v) =>
          prisma.productVariant.update({
            where: { id: v.id },
            data: { size: v.size, color: v.color, stock: v.stock },
          }),
        ),
        ...(toCreate.length > 0
          ? [
              prisma.productVariant.createMany({
                data: toCreate.map((v) => ({
                  productId: meta.productId!,
                  size: v.size,
                  color: v.color,
                  stock: v.stock,
                })),
              }),
            ]
          : []),
        ...(toDeleteIds.length > 0
          ? [
              prisma.productVariant.deleteMany({
                where: { id: { in: toDeleteIds } },
              }),
            ]
          : []),
      ]);
    }
  } catch (error) {
    console.error("AddProduct error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return {
          errors: {
            ...emptyErrors,
            variants: [
              "One of the removed sizes already has orders placed against it and can't be deleted. Set its stock to 0 instead of removing it.",
            ],
          },
          inputs: rawData,
        };
      }
      if (error.code === "P2002") {
        return {
          errors: {
            ...emptyErrors,
            variants: [
              "Two sizes have the same size/color combination — each must be unique.",
            ],
          },
          inputs: rawData,
        };
      }
    }

    return {
      errors: {
        ...emptyErrors,
        general: [
          "Something went wrong saving this product. Please try again.",
        ],
      },
      inputs: rawData,
    };
  }
  redirect("/dashboard/products");
};

export const getAllProducts = async () => {
  return await prisma.product.findMany();
};

export const getAllStock = async () => {
  return await prisma.product.findMany({
    include: {
      variants: true,
      categories: true,
    },
  });
};

export const getProductsByFilter = async (
  searchText: string,
  categoryId: string = "",
  page: number = 1,
  pageSize: number = 10,
) => {
  const where: Prisma.ProductWhereInput = {
    AND: [
      ...(searchText.trim()
        ? [
            {
              OR: [
                {
                  title: {
                    contains: searchText,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                {
                  tags: {
                    has: searchText.toLowerCase(),
                  },
                },
              ],
            } satisfies Prisma.ProductWhereInput,
          ]
        : []),
      ...(categoryId
        ? [
            {
              categories: {
                some: { id: categoryId },
              },
            } satisfies Prisma.ProductWhereInput,
          ]
        : []),
    ],
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { categories: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
};
export const getCurrentUserProducts = async () => {
  const user = await getCurrentUser();

  try {
    return await prisma.product.findMany({
      where: {
        createdById: user?.id,
      },
    });
  } catch (error) {
    throw Error(`${error}`);
  }
};
export const getProductById = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
    include: { categories: true, variants: true },
  });
};
export const deleteProduct = async (id: string) => {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/dashboard/customers");
};
