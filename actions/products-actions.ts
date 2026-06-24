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
  const user = {
    id: "KFNlEBmEjnneROwnbjNizGum6CUExkSs",
    name: "Mohannd Zaghloul",
    role: "ADMIN",
  };

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
      await prisma.$transaction([
        prisma.productVariant.deleteMany({
          where: { productId: meta.productId },
        }),
        prisma.product.update({
          where: { id: meta.productId },
          data: {
            title,
            description,
            price,
            images,
            categories: { set: categories.map((id) => ({ id })) },
            variants: { createMany: { data: variants } },
          },
        }),
      ]);
    }
  } catch (error) {
    console.error("AddProduct error:", error);
    return {
      errors: { ...emptyErrors, general: [`${error}`] },
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
    include: { categories: true, variants: true },
  });
};
export const deleteProduct = async (id: string) => {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/dashboard/customers");
};
