import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Category_TP } from "@/types";
import { Dispatch, SetStateAction } from "react";

type categories_TP = {
  categories: Category_TP[];
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  error?: string;
};

const CategoriesSelector = ({
  categories,
  selectedCategories,
  setSelectedCategories,
  error,
}: categories_TP) => {
  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor="id" className="uppercase">
          category
        </Label>
        {error && <p className="text-destructive text-end text-xs">{error}</p>}
      </div>
      <div className="space-x-2 space-y-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          return (
            <Button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={`px-4 py-2 border rounded-none text-xs shadow hover:shadow-primary hover:text-white transition cursor-pointer ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-border hover:border-primary"
              }`}>
              {category.name}
            </Button>
          );
        })}
      </div>
      <input
        type="hidden"
        name="categories"
        value={JSON.stringify(selectedCategories)}
      />
    </div>
  );
};

export default CategoriesSelector;
