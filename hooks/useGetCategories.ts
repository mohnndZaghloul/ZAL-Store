import { getAllCategories } from "@/actions/system-actions";
import { useQuery } from "@tanstack/react-query";

const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    staleTime: 10 * 60 * 1000,
  });
};

export default useGetCategories;
