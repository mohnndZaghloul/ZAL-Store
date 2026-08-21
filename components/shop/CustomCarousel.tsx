import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function CustomCarousel({ images }: { images: string[] }) {
  return (
    <Carousel className="">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative aspect-3/4 p-1">
              <Image src={image} alt={image} fill className="object-cover" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious size="icon-sm" className="absolute top-1/2 left-4" />
      <CarouselNext size="icon-sm" className="absolute top-1/2 right-4" />
    </Carousel>
  );
}
