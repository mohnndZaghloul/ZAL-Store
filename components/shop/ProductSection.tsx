"use client";

import { UseQueryResult } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { FilterData_TP } from "@/types";

const ProductSection = ({
  filterData,
}: {
  filterData: UseQueryResult<FilterData_TP>;
}) => {
  if (filterData?.isLoading) {
    return (
      <div className="uppercase text-center my-8">
        is loading please wait...
      </div>
    );
  }
  if (filterData?.isError) {
    return (
      <div className="uppercase text-center my-8">
        error : {filterData?.error.message}
      </div>
    );
  }

  return (
    <section className="px-2 grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {filterData?.data?.products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
};

export default ProductSection;
