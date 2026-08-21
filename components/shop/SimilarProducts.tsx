"use client";

import useSearchProducts from "@/hooks/useSearchProducts";
import ProductCard from "./ProductCard";

export default function SimilarProducts({
  id,
  categoryId,
}: {
  id: string;
  categoryId: string;
}) {
  const { data } = useSearchProducts("", categoryId);
  const similars = data?.products.filter((product) => product.id !== id);

  return (
    <>
      <h3 className="capitalize my-2 text-xl md:text-2xl">you may also like</h3>
      <section className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {similars?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </>
  );
}
