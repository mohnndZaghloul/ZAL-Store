"use server";

import { prisma } from "@/lib/prisma";
import { ProductFormActionState_TP, ProductFormErrors } from "@/lib/types";
import { ProductSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./customers-actions";
import { Prisma } from "@/generated/prisma";

export const productFormActions = async (
  meta: { mode: string; productId?: string },
  prevState: ProductFormActionState_TP,
  formData: FormData,
) => {
  const user = await getCurrentUser();
  const rawData = {
    title: (formData.get("title") as string) || "",
    price: (formData.get("price") as string) || "",
    description: (formData.get("description") as string) || "",
    tags: (formData.get("tags") as string) || "",
    images: JSON.parse((formData.get("images") as string) || "[]"),
  };
  const categoriesRaw = formData.get("categories") as string;
  const categoryIds: string[] = JSON.parse(categoriesRaw || "[]");

  const emptyErrors: ProductFormErrors = {
    title: [],
    price: [],
    description: [],
    tags: [],
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

  const { title, price, description, tags, images } = validated.data;
  try {
    if (meta.mode === "add-product") {
      await prisma.product.create({
        data: {
          title,
          price,
          description,
          categories: {
            connect: categoryIds.map((id) => ({ id })),
          },
          tags: tags.split(",").map((t) => t.trim()),
          images,
          createdById: user?.id,
        },
      });
    } else {
      if (meta.mode !== "add-product" && !meta.productId) {
        throw new Error("Product ID is required for update");
      }
      await prisma.product.update({
        where: { id: meta.productId },
        data: {
          title,
          price,
          description,
          categories: {
            connect: categoryIds.map((id) => ({ id })),
          },
          tags: tags.split(",").map((t) => t.trim()),
          images,
          createdById: user?.id,
        },
      });
    }
  } catch (error) {
    return {
      errors: { general: ["Something went wrong"] },
      inputs: rawData,
    };
  }
  redirect("/dashboard/products");
};
export const getAllProducts = async () => {
  return await prisma.product.findMany();
};
export const getProductsByFilter = async (
  categoryIds: string[],
  searchText: string,
  page: number = 1,
  pageSize: number = 8,
) => {
  const where: Prisma.ProductWhereInput = {
    AND: [
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
      },

      ...(categoryIds.length > 0
        ? [
            {
              categories: {
                some: {
                  id: {
                    in: categoryIds,
                  },
                },
              },
            },
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
    include: { categories: true },
  });
};
export const deleteProduct = async (id: string) => {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/dashboard/customers");
};
