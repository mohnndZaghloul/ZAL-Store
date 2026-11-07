
"use client";

import { useState } from "react";
import { X, ShieldCheck } from "lucide-react";

const PolicyDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const policies = [
    "Please inspect your order upon delivery.",

    "Returns or exchanges may be requested within 48 hours of receiving your order.",

    "Items must be returned in their original condition, unworn, unused, and with all original tags attached.",

    "Any damaged, defective, or incorrect item must be reported within 24 hours of delivery with clear photo or video proof.",

    "Products that show signs of wear, washing, alteration, or misuse are not eligible for return or exchange.",

    "ZAL reserves the right to decline any return or exchange request that does not meet the conditions above.",
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hover:text-primary transition-colors"
      >
        POLICY
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 md:p-6"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="policy-title"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-5 py-5 md:px-8">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} />
                  <h2
                    id="policy-title"
                    className="text-xl md:text-2xl uppercase tracking-widest"
                  >
                    POLICY
                  </h2>
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  ZAL Store – Returns & Exchanges
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close policy"
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Policy Content */}
            <div className="p-5 md:p-8">
              <div className="space-y-5">
                {policies.map((policy, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <span className="flex shrink-0 items-center justify-center w-6 h-6 bg-gray-100 text-xs font-semibold">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <p className="text-sm leading-7 text-gray-600">
                      {policy}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t pt-6 text-center">
                <p className="text-sm uppercase tracking-widest font-medium">
                  Thank you for shopping with ZAL.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PolicyDialog;
