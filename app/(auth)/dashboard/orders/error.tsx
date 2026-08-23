"use client";

import SpecialButton from "@/components/SpecialButton";

export default function OrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-[50vh] flex flex-col gap-4 justify-center items-center">
      <h1 className="text-xl max-w-2xs text-center capitalize">
        There is Error on loading orders from database
      </h1>
      <SpecialButton onClick={() => reset()}>refresh the page</SpecialButton>
    </main>
  );
}
