"use client";

import ProductSection from "@/components/shop/ProductSection";
import ProductsFilter from "@/components/shop/ProductsFilter";
import useSearchProducts from "@/hooks/useSearchProducts";
import { useState } from "react";

const FilterSection = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const filterData = useSearchProducts(query, category);

  return (
    <>
      <ProductsFilter
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
      />
      <ProductSection filterData={filterData} />
    </>
  );
};

export default FilterSection;
