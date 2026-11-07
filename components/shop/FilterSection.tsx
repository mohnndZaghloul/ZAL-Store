"use client";

import ProductSection from "@/components/shop/ProductSection";
import ProductsFilter from "@/components/shop/ProductsFilter";
import useSearchProducts from "@/hooks/useSearchProducts";
import useGetCategories from "@/hooks/useGetCategories";
import { useEffect, useState } from "react";

type FilterSectionProps = {
  initialCategory: string;
};

const FilterSection = ({ initialCategory }: FilterSectionProps) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);

  const { data: categories } = useGetCategories();

  useEffect(() => {
    if (!initialCategory || !categories) return;

    const selectedCategory = categories.find(
      (cat) => cat.name.toLowerCase() === initialCategory.toLowerCase()
    );

    setCategory(selectedCategory?.id ?? "");
  }, [initialCategory, categories]);

  const filterData = useSearchProducts(query, category);

  return (
    <>
      <ProductsFilter
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
      />
      <ProductSection filterData={filterData} />
    </>
  );
};

export default FilterSection;