import Image from "next/image";
import img from "@/public/images/gon&kelua.jpg";

export default function ProductDetailsPage() {
  return (
    <main className="container my-8 flex gap-8 h-screen">
      <div className="flex-1">
        <div className="relative h-full w-full">
          <Image src={img} alt="test" fill />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="uppercase font-light text-sm text-primary">
          Zal Store for you
        </h3>
        <h2 className="text-2xl uppercase">Slim Fit Linen Shirt </h2>
        <span>EGP 750.00</span>
      </div>
    </main>
  );
}
