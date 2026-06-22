import { ArrowRight } from "lucide-react";
import Image from "next/image";

const SamplesSection = () => {
  return (
    <section className="container flex flex-col md:flex-row gap-6 my-8">
      <div className="flex-5">
        <div className="group">
          <div className="relative aspect-3/4 overflow-hidden">
            <Image
              src="https://res.cloudinary.com/di7lyhf02/image/upload/q_auto/f_auto/v1782078136/poster1_c9erkc.png"
              alt="sample-1"
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
            />
          </div>
          <div className="relative my-2">
            <h3 className="text-2xl font-semibold">Spring Arrivals</h3>
            <p className="text-xs uppercase tracking-widest">View Editorial</p>
            <ArrowRight className="absolute top-0 right-0 size-4 -rotate-45 group-hover:rotate-0 transition duration-500" />
          </div>
        </div>
      </div>
      <div className="flex-4 space-y-5">
        <div className="group">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src="https://res.cloudinary.com/di7lyhf02/image/upload/q_auto/f_auto/v1782078136/poster3_bfwuyv.png"
              alt="sample-1"
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
        </div>
        <div className="group">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src="https://res.cloudinary.com/di7lyhf02/image/upload/q_auto/f_auto/v1782078130/poster2_mt3t1y.png"
              alt="sample-1"
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
        </div>
      </div>
    </section>
  );
};

export default SamplesSection;
