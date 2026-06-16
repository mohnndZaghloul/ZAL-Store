"use client";

import {
  deleteCustomer,
  resetPassword,
  setRole,
} from "@/actions/customers-actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, SendIcon, Trash2, CircleCheckBig } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useState } from "react";
import { deleteProduct } from "@/actions/products-actions";
import Image from "next/image";
import { Skeleton } from "../../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import Link from "next/link";
import { User_TP, Product_TP, Role_TP } from "@/types/index";
// import DeleteButton from "./DeleteButton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export const CustomersColumns: ColumnDef<User_TP>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="mx-auto"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && false)
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mx-auto"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "avatar",
    header: ({ column }) => <h1 className="text-center capitalize">Avatar</h1>,
    cell: ({ row }) => (
      <Avatar className="mx-auto">
        <AvatarImage src={row.original.image!} />
        <AvatarFallback>{row.original.name[0].toUpperCase()}</AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: "role",
    cell: ({ row }) => {
      const [currentRole, setCurrentRole] = useState<Role_TP>(
        row.original.role!,
      );
      return (
        <Select
          value={currentRole}
          onValueChange={async (value) => {
            const newRole = value as Role_TP;
            setCurrentRole(newRole);
            await setRole(row.original.id, newRole);
          }}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={Role_TP.USER}>User</SelectItem>
              <SelectItem value={Role_TP.ADMIN}>Admin</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return date.toLocaleDateString("en-US");
    },
  },
  {
    accessorKey: "actions",
    header: ({ column }) => <h1 className="text-center capitalize">actions</h1>,
    cell: ({ row }) => {
      const [resetIsLoading, setResetIsLoading] = useState(false);
      const [isDone, setIsDone] = useState(false);
      return (
        <div className="space-x-2 text-center">
          <Button
            className="cursor-pointer"
            variant="outline"
            disabled={isDone}
            onClick={async () => {
              setResetIsLoading(true);
              const result = await resetPassword(row.original.email);
              setIsDone(result);
              setResetIsLoading(false);
            }}>
            {resetIsLoading ? (
              "Sending Email..."
            ) : isDone ? (
              <>
                <CircleCheckBig />
                Done
              </>
            ) : (
              <>
                <SendIcon />
                Reset Password
              </>
            )}
          </Button>
          {/* <DeleteButton
            title="delete user"
            description="are you sure you want delete this user?"
            onClick={async () => {
              const { isSelf } = await deleteCustomer(row.original.id);
              if (isSelf) {
                await signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.href = "/login";
                    },
                  },
                });
              }
            }}>
            <Trash2 />
            delete
          </DeleteButton> */}
        </div>
      );
    },
  },
];

export const ProductsColumns: ColumnDef<Product_TP>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="mx-auto"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && false)
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mx-auto"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: ({ column }) => (
      <span className="text-center capitalize">image</span>
    ),
    cell: ({ row }) =>
      row.original.images ? (
        <div className="relative mx-auto w-20 h-20 rounded-xl overflow-hidden border">
          <Image
            className="object-cover transition-transform duration-200 hover:scale-105"
            fill
            src={row.original.images[0]}
            alt={row.original.title}
          />
        </div>
      ) : (
        <Skeleton className="w-20 h-20 rounded-xl" />
      ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <p>{row.original.price} EGP</p>,
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "createAt",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("createAt") as Date;
      return date.toLocaleDateString("en-US");
    },
  },
  {
    accessorKey: "actions",
    header: ({ column }) => (
      <span className="text-center capitalize">actions</span>
    ),
    cell: ({ row }) => {
      return (
        <div className="space-x-2 flex justify-center items-center">
          <Button
            variant="outline"
            className="cursor-pointer capitalize"
            nativeButton={false}
            render={<Link href={`./products/${row.original.id}`}>edit</Link>}
          />
          {/* <DeleteButton
            title="delete product"
            description="are you sure you want delete this product?"
            onClick={async () => {
              await deleteProduct(row.original.id);
            }}>
            <Trash2 />
            delete
          </DeleteButton> */}
        </div>
      );
    },
  },
];
