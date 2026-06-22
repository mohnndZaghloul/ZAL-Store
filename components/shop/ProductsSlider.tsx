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
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/2 lg:basis-1/5">
              <div>
                <div className="relative overflow-hidden group aspect-3/4 p-1">
                  <Image src={img} alt="test" fill />
                  <button className="absolute bottom-0 left-0 translate-y-full group-hover:translate-y-0 w-full py-4 bg-primary text-primary-foreground uppercase text-xs tracking-widest cursor-pointer transition duration-300">
                    add to cart
                  </button>
                </div>
                {/* <CustomCarousel /> */}
                <div className="text-center my-2">
                  <h3 className="text-xl uppercase">title</h3>
                  <span className="font-light">EGP 650.00</span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
