import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CustomCarousel from "./CustomCarousel";
import Image from "next/image";
import img from "@/public/images/gon&kelua.jpg";

export default function ProductsSlider() {
  return (
    <section className="my-8">
      <h1 className="text-3xl uppercase">collection name</h1>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full relative">
        <CarouselContent className="py-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 lg:basis-1/4 hover:scale-105 transition duration-300">
              <div>
                <div className="relative aspect-3/4 p-1">
                  <Image src={img} alt="test" fill />
                </div>
                {/* <CustomCarousel /> */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold uppercase">title</h3>
                  <span className="font-light">EGP 650.00</span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          size="icon-lg"
          className="absolute top-1/2 left-4 bg-black text-secondary"
        />
        <CarouselNext
          size="icon-lg"
          className="absolute top-1/2 right-4 bg-black text-secondary"
        />
      </Carousel>
    </section>
  );
}
