import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import img from "@/public/images/gon&kelua.jpg";

export default function CustomCarousel() {
  return (
    <Carousel className="">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="relative aspect-3/4 p-1">
              <Image src={img} alt="test" fill />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious size="icon-sm" className="absolute top-1/2 left-4" />
      <CarouselNext size="icon-sm" className="absolute top-1/2 right-4" />
    </Carousel>
  );
}
