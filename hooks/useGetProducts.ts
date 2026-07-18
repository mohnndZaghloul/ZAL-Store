import { getAllProducts } from "@/actions/products-actions";
import { useQuery } from "@tanstack/react-query";

const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    staleTime: 60 * 1000,
  });
};

export default useGetProducts;
