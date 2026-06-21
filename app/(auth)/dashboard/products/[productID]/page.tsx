import { getProductById } from "@/actions/products-actions";
import { getAllCategories } from "@/actions/system-actions";
import ProductForm from "@/components/forms/product/ProductForm";
import { Product_TP } from "@/types";

export default async function ProductPage({
  params,
}: {
  params: { productID: string };
}) {
  const { productID } = await params;
  let mode: "add-product" | "update-product";
  let product: Product_TP | undefined;

  if (productID === "add-product") {
    mode = "add-product";
  } else {
    mode = "update-product";
    product = (await getProductById(productID)) ?? undefined;
  }

  const categories = await getAllCategories();

  return (
    <main className="container">
      <h1 className="capitalize">add new product</h1>
      <ProductForm mode={mode} categories={categories} product={product} />
    </main>
  );
}
