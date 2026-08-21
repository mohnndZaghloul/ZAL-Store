"use client";
import NavLink from "./NavLink";
import { ShoppingBag, User } from "lucide-react";
import { Badge } from "../../ui/badge";
import { useCartStore } from "@/store/cart";
// import { useFavStore } from "@/store/favorite";
import { getCart } from "@/actions/cart-actions";
import { useEffect } from "react";
// import { getFav } from "@/actions/favorite-actions";
import { useSession } from "@/lib/auth-client";
import { SidebarTrigger } from "../../ui/sidebar";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

export default function NavBar() {
  const session: any = useSession;
  const { data, isPending } = session;

  const CartCount = useCartStore((state) => state.count);
  const setCartCount = useCartStore((state) => state.setCartCount);
  // const FavCount = useFavStore((state) => state.count);
  // const setFavCount = useFavStore((state) => state.setFavCount);

  useEffect(() => {
    setCartCount(0);

    const loadNav = async () => {
      const cart = await getCart();
      const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalQuantity);
    };

    loadNav();
  }, [data?.user?.id, setCartCount]);

  return (
    <header className="sticky py-1 top-0 z-50 bg-background border-b border-secondary/40 shadow-2xl shadow-secondary/40">
      <nav className="container h-full min-h-12 flex justify-between items-center">
        <div>
          <h1 className="text-primary font-semibold text-2xl">ZAL</h1>
        </div>
        <ul className="flex items-center gap-2 md:gap-10 text-xs md:text-sm">
          <li>
            <NavLink href="/">home</NavLink>
          </li>
          <li>
            <NavLink href="/collections">collections</NavLink>
          </li>
        </ul>
        <div className="flex items-center gap-2 md:gap-4">
          <div>
            {data?.user ? (
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  className="grayscale"
                />
                <AvatarFallback className="text-primary">CN</AvatarFallback>
              </Avatar>
            ) : (
              <NavLink href="/login" className="hover:text-primary transition">
                <User />
              </NavLink>
            )}
          </div>
          <SidebarTrigger
            render={
              <Button
                variant="ghost"
                className="relative hover:text-primary! hover:bg-transparent!">
                <ShoppingBag className="w-5! h-5!" />
                {CartCount > 0 ? (
                  <Badge className="absolute -top-2 -right-2 text-xs">
                    {CartCount}
                  </Badge>
                ) : null}
              </Button>
            }
          />
        </div>
      </nav>
    </header>
  );
}
