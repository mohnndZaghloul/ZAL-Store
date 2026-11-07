import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SamplesSection = () => {
  return (
    <section className="container flex flex-col md:flex-row gap-6 my-8">
      {/* Winter Arrivals - Pullovers */}
      <div className="flex-5">
        <Link href="/collections?category=pullover" className="block group">
          <div className="relative aspect-3/4 overflow-hidden">
            <Image
              src="/images/img.JPG"
              alt="Spring Arrivals - Pullovers"
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
            />
          </div>

          <div className="relative my-2">
            <h3 className="text-2xl font-semibold">Winter Arrivals</h3>
            <p className="text-xs uppercase tracking-widest">
              View Editorial
            </p>
            <ArrowRight className="absolute top-0 right-0 size-4 -rotate-45 group-hover:rotate-0 transition duration-500" />
          </div>
        </Link>
      </div>

      <div className="flex-4 space-y-5">
        {/* Essential Basics - Trousers */}
        <Link href="/collections?category=trousers" className="block group">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src="/images/WhatsApp Image 2026-08-24 at 8.07.04 PM.webp"
              alt="Essential Basics - Trousers"
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
            />
          </div>

          <div className="relative my-2">
            <h3 className="text-2xl font-semibold">Essential Basics</h3>
            <p className="text-xs uppercase tracking-widest">
              Youthful Essentials
            </p>
            <ArrowRight className="absolute top-0 right-0 size-4 -rotate-45 group-hover:rotate-0 transition duration-500" />
          </div>
        </Link>

        {/* Relaxed Silhouettes - Shirts */}
        <Link href="/collections?category=shirt" className="block group">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src="/images/shirts.jpg"
              alt="Relaxed Silhouettes - Shirts"
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
            />
          </div>

          <div className="relative my-2">
            <h3 className="text-2xl font-semibold">Relaxed Silhouettes</h3>
            <p className="text-xs uppercase tracking-widest">
              Street-Inspired Minimalism
            </p>
            <ArrowRight className="absolute top-0 right-0 size-4 -rotate-45 group-hover:rotate-0 transition duration-500" />
          </div>
        </Link>
      </div>
    </section>
  );
};

export default SamplesSection;
