import { getCartProducts } from "@/actions/cart-actions";
import { useQuery } from "@tanstack/react-query";

const useGetCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCartProducts,
  });
};

export default useGetCart;
