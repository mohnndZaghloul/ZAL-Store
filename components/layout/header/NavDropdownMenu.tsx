import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  LogOutIcon,
  CircleUserRound,
  LayoutDashboard,
  ListOrdered,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { useCartStore } from "@/store/cart";
import { useEffect, useState } from "react";
import { getRole } from "@/actions/customers-actions";

export default function NavDropdownMenu({ data }: any) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const setCartCount = useCartStore((state) => state.setCartCount);

  const signOutHandler = async () => {
    const result = await signOut();
    if (result.data) {
      setCartCount(0);
      router.replace("/login");
    } else {
      throw Error("error while signing out");
    }
  };

  useEffect(() => {
    async function getCurrentRole() {
      const result = await getRole();
      if (result === "ADMIN") setIsAdmin(true);
    }
    getCurrentRole();
  }, [data?.user]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        nativeButton={false}
        render={
          <Avatar className="cursor-pointer">
            <AvatarImage src={data?.user?.image} />
            <AvatarFallback>{data?.user?.name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        }
      />

      <DropdownMenuContent className="w-full" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="capitalize">
            {data?.user?.name}
          </DropdownMenuLabel>
          <DropdownMenuLabel>{data?.user.email}</DropdownMenuLabel>
          <DropdownMenuItem>
            {isAdmin ? (
              <Link href="/dashboard" className="w-full flex justify-between">
                Dashboard
                <LayoutDashboard />
              </Link>
            ) : (
              <Link href="/orders" className="w-full flex justify-between">
                Orders
                <ListOrdered />
              </Link>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={signOutHandler}
            variant="destructive"
            className="flex justify-between cursor-pointer">
            Sign Out
            <LogOutIcon />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
