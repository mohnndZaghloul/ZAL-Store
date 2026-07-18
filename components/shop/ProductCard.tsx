import Image from "next/image";
import Link from "next/link";

import { Product_TP } from "@/types";

const ProductCard = ({ product }: { product: Product_TP }) => {
  return (
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
      <div className="text-center my-2">
        <p className="text-sm uppercase">{product?.title}</p>
        <span className="font-semibold">EGP {product?.price.toFixed(2)}</span>
      </div>
    </Link>
  );
};

export default ProductCard;
