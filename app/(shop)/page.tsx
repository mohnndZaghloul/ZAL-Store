import { getAllProducts } from "@/actions/products-actions";
import LandingHero from "@/components/shop/LandingHero";
import ProductsSlider from "@/components/shop/ProductsSlider";
import SamplesSection from "@/components/shop/SamplesSection";

export default async function Home() {
  const products = await getAllProducts();
  return (
    <main className="">
      <LandingHero />
      <SamplesSection />
      <ProductsSlider products={products} />
    </main>
  );
}
