
import { Metadata } from "next";
import { getAllProducts, getProductById } from "@/actions/products-actions";
import { notFound } from "next/navigation";
import CustomCarousel from "@/components/shop/CustomCarousel";
import SimilarProducts from "@/components/shop/SimilarProducts";
import AddToCartSection from "@/components/shop/AddToCartSection";
import { getEffectivePrice, isOnSale } from "@/lib/pricing";
import Image from "next/image";

export const dynamic = "force-dynamic";

type Props_TP = {
  params: Promise<{
    ProductID: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props_TP): Promise<Metadata> {
  const { ProductID } = await params;
  const product = await getProductById(ProductID);

  if (!product) {
    return { title: "not founded product" };
  }

  return {
    title: `${product.title} | ZAL Store`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images.map((url) => ({ url })),
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ ProductID: product.id.toString() }));
}

export default async function ProductDetailsPage({ params }: Props_TP) {
  const { ProductID } = await params;
  const product = await getProductById(ProductID);

  if (!product) notFound();

  const categoryName = product.categories?.[0]?.name ?? "";
const categoryId = product.categories?.[0]?.id;
  return (
    <main className="container my-8 space-y-8">
<section className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6 lg:gap-8 items-start">

        {/* Mobile Gallery */}
        <div className="md:hidden">
          <CustomCarousel images={product.images} />
        </div>

       {/* Desktop Gallery: two images side by side */}
<div className="hidden md:grid grid-cols-2 gap-3">
  {product.images.map((image, index) => (
    <div
      key={`${image}-${index}`}
      className="relative w-full aspect-[3/4] overflow-hidden bg-gray-50"
    >
      <Image
        src={image}
        alt={`${product.title} - image ${index + 1}`}
        fill
        sizes="(max-width: 1024px) 25vw, 25vw"
        className="object-cover"
      />
    </div>
  ))}
</div>
        {/* Product Information */}
        <div className="min-w-0 md:sticky md:top-24 divide-primary divide-y">
          <div className="py-4">
            <h3 className="uppercase font-light text-sm text-primary">
              Zal Store for you
            </h3>

            <h2 className="text-2xl uppercase">{product.title}</h2>

            <div className="flex items-center gap-3 mt-3 flex-wrap">
              {isOnSale(product.discountPercent) ? (
                <>
                  <span className="text-sm text-neutral line-through">
                    EGP {product.price.toFixed(2)}
                  </span>

                  <span className="text-2xl font-semibold text-primary">
                    EGP{" "}
                    {getEffectivePrice(
                      product.price,
                      product.discountPercent,
                    ).toFixed(2)}
                  </span>

                  <span className="bg-red-100 text-red-600 px-2 py-1 text-xs font-semibold">
                    -{product.discountPercent}%
                  </span>
                </>
              ) : (
                <span className="text-2xl font-semibold text-primary">
                  EGP {product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <AddToCartSection
            product={product}
            categoryName={categoryName}
          />

          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <p>Color</p>
              {product.variants?.[0]?.color && (
                <div
                  style={{ background: product.variants[0].color }}
                  className="rounded-full w-8 aspect-square"
                />
              )}
            </div>
            {/* <div className="flex items-center justify-between pe-2">
              <p>In Stock</p>
              <div>
                {product.variants?.map((variant) => (
                  <p>
                    size :{variant.size}- in stock{variant.stock}
                  </p>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {categoryId && (
  <SimilarProducts
    id={product.id}
    categoryId={categoryId}
  />
)}
    </main>
  );
}
