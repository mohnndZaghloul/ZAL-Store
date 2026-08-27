import Image from "next/image";
import Link from "next/link";

import { Product_TP } from "@/types";
import { getEffectivePrice, isOnSale } from "@/lib/pricing";

const ProductCard = ({ product }: { product: Product_TP }) => {
  return (
    <Link href={`./${product.id}`}>
      <div className="relative overflow-hidden group aspect-3/4 p-1">
        <Image src={product?.images[0]} alt={product?.title} fill />
        {product.images.length > 1 && (
          <Image
            src={product?.images[1]}
            alt={product?.title}
            fill
            className="opacity-0 group-hover:opacity-100 transition duration-300"
          />
        )}
        <button className="absolute bottom-0 left-0 translate-y-full group-hover:translate-y-0 w-full py-4 bg-primary text-primary-foreground uppercase text-xs tracking-widest cursor-pointer transition duration-300">
          add to cart
        </button>
      </div>
      <div className="text-center my-2">
        <p className="text-sm uppercase">{product?.title}</p>
        <div className="flex items-center justify-center gap-2 mt-1">
          {isOnSale(product.discountPercent) ? (
            <>
              <span className="text-xs text-neutral line-through">
                EGP {product.price.toFixed(2)}
              </span>

              <span className="font-semibold">
                EGP{" "}
                {getEffectivePrice(
                  product.price,
                  product.discountPercent,
                ).toFixed(2)}
              </span>

              <span className="text-[10px] font-semibold text-red-600">
                -{product.discountPercent}%
              </span>
            </>
          ) : (
            <span className="font-semibold">
              EGP {product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
