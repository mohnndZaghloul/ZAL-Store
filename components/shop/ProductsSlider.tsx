import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product_TP } from "@/types";
import ProductCard from "./ProductCard";

export default function ProductsSlider({
  products,
}: {
  products: Product_TP[];
}) {
  return (
    <section className="py-8 bg-neutral/10">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full relative">
        <div className="container flex justify-between items-center my-4 md:my-8">
          <div>
            <span className="text-xs tracking-widest text-secondary uppercase">
              shop the look
            </span>
            <h1 className="text-xl md:text-3xl uppercase">Season Highlights</h1>
          </div>
          <div className="relative w-20 md:w-32">
            <CarouselPrevious
              size="icon-lg"
              className="absolute top-0 left-0 size-8 md:size-12 rounded-none"
            />
            <CarouselNext
              size="icon-lg"
              className="absolute top-0 right-0 size-8 md:size-12 rounded-none"
            />
          </div>
        </div>
        <CarouselContent className="py-4">
          {products.map((product) => (
            <CarouselItem
              key={product?.id}
              className="basis-1/2 lg:basis-1/5 cursor-pointer group">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
