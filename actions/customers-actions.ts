"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { forbidden, unauthorized } from "next/navigation";
import { Role_TP } from "@/types/index";

export const getRole = async () => {
  const data = await getSession();
  const user = await prisma.user.findUnique({
    where: { id: data?.user.id },
  });
  return user?.role;
};

export const setRole = async (id: string, role: Role_TP) => {
  const result = await getRole();
  if (result !== Role_TP.ADMIN) {
    forbidden();
  }
  await prisma.user.update({
    where: { id },
    data: { role: role },
  });
  revalidatePath("/dashboard");
};

export const getCurrentUser = async () => {
  const session = await getSession();
  if (!session?.user?.id) return null;
  return await prisma.user.findUnique({ where: { id: session?.user.id } });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany({ orderBy: { name: "asc" } });
};

export const deleteCustomer = async (id: string) => {
  const session = await getSession();
  const role = await getRole();
  if (role !== Role_TP.ADMIN) {
    forbidden();
  }
  const isSelf = session?.user.id === id;

  if (isSelf && session?.session.token) {
    await auth.api.revokeSession({
      headers: await headers(),
      body: { token: session.session.token },
    });
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath("/dashboard/customers");

  return { isSelf };
};

export const updateCustomer = async (
  id: string,
  data: { name: string; email: string; password: string },
) => {
  const role = await getRole();
  if (role !== Role_TP.ADMIN) {
    forbidden();
  }

  await prisma.user.update({
    where: { id },
    data: { name: data.name, email: data.email },
  });

  if (data.password) {
    await auth.api.setPassword({
      body: {
        newPassword: data.password,
      },
      headers: await headers(),
    });
  }
  revalidatePath("/dashboard/customers");
};

export const updatePhoneNumber = async (id: string, phone: string) => {
  try {
    await prisma.user.update({
      where: { id },
      data: { phone },
    });
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
  }
  revalidatePath("/dashboard/profile");
};

export async function getUserAccounts(
  id: string,
): Promise<{ hasPassword: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) unauthorized();
    if (user.id !== id) forbidden();

    const accounts = await auth.api.listUserAccounts({
      headers: await headers(),
    });

    const hasPassword = accounts.some(
      (account) => account.providerId === "credential",
    );

    return { hasPassword };
  } catch (error) {
    console.error("getUserAccounts error:", error);
    return { hasPassword: false, error: "Failed to check accounts." };
  }
}
export const changePassword = async (
  id: string,
  newPassword: string,
  currentPassword?: string,
) => {
  console.log("password length received:", newPassword.length);
  console.log("password value:", newPassword);
  try {
    const user = await getCurrentUser();
    if (!user) unauthorized();
    if (user.id !== id) forbidden();
    if (!currentPassword) {
      await auth.api.setPassword({
        headers: await headers(),
        body: { newPassword },
      });
      return {};
    }
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      },
    });
    return {};
  } catch (error) {
    console.error("changePassword error:", error);
    if (error instanceof Error) {
      if (error.message.toLowerCase().includes("invalid password")) {
        return { error: "Current password is incorrect." };
      }
      if (error.message.toLowerCase().includes("unauthorized")) {
        return { error: "Session expired. Please log in again." };
      }
      return { error: error.message };
    }
    return { error: "Failed to change password. Please try again." };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await auth.api.requestPasswordReset({
      body: { email },
    });
    return true;
  } catch {
    return false;
  }
};
