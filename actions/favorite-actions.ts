// "use server";

// import { prisma } from "@/lib/prisma";
// import { revalidatePath } from "next/cache";
// import { getCurrentUser } from "./customers-actions";
// import { unauthorized } from "next/navigation";

// export const toggleFav = async (productId: string) => {
//   const user = await getCurrentUser();
//   if (!user) unauthorized();

//   const itemIsExist = await prisma.userFavorite.findUnique({
//     where: {
//       userId_productId: {
//         userId: user.id,
//         productId,
//       },
//     },
//   });

//   if (itemIsExist) {
//     await prisma.userFavorite.delete({
//       where: {
//         userId_productId: {
//           userId: user.id,
//           productId,
//         },
//       },
//     });
//   } else {
//     await prisma.userFavorite.create({
//       data: { userId: user.id, productId },
//     });
//   }
//   revalidatePath("/favorites");
//   return itemIsExist;
// };

// export const getFav = async () => {
//   const user = await getCurrentUser();

//   const AllFav = await prisma.userFavorite.findMany({
//     where: { userId: user?.id },
//   });
//   return AllFav;
// };

// export const getFavProducts = async () => {
//   const user = await getCurrentUser();

//   return await prisma.userFavorite.findMany({
//     where: { userId: user?.id },
//     include: { product: true },
//     orderBy: { createdAt: "asc" },
//   });
// };
