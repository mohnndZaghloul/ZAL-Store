"use server";

import { forbidden } from "next/navigation";
import { getRole } from "./customers-actions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role_TP } from "@/types/index";

export const addCategoryAction = async (prevData: any, formData: FormData) => {
  // const role = await getRole();
  // if (role !== Role_TP.ADMIN) {
  //   forbidden();
  // }
  const name = formData.get("category") as string;
  try {
    await prisma.category.upsert({
      where: { name: name.toLocaleLowerCase() },
      update: {},
      create: { name },
    });
  } catch {
    return { error: "something went wrong" };
  }
  revalidatePath("/dashboard/system");
};

export const getAllCategories = async () => {
  return await prisma.category.findMany({ orderBy: { name: "asc" } });
};

export const deleteCategories = async (id: string) => {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/dashboard/system");
};

export const updateHeroSlider = async (prevState: any, formData: FormData) => {
  const role = await getRole();
  if (role !== Role_TP.ADMIN) {
    forbidden();
  }
  const images = JSON.parse((formData.get("images") as string) || "[]");
  //still updated
};
