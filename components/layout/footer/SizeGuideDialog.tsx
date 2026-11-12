
"use client";

import { useState } from "react";
import { X, Ruler } from "lucide-react";
import Image from "next/image";

const categories = [
  "Shirts",
  "T-Shirts",
  "Pants",
  "Pullover",
];

const shirtSizes = [
  { size: "XS", chest: 92, bicep: 42, length: 73, sleeve: 61, collar: 37 },
  { size: "S", chest: 94, bicep: 43, length: 74, sleeve: 62, collar: 38 },
  { size: "M", chest: 98, bicep: 44, length: 75, sleeve: 63, collar: 39 },
  { size: "L", chest: 102, bicep: 45, length: 76, sleeve: 64, collar: 41 },
  { size: "XL", chest: 106, bicep: 46, length: 77, sleeve: 65, collar: 43 },
  { size: "2XL", chest: 110, bicep: 47, length: 78, sleeve: 66, collar: 45 },
  { size: "3XL", chest: 114, bicep: 48, length: 79, sleeve: 67, collar: 47 },
  { size: "4XL", chest: 118, bicep: 49, length: 80, sleeve: 68, collar: 49 },
  { size: "5XL", chest: 122, bicep: 50, length: 81, sleeve: 69, collar: 51 },
  { size: "6XL", chest: 126, bicep: 51, length: 82, sleeve: 70, collar: 53 },
];

const tShirtSizes = [
    { size: "XS", chest: 49, bicep: 18, length: 70, sleeve: 22.5 },
    { size: "S", chest: 52, bicep: 19, length: 71.5, sleeve: 23 },
    { size: "M", chest: 55, bicep: 20, length: 73, sleeve: 23.5 },
    { size: "L", chest: 58, bicep: 21, length: 75, sleeve: 24 },
    { size: "XL", chest: 61.5, bicep: 22, length: 77, sleeve: 24.5 },
    { size: "2XL", chest: 65, bicep: 23, length: 79, sleeve: 25 },
    { size: "3XL", chest: 68.5, bicep: 24, length: 81, sleeve: 25.5 },
    { size: "4XL", chest: 72, bicep: 25, length: 83, sleeve: 26 },
    { size: "5XL", chest: 75.5, bicep: 26, length: 85, sleeve: 26.5 },
    { size: "6XL", chest: 79, bicep: 27, length: 87, sleeve: 27 },
  ];

  const pantsSizes = [
    { size: "XS", waist: 80, hip: 93, length: 104, thigh: 61 },
    { size: "S", waist: 84, hip: 97, length: 105, thigh: 64 },
    { size: "M", waist: 88, hip: 101, length: 106, thigh: 66 },
    { size: "L", waist: 92, hip: 105, length: 107, thigh: 69 },
    { size: "XL", waist: 96, hip: 109, length: 108, thigh: 72 },
    { size: "2XL", waist: 100, hip: 113, length: 109, thigh: 74 },
    { size: "3XL", waist: 104, hip: 117, length: 110, thigh: 77 },
    { size: "4XL", waist: 108, hip: 121, length: 111, thigh: 79 },
    { size: "5XL", waist: 112, hip: 124, length: 112, thigh: 82 },
    { size: "6XL", waist: 116, hip: 128, length: 113, thigh: 85 },
  ];

  const PulloverSizes = [
    { size: "XS", chest: 50, bicep: 16.5, length: 65, sleeve: 61 },
    { size: "S", chest: 52, bicep: 17.5, length: 66 , sleeve: 63 },
    { size: "M", chest: 54, bicep: 18.5, length: 68, sleeve: 63 },
    { size: "L", chest: 56, bicep: 19.5, length: 70, sleeve: 64 },
    { size: "XL", chest: 60, bicep: 20.5, length: 72, sleeve: 65 },
    { size: "2XL", chest: 63.5, bicep: 21.5, length: 74, sleeve: 66 },
    { size: "3XL", chest: 66.5, bicep: 22.5, length: 74, sleeve: 67 },
    { size: "4XL", chest: 70, bicep: 23.5, length: 76, sleeve: 68 },
    { size: "5XL", chest: 73.5, bicep: 24.5, length: 76, sleeve: 69 },
    { size: "6XL", chest: 76, bicep: 25.5, length: 78, sleeve: 70 },
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
          { label: "bicep", key: "bicep" },
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
          { label: "bicep", key: "bicep" },
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
      Pullover: {
        image: "/images/pullover-size-guide.png",
        sizes: PulloverSizes,
        measurements: [
          { label: "Chest", key: "chest" },
          { label: "bicep", key: "bicep" },
          { label: "Length", key: "length" },
          { label: "Sleeve", key: "sleeve" },
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
