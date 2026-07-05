import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CustomCarousel from "./CustomCarousel";
import Image from "next/image";
import { Product_TP } from "@/types";
import Link from "next/link";

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
              <Link href={`./${product.id}`}>
                <div className="relative overflow-hidden group aspect-3/4 p-1">
                  <Image
                    src={product?.images[0]}
                    alt={product?.title}
                    fill
                    className=""
                  />
                  <Image
                    src={product?.images[1]}
                    alt={product?.title}
                    fill
                    className="opacity-0 group-hover:opacity-100 transition duration-300"
                  />
                  <button className="absolute bottom-0 left-0 translate-y-full group-hover:translate-y-0 w-full py-4 bg-primary text-primary-foreground uppercase text-xs tracking-widest cursor-pointer transition duration-300">
                    add to cart
                  </button>
                </div>
                {/* <CustomCarousel /> */}
                <div className="text-center my-2">
                  <p className="text-sm uppercase">{product?.title}</p>
                  <span className="font-semibold">
                    EGP {product?.price.toFixed(2)}
                  </span>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
