"use client";

import React, { useState, useEffect, useId } from "react";
import Image from "next/image";
import { ProductItem, ProductCategory, siteConfig } from "@/config/siteConfig";
import { WhatsAppIcon } from "./Icons";
import { Eye, ArrowUpRight, X, Sparkles, Scale, Ruler, FileText } from "lucide-react";

export function CatalogueShowcase() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const searchInputId = useId();

  // Read URL query parameter on mount and listen to custom event from header menu
  useEffect(() => {
    function parseCategoryFromUrl() {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat === "buddha" || cat === "hindu" || cat === "all") {
        setActiveCategory(cat as ProductCategory);
      }
    }

    parseCategoryFromUrl();

    const handleCategoryEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ProductCategory>;
      if (customEvent.detail) {
        setActiveCategory(customEvent.detail);
      }
    };

    window.addEventListener("select-catalogue-category", handleCategoryEvent);
    window.addEventListener("popstate", parseCategoryFromUrl);

    return () => {
      window.removeEventListener("select-catalogue-category", handleCategoryEvent);
      window.removeEventListener("popstate", parseCategoryFromUrl);
    };
  }, []);

  // Close quick view dialog on Escape key
  useEffect(() => {
    if (!selectedProduct) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProduct(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedProduct]);

  const handleCategoryChange = (category: ProductCategory) => {
    setActiveCategory(category);
    if (typeof window !== "undefined") {
      const url = category === "all" ? "/#catalogue" : `/?category=${category}#catalogue`;
      window.history.pushState({}, "", url);
    }
  };

  const filteredProducts = siteConfig.products.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEnquiry = (product: ProductItem) => {
    const message = `Hello ${siteConfig.companyName}, I would like to enquire about:
- Statue: ${product.name} (Code: ${product.code})
- Category: ${product.categoryLabel}
- Available Sizes: ${product.dimension}
- Material: ${product.material}

Could you please share pricing and availability?`;

    const encoded = encodeURIComponent(message);
    const cleanNumber = siteConfig.whatsappNumber.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, "_blank", "noopener,noreferrer");
  };

  // Dynamic headings based on selected category
  const getCategoryTitle = () => {
    if (activeCategory === "buddha") return "Buddha Statues";
    if (activeCategory === "hindu") return "Hindu Statues";
    return "Product Catalogue";
  };

  const getCategorySubtitle = () => {
    if (activeCategory === "buddha") {
      return "Authentic lost-wax antique brass Buddha sculptures extracted directly from the official Advaita Tattva brochure.";
    }
    if (activeCategory === "hindu") {
      return "Sacred Hindu deities and devotional idols for home, puja space, and thoughtful gifting from the Advaita Tattva brochure.";
    }
    return "Advaita Tattva Antique Brass Idol Collection. Master-crafted devotional accents extracted directly from the official product brochure.";
  };

  const buddhaCount = siteConfig.products.filter((p) => p.category === "buddha").length;
  const hinduCount = siteConfig.products.filter((p) => p.category === "hindu").length;

  return (
    <section
      id="catalogue"
      aria-labelledby="catalogue-heading"
      className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E7E0D4] text-[10px] uppercase tracking-widest font-semibold text-[#785A1D]">
            <FileText className="w-3.5 h-3.5 text-[#B38A38]" />
            <span>Advaita Tattva Brochure Collection</span>
          </div>

          <h2
            id="catalogue-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#1C1917] tracking-tight transition-all duration-300"
          >
            {getCategoryTitle()}
          </h2>

          <p className="text-sm sm:text-base text-[#44403C] max-w-2xl leading-relaxed">
            {getCategorySubtitle()}
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72">
          <label htmlFor={searchInputId} className="sr-only">
            Search catalogue
          </label>
          <input
            id={searchInputId}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search statue by name..."
            className="w-full px-4 py-2.5 rounded-full border border-[#D8CCBD] bg-white text-xs text-[#1C1917] placeholder:text-[#8C827A] focus:outline-none focus:border-[#B38A38] focus:ring-2 focus:ring-[#B38A38]/20 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Category Pills (All, Buddha Statues, Hindu Statues) */}
      <div className="flex flex-wrap items-center gap-2.5 mb-10 pb-4 border-b border-[#E7E0D4]">
        <button
          type="button"
          onClick={() => handleCategoryChange("all")}
          className={`px-4 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 cursor-pointer ${
            activeCategory === "all"
              ? "bg-[#1C1917] text-white shadow-xs"
              : "bg-white text-[#44403C] border border-[#E7E0D4] hover:border-[#B38A38] hover:text-[#1C1917]"
          }`}
        >
          All Statues <span className="opacity-70 text-[10px]">({siteConfig.products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleCategoryChange("buddha")}
          className={`px-4 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 cursor-pointer ${
            activeCategory === "buddha"
              ? "bg-[#1C1917] text-white shadow-xs ring-2 ring-[#B38A38]/30"
              : "bg-white text-[#44403C] border border-[#E7E0D4] hover:border-[#B38A38] hover:text-[#1C1917]"
          }`}
        >
          Buddha Statues <span className="opacity-70 text-[10px]">({buddhaCount})</span>
        </button>

        <button
          type="button"
          onClick={() => handleCategoryChange("hindu")}
          className={`px-4 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 cursor-pointer ${
            activeCategory === "hindu"
              ? "bg-[#1C1917] text-white shadow-xs ring-2 ring-[#B38A38]/30"
              : "bg-white text-[#44403C] border border-[#E7E0D4] hover:border-[#B38A38] hover:text-[#1C1917]"
          }`}
        >
          Hindu Statues <span className="opacity-70 text-[10px]">({hinduCount})</span>
        </button>

        {activeCategory !== "all" && (
          <button
            type="button"
            onClick={() => handleCategoryChange("all")}
            className="ml-auto text-xs text-[#785A1D] hover:text-[#1C1917] hover:underline cursor-pointer"
          >
            Clear Filter &bull; Show All
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-[#E7E0D4] p-8">
          <p className="text-base text-[#44403C]">
            No statues matched your filter or search query.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="mt-4 px-5 py-2.5 rounded-full bg-[#1C1917] text-white text-xs uppercase tracking-wider cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col bg-white rounded-2xl border border-[#E7E0D4] hover:border-[#B38A38]/50 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Product Image Container */}
              <div className="relative aspect-square w-full bg-[#FAF8F5] p-6 flex items-center justify-center overflow-hidden border-b border-[#F0EAE1]">
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-[#E7E0D4] text-[10px] font-semibold tracking-widest uppercase text-[#785A1D]">
                    {product.categoryLabel}
                  </span>
                </div>

                {/* Quick View Button */}
                <button
                  type="button"
                  onClick={() => setSelectedProduct(product)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-xs border border-[#E7E0D4] text-[#44403C] hover:text-[#1C1917] hover:bg-white transition-all shadow-2xs cursor-pointer"
                  title="Quick View Brochure Details"
                  aria-label={`Quick view brochure details for ${product.name}`}
                >
                  <Eye className="w-4 h-4" />
                </button>

                {/* Product Image */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={product.image}
                    alt={`${product.name} - ${product.categoryLabel} from Advaita Tattva Brochure`}
                    width={600}
                    height={600}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-md"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-[#785A1D]">
                      {product.code}
                    </span>
                    <span className="text-[11px] font-medium text-[#44403C]">
                      {product.weight}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-medium text-[#1C1917] group-hover:text-[#B38A38] transition-colors leading-snug">
                    {product.name}
                  </h3>

                  <p className="text-xs text-[#785A1D] mt-1 italic">
                    {product.subtitle}
                  </p>

                  <p className="text-xs text-[#44403C] mt-3 line-clamp-2 leading-relaxed">
                    {product.tagline}
                  </p>

                  {/* Specifications & Available Sizes */}
                  <div className="mt-4 pt-4 border-t border-[#F0EAE1] space-y-1.5 text-xs text-[#44403C]">
                    <div className="flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-[#B38A38] shrink-0" />
                      <span>
                        <strong>Sizes:</strong> {product.dimension}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-[#B38A38] shrink-0" />
                      <span>
                        <strong>Weights:</strong> {product.weight}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#B38A38] shrink-0" />
                      <span className="truncate">{product.material}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-4 border-t border-[#F0EAE1] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEnquiry(product)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-semibold tracking-wider hover:bg-[#20ba59] transition-all shadow-xs active:scale-[0.98] cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-white" />
                    <span>Enquire on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className="p-2.5 rounded-xl border border-[#D8CCBD] bg-white text-[#44403C] hover:text-[#1C1917] hover:border-[#B38A38] transition-colors cursor-pointer"
                    title="View Brochure Specifications"
                    aria-label={`View brochure specifications for ${product.name}`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Quick View / Brochure Specification Modal */}
      {selectedProduct && (
        <dialog
          open
          onCancel={() => setSelectedProduct(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setSelectedProduct(null);
            }
          }}
          className="fixed inset-0 m-auto z-50 p-0 max-w-3xl w-[calc(100%-2rem)] rounded-2xl bg-[#FAF8F5] border border-[#E7E0D4] shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-xs open:animate-fade-in focus:outline-none"
        >
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between pb-4 border-b border-[#E7E0D4]">
              <div>
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#B38A38]">
                  {selectedProduct.categoryLabel}
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#1C1917] mt-1">
                  {selectedProduct.name}
                </h3>
                <p className="text-xs text-[#785A1D] italic">
                  {selectedProduct.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-full text-[#44403C] hover:text-[#1C1917] hover:bg-[#EAE3D7] transition-colors cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 items-start">
              {/* Image Preview */}
              <div className="aspect-square bg-white rounded-xl p-4 border border-[#E7E0D4] flex items-center justify-center">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  width={600}
                  height={600}
                  className="max-h-full max-w-full object-contain drop-shadow-md"
                />
              </div>

              {/* Specifications Table from Official Brochure */}
              <div className="space-y-4 text-xs">
                <p className="text-sm text-[#44403C] leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* SIZES & WEIGHTS Table from Brochure */}
                <div className="rounded-xl border border-[#E7E0D4] overflow-hidden bg-white shadow-2xs">
                  <div className="bg-[#1C1917] text-white px-3.5 py-2 font-serif text-xs tracking-wider uppercase">
                    <span>Sizes &amp; Weights (Brochure Specs)</span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E7E0D4] bg-[#FAF8F5] text-[#785A1D]">
                        <th className="py-2 px-3.5 font-semibold">Height</th>
                        <th className="py-2 px-3.5 font-semibold text-right">Weight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EAE1]">
                      {selectedProduct.availableSizes.map((sizeOpt, idx) => (
                        <tr key={idx} className="hover:bg-[#FAF8F5]/60 transition-colors">
                          <td className="py-2 px-3.5 font-medium text-[#1C1917]">
                            {sizeOpt.height}
                          </td>
                          <td className="py-2 px-3.5 text-right text-[#44403C]">
                            {sizeOpt.weight}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-2.5 bg-[#FAF8F5] text-[11px] text-[#785A1D] italic text-center border-t border-[#E7E0D4]">
                    Looking for a different size? Custom sizes are available on request.
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleEnquiry(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] text-white text-xs font-semibold tracking-wider hover:bg-[#20ba59] transition-all cursor-pointer shadow-sm"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-white" />
                    <span>Enquire for this Piece on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="w-full py-1.5 text-center text-xs text-[#785A1D] hover:underline cursor-pointer"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
}
