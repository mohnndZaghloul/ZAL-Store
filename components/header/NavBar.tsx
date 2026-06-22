"use client";
import NavLink from "./NavLink";
import { ModeToggler } from "./ModeToggler";
import { Heart, ShoppingCart, UserCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { useCartStore } from "@/store/cart";
import { useFavStore } from "@/store/favorite";
import { getCart } from "@/actions/cart-actions";
import { useEffect } from "react";
import { getFav } from "@/actions/favorite-actions";
import { useSession } from "@/lib/auth-client";
import ResponsiveNav from "./ResponsiveNav";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function NavBar() {
  const session: any = useSession;
  const { data, isPending } = session;
  const CartCount = useCartStore((state) => state.count);
  const FavCount = useFavStore((state) => state.count);
  const setCartCount = useCartStore((state) => state.setCartCount);
  const setFavCount = useFavStore((state) => state.setFavCount);

  useEffect(() => {
    if (!data?.user?.id) {
      setCartCount(0);
      setFavCount(0);
      return;
    }

    const loadNav = async () => {
      const [cart, fav] = await Promise.all([getCart(), getFav()]);
      const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalQuantity);
      setFavCount(fav.length);
    };

    loadNav();
  }, [data?.user?.id, setCartCount, setFavCount]);

  return (
    <header className="fixed w-full z-50 bg-background border-b border-secondary/40 shadow-2xl shadow-secondary/40">
      <nav className="container h-full min-h-12 hidden sm:flex justify-between items-center">
        <div>
          <h1 className="text-primary font-semibold text-2xl">ZAL</h1>
        </div>
        <ul className="flex items-center gap-10 text-sm">
          <li>
            <NavLink href="/">collections</NavLink>
          </li>
          <li>
            <NavLink href="/arrivals">new arrivals</NavLink>
          </li>
          <li>
            <NavLink href="/contact-us">contact us</NavLink>
          </li>
        </ul>
        <div className="flex items-center gap-4">
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
                <UserCircle />
              </NavLink>
            )}
          </div>
          <SidebarTrigger
            render={
              <Button
                variant="ghost"
                className="hover:text-primary! hover:bg-transparent!">
                <ShoppingCart className="w-5! h-5!" />
                {CartCount > 0 ? (
                  <Badge className="absolute -top-2 -right-2 text-xs">
                    {CartCount}
                  </Badge>
                ) : null}
              </Button>
            }
          />
          <ModeToggler />
        </div>
      </nav>
      {/* <ResponsiveNav /> */}
    </header>
  );
}
