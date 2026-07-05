import Image from "next/image";
import img from "@/public/images/gon&kelua.jpg";
import { Metadata } from "next";
import { getAllProducts, getProductById } from "@/actions/products-actions";
import { notFound } from "next/navigation";
import SpecialButton from "@/components/SpecialButton";

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
    <main className="container my-8 flex flex-col md:flex-row gap-8 h-screen">
      <div className="flex-2">
        <div className="flex gap-2 w-full h-full">
          {product?.images.map((image) => (
            <div key={image} className="relative h-full w-full">
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
          <span className="font-semibold">EGP {product?.price.toFixed(2)}</span>
        </div>
        <div className="py-4">
          <p>Size</p>
          <div className="flex gap-4 pt-2">
            {product.variants.map((item) => (
              <SpecialButton key={item.id} info>
                {item.size}
              </SpecialButton>
            ))}
          </div>
        </div>
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <p>Color</p>
            <div
              style={{ background: product.variants[0].color }}
              className="rounded-full w-8 aspect-square"
            />
          </div>
          <div className="flex items-center justify-between pe-2">
            <p>In Stock</p>
            <div>{product.variants[0].stock}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
