
"use client";

import { useState } from "react";
import { X, Ruler } from "lucide-react";
import Image from "next/image";

const categories = [
  "Shirts",
  "T-Shirts",
  "Pants",
  "Sweaters",
  "Hoodies",
];

const shirtSizes = [
  { size: "S", chest: 54, waist: 50, length: 76, sleeve: 66, collar: 38 },
  { size: "M", chest: 57, waist: 53, length: 77, sleeve: 67, collar: 40 },
  { size: "L", chest: 60, waist: 56, length: 78, sleeve: 68, collar: 42 },
  { size: "XL", chest: 63, waist: 59, length: 79, sleeve: 69, collar: 44 },
  { size: "2XL", chest: 66, waist: 62, length: 80, sleeve: 70, collar: 46 },
  { size: "3XL", chest: 69, waist: 65, length: 81, sleeve: 71, collar: 48 },
  { size: "4XL", chest: 72, waist: 71, length: 82, sleeve: 72, collar: 50 },
  { size: "5XL", chest: 75, waist: 74, length: 83, sleeve: 73, collar: 52 },
  { size: "6XL", chest: 77, waist: 76, length: 84, sleeve: 74, collar: 54 },
  { size: "7XL", chest: 79, waist: 78, length: 84, sleeve: 75, collar: 56 },
];

const tShirtSizes = [
    { size: "S", chest: 48, waist: 46, length: 68, sleeve: 20 },
    { size: "M", chest: 51, waist: 49, length: 70, sleeve: 21 },
    { size: "L", chest: 54, waist: 52, length: 72, sleeve: 22 },
    { size: "XL", chest: 57, waist: 55, length: 74, sleeve: 23 },
    { size: "2XL", chest: 60, waist: 58, length: 76, sleeve: 24 },
    { size: "3XL", chest: 63, waist: 61, length: 78, sleeve: 25 },
    { size: "4XL", chest: 66, waist: 64, length: 80, sleeve: 26 },
    { size: "5XL", chest: 69, waist: 67, length: 82, sleeve: 27 },
    { size: "6XL", chest: 72, waist: 70, length: 84, sleeve: 28 },
    { size: "7XL", chest: 75, waist: 73, length: 86, sleeve: 29 },
  ];

  const pantsSizes = [
    { size: "S", waist: 72, hip: 94, length: 100, thigh: 54 },
    { size: "M", waist: 76, hip: 98, length: 102, thigh: 56 },
    { size: "L", waist: 80, hip: 102, length: 104, thigh: 58 },
    { size: "XL", waist: 84, hip: 106, length: 106, thigh: 60 },
    { size: "2XL", waist: 88, hip: 110, length: 108, thigh: 62 },
    { size: "3XL", waist: 92, hip: 114, length: 110, thigh: 64 },
    { size: "4XL", waist: 96, hip: 118, length: 112, thigh: 66 },
    { size: "5XL", waist: 100, hip: 122, length: 114, thigh: 68 },
    { size: "6XL", waist: 104, hip: 126, length: 116, thigh: 70 },
    { size: "7XL", waist: 108, hip: 130, length: 118, thigh: 72 },
  ];


const SizeGuideDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Shirts");

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hover:text-primary transition-colors"
      >
      SIZE GUIDE
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 md:p-6"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-guide-title"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-5 py-4 md:px-8">
              <div>
                <h2
                  id="size-guide-title"
                  className="text-xl md:text-2xl uppercase tracking-widest"
                >
                  Size Guide
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Find your perfect fit
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close size guide"
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row overflow-y-auto max-h-[calc(90vh-85px)]">
              {/* Sidebar */}
              <aside className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r p-4 md:p-6">
                <p className="mb-4 text-xs uppercase tracking-widest text-gray-400">
                  Categories
                </p>

                <div className="flex md:flex-col gap-2 overflow-x-auto">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`shrink-0 text-left px-4 py-3 text-sm transition-all ${
                        activeCategory === category
                          ? "bg-black text-white"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </aside>



{/* Size chart */}
<section className="flex-1 min-w-0 p-4 md:p-6">
  <div className="flex items-center gap-2 mb-2">
    <Ruler size={18} />
    <h3 className="text-lg uppercase tracking-wider">
      {activeCategory} Size Chart
    </h3>
  </div>

  <p className="text-xs text-gray-500 mb-5">
    All measurements are in centimeters (cm).
  </p>

  {(() => {
    const charts = {
      Shirts: {
        image: "/images/shirt-size-guide.png",
        sizes: shirtSizes,
        measurements: [
          { label: "Chest", key: "chest" },
          { label: "Waist", key: "waist" },
          { label: "Length", key: "length" },
          { label: "Sleeve", key: "sleeve" },
          { label: "Collar", key: "collar" },
        ],
      },
      "T-Shirts": {
        image: "/images/tshirt-size-guide.png",
        sizes: tShirtSizes,
        measurements: [
          { label: "Chest", key: "chest" },
          { label: "Waist", key: "waist" },
          { label: "Length", key: "length" },
          { label: "Sleeve", key: "sleeve" },
        ],
      },
      Pants: {
        image: "/images/pants-size-guide.png",
        sizes: pantsSizes,
        measurements: [
          { label: "Waist", key: "waist" },
          { label: "Hip", key: "hip" },
          { label: "Length", key: "length" },
          { label: "Thigh", key: "thigh" },
        ],
      },
    };

    const chart = charts[activeCategory as keyof typeof charts];

    if (!chart) {
      return (
        <div className="flex min-h-64 flex-col items-center justify-center bg-gray-50 p-6 text-center">
          <Ruler size={32} className="mb-3 text-gray-400" />
          <h4 className="text-sm font-medium uppercase tracking-wider">
            {activeCategory} measurements
          </h4>
          <p className="mt-2 max-w-sm text-xs leading-6 text-gray-500">
            The size chart for this category will be added soon.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(130px,0.28fr)_1fr] gap-4 items-center">
        {/* Measurement Image */}
        <div className="flex justify-center items-center bg-[#f8f8f8] p-2">
          <Image
            src={chart.image}
            alt={`${activeCategory} measurement guide`}
            width={300}
            height={350}
            className="w-full max-w-[180px] h-auto max-h-[280px] object-contain"
          />
        </div>

        {/* Size Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-center text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Measurement</th>
                {chart.sizes.map((item) => (
                  <th key={item.size} className="border p-3">
                    {item.size}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {chart.measurements.map((measurement) => (
                <tr key={measurement.key} className="hover:bg-gray-50">
                  <th className="border p-3 text-left font-medium">
                    {measurement.label}
                  </th>

                  {chart.sizes.map((item) => (
                    <td key={item.size} className="border p-3">
                      {item[measurement.key as keyof typeof item]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  })()}
</section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SizeGuideDialog;
