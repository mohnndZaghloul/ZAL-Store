import { CheckCheck } from "lucide-react";

export default function page() {
  return (
    <main className="min-h-[50vh] flex justify-center items-center">
      <h1 className="text-2xl capitalize flex">
        <CheckCheck className="text-green-500" /> Your order has been booked
      </h1>
    </main>
  );
}
