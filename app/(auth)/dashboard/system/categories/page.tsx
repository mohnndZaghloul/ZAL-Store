import { getAllCategories } from "@/actions/system-actions";
import CategoriesForm from "@/components/forms/CategoriesForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "System | Next Store",
  description: "setting page for main system in store",
  keywords: ["system", "control", "dashboard"],
};

export const dynamic = "force-dynamic";

export default async function SystemPage() {
  const categories = await getAllCategories();

  return (
    <main className="container">
      <div>
        <h2 className="capitalize text-xl md:text-3xl">Categories</h2>
        <div className="border-y py-8 my-4 ">
          <CategoriesForm categories={categories} />
        </div>
      </div>
    </main>
  );
}
