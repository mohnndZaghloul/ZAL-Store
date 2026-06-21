"use client";

import { addCategoryAction, deleteCategories } from "@/actions/system-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import DeleteButton from "./DeleteButton";

export default function CategoriesForm({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const initialState = {};
  const [state, action, isPending] = useActionState(
    addCategoryAction,
    initialState,
  );

  return (
    <form className="space-y-4" action={action}>
      <div className="flex flex-wrap justify-center gap-4">
        {categories[0] ? (
          categories.map((category) => (
            <p
              className="relative text-sm md:text-xl capitalize p-4 bg-muted border hover:border-primary transition"
              key={category.id}>
              {category.name}
              <DeleteButton
                title="delete category"
                description="are you sure you want delete this category?"
                className="cursor-pointer rounded-none absolute -top-2 -right-2 bg-destructive text-white hover:bg-destructive/80 w-6 h-6 text-xs"
                onClick={async () => {
                  await deleteCategories(category?.id);
                }}>
                ✕
              </DeleteButton>
            </p>
          ))
        ) : (
          <p className="w-xl text-xl capitalize p-4">no categories yet</p>
        )}
      </div>
      <div className="flex justify-center items-center gap-4">
        <Input
          required
          minLength={3}
          className="w-sm md:text-lg! py-5"
          placeholder="Ex: T-shirt"
          name="category"
        />
        <Button
          disabled={isPending}
          type="submit"
          className="cursor-pointer rounded-none shadow hover:shadow-primary border-0 capitalize md:text-lg px-4 py-5">
          {isPending ? "adding..." : "add category"}
        </Button>
      </div>
    </form>
  );
}
