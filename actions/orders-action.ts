import { prisma } from "@/lib/prisma";

export const getOrderById = async (id: string) => {
  return await prisma.order.findUnique({ where: { id } });
};
