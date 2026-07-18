import { getProductsByFilter } from "@/actions/products-actions";
import { FilterData_TP } from "@/types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const useSearchProducts = (
  query: string,
  categoryId?: string,
  page: number = 1,
  pageSize: number = 10,
): UseQueryResult<FilterData_TP> => {
  return useQuery({
    queryKey: ["products", { query, categoryId }],
    queryFn: () => getProductsByFilter(query, categoryId, page, pageSize),
    staleTime: 60 * 1000,
    refetchInterval: 1.2 * 60 * 1000,
  });
};

export default useSearchProducts;
