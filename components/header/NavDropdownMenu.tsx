import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOutIcon, CircleUserRound, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useCartStore } from "@/store/cart";
import { useFavStore } from "@/store/favorite";

export default function NavDropdownMenu({ data }: any) {
  const router = useRouter();
  const setCartCount = useCartStore((state) => state.setCartCount);
  const setFavCount = useFavStore((state) => state.setFavCount);

  const signOutHandler = async () => {
    const result = await signOut();
    if (result.data) {
      setCartCount(0);
      setFavCount(0);
      router.replace("/login");
    } else {
      throw Error("error while signing out");
    }
  };
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
            <Link
              href="/dashboard/profile"
              className="w-full flex justify-between">
              Profile
              <CircleUserRound />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/dashboard" className="w-full flex justify-between">
              Dashboard
              <LayoutDashboard />
            </Link>
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
