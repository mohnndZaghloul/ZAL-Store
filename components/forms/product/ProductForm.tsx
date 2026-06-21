"use client";

import { useActionState, useEffect, useState } from "react";
import CategoriesSelector from "./CategoriesSelector";
import StockList from "./StockList";
import FormFiled from "../FormFiled";
import { Category_TP, Product_TP, ProductActionState, stock_TP } from "@/types";
import ImagesPicker from "../ImagesPicker";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { AddProduct } from "@/actions/products-actions";

const ProductForm = ({
  mode,
  product,
  categories,
}: {
  mode: string;
  categories: Category_TP[];
  product?: Product_TP;
}) => {
  const [state, action, isLoading] = useActionState(
    AddProduct.bind(null, { mode, productId: product?.id }),
    { errors: {}, inputs: {} } as ProductActionState,
  );
  const [formValues, setFormValues] = useState({
    title: product?.title ?? "",
    description: product?.description ?? "",
    price: product?.price.toString() ?? "0",
  });
  const [uploadingCount, setUploadingCount] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>(product?.images ?? []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    product?.categories?.map((c) => c.id) ?? [],
  );
  const [stockList, setStockList] = useState<stock_TP[]>(
    product?.variants ?? [],
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form action={action}>
      <div className="flex flex-col md:flex-row justify-between gap-4 my-2">
        <div className="w-full">
          <div className="space-y-2 my-4">
            <FormFiled
              id="title"
              name="title"
              placeholder="ex: T-shirt"
              value={formValues.title}
              error={state?.errors?.title?.[0]}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2 my-4">
            <FormFiled
              id="description"
              name="description"
              placeholder="ex: A cotton T-shirt with ..."
              isTextArea
              value={formValues.description}
              error={state?.errors?.description?.[0]}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2 my-4">
            <FormFiled
              id="price"
              name="price"
              type="number"
              placeholder="0.00 EGP"
              value={formValues.price}
              error={state?.errors?.price?.[0]}
              onChange={handleChange}
            />
          </div>
          <CategoriesSelector
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            error={state?.errors?.categories?.[0]}
          />
          <ImagesPicker
            uploadingCount={uploadingCount}
            setUploadingCount={setUploadingCount}
            imageUrls={imageUrls}
            setImageUrls={setImageUrls}
            error={state?.errors?.images?.[0]}
          />
          <div>
            {state?.errors?.general?.[0] && (
              <p className="text-destructive text-end text-xs">
                {state?.errors?.general?.[0]}
              </p>
            )}
            <Button
              type="submit"
              className="rounded-none w-full text-sm md:text-lg p-2 md:p-6 mt-2"
              disabled={uploadingCount > 0 || isLoading}>
              <PlusCircleIcon className="size-3 md:size-5" />
              {isLoading
                ? mode === "add-product"
                  ? "Creating..."
                  : "Updating..."
                : mode === "add-product"
                  ? "Add Product"
                  : "Update Product"}
            </Button>
          </div>
        </div>
        <StockList
          stockList={stockList}
          setStockList={setStockList}
          error={state?.errors?.variants?.[0]}
        />
      </div>
    </form>
  );
};

export default ProductForm;
