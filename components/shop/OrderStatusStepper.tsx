import { OrderStatus } from "@/generated/prisma/enums";
import { ORDER_STATUS_STEPS } from "@/lib/order-status";

export default function OrderStatusStepper({
  status,
}: {
  status: OrderStatus;
}) {
  if (status === "CANCELLED") {
    return (
      <div className="bg-red-50 border border-red-300 text-red-800 p-4 text-center font-medium">
        This order was cancelled.
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_STEPS.findIndex((s) => s.status === status);

  return (
    <div className="flex items-center">
      {ORDER_STATUS_STEPS.map((step, index) => {
        const isDone = index <= currentIndex;
        const isLast = index === ORDER_STATUS_STEPS.length - 1;
        return (
          <div
            key={step.status}
            className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
                  isDone
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-neutral/30 text-neutral"
                }`}>
                {index + 1}
              </div>
              <p
                className={`text-xs text-center text-nowrap ${
                  isDone ? "text-primary font-medium" : "text-neutral"
                }`}>
                {step.label}
              </p>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors ${
                  index < currentIndex ? "bg-primary" : "bg-neutral/20"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
