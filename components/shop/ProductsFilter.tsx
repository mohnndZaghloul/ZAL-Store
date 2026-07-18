"use client";

import useGetCategories from "@/hooks/useGetCategories";
import FormFiled from "../forms/FormFiled";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, useState } from "react";

type props_TP = {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
};

const ProductsFilter = ({
  query,
  setQuery,
  category,
  setCategory,
}: props_TP) => {
  const [searchText, setSearchText] = useState("");
  const { data, isLoading } = useGetCategories();

  return (
    <section>
      <h1 className="text-5xl uppercase text-center bg-linear-180 from-secondary to-secondary/80 py-4">
        products
      </h1>
      <div className="container flex justify-center py-4">
        <form>
          <div className="flex justify-center items-end gap-1">
            <div>
              <FormFiled
                id="search"
                name="search"
                label="Search"
                placeholder="t-shirt..."
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                className="w-full min-w-xs md:min-w-sm"
              />
            </div>
            <Button
              onClick={() => setQuery(searchText)}
              className="uppercase rounded-none border border-primary">
              search
            </Button>
          </div>
          <div className="space-x-2 mt-2">
            {isLoading ? (
              <div className="uppercase text-center my-8">
                is loading please wait...
              </div>
            ) : (
              data?.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    if (cat.id === category) {
                      setCategory("");
                    } else {
                      setCategory(cat.id);
                    }
                  }}
                  className={`text-sm py-2 px-4 border active:scale-90 ${cat.id === category ? "bg-secondary text-primary-foreground border-secondary" : "bg-primary/10"} hover:bg-secondary hover:text-primary-foreground cursor-pointer transition`}>
                  {cat.name}
                </button>
              ))
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default ProductsFilter;
