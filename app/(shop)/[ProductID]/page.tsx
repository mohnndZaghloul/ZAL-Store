import Image from "next/image";
import { Metadata } from "next";
import { getAllProducts, getProductById } from "@/actions/products-actions";
import { notFound } from "next/navigation";
import CustomCarousel from "@/components/shop/CustomCarousel";
import SimilarProducts from "@/components/shop/SimilarProducts";
import AddToCartSection from "@/components/shop/AddToCartSection";

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

  return (
    <main className="container my-8 space-y-4 md:space-y-8">
      <section className="flex flex-col md:flex-row gap-8">
        <div className="flex-2 md:hidden">
          <CustomCarousel images={product.images} />
        </div>
        <div className="hidden md:block flex-2">
          <div className="flex gap-2 w-full h-full">
            {product?.images.map((image) => (
              <div key={image} className="relative h-full w-full aspect-4/6">
                <Image
                  src={image}
                  alt={product?.title}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 divide-primary divide-y">
          <div className="py-4">
            <h3 className="uppercase font-light text-sm text-primary">
              Zal Store for you
            </h3>
            <h2 className="text-2xl uppercase">{product?.title}</h2>
            <span className="font-semibold">
              EGP {product?.price.toFixed(2)}
            </span>
          </div>
          <AddToCartSection product={product} />
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <p>Color</p>
              <div
                style={{ background: product.variants[0].color }}
                className="rounded-full w-8 aspect-square"
              />
            </div>
            {/* <div className="flex items-center justify-between pe-2">
              <p>In Stock</p>
              <div>
                {product.variants?.map((variant) => (
                  <p>
                    {variant.size}-{variant.stock}
                  </p>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </section>
      <SimilarProducts id={product.id} categoryId={product?.categories[0].id} />
    </main>
  );
}
