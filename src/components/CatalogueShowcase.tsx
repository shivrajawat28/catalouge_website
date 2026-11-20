"use client";

import React, { useState, useEffect, useId, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductItem, ProductCategory, siteConfig } from "@/config/siteConfig";
import { WhatsAppIcon } from "./Icons";
import { Eye, ArrowUpRight, X, Sparkles, Scale, Ruler, FileText } from "lucide-react";

export type CatalogueShowcaseVariant = "featured" | "all";

interface CatalogueShowcaseProps {
  variant?: CatalogueShowcaseVariant;
  headingLevel?: "h1" | "h2";
}

interface CategoryInfo {
  id: string;
  label: string;
  description?: string;
}

export function CatalogueShowcase({
  variant = "all",
  headingLevel = "h2",
}: CatalogueShowcaseProps) {
  const isFeaturedOnly = variant === "featured";
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [productsList, setProductsList] = useState<ProductItem[]>(siteConfig.products);
  const [categoriesList, setCategoriesList] = useState<CategoryInfo[]>([
    { id: "buddha", label: "Buddha Statues", description: "Authentic lost-wax antique brass Buddha sculptures extracted directly from the official Advaita Tattva brochure." },
    { id: "hindu", label: "Hindu Statues", description: "Sacred Hindu deities and devotional idols for home, puja space, and thoughtful gifting from the Advaita Tattva brochure." },
  ]);
  const searchInputId = useId();
  const quickViewDialogRef = useRef<HTMLDialogElement>(null);

  // Revalidate with dynamic /api/catalog on client mount
  useEffect(() => {
    let mounted = true;
    async function syncDynamicCatalog() {
      try {
        const res = await fetch("/api/catalog");
        if (res.ok) {
          const data = await res.json();
          if (mounted && data.success) {
            if (Array.isArray(data.products) && data.products.length > 0) {
              setProductsList(data.products);
            }
            if (Array.isArray(data.categories) && data.categories.length > 0) {
              setCategoriesList(data.categories);
            }
          }
        }
      } catch {
        // Fallback to static siteConfig seamlessly
      }
    }
    syncDynamicCatalog();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const dialog = quickViewDialogRef.current;
    if (!dialog) return;

    if (selectedProduct) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [selectedProduct]);

  // Read URL query parameter on mount and listen to custom event from header menu
  useEffect(() => {
    if (isFeaturedOnly) return;

    function parseCategoryFromUrl() {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat === "buddha" || cat === "hindu" || cat === "all") {
        setActiveCategory(cat as ProductCategory);
      } else {
        setActiveCategory("all");
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
  }, [isFeaturedOnly]);

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
      const url = category === "all" ? "/products" : `/products?category=${category}`;
      window.history.pushState({}, "", url);
    }
  };

  const featuredProducts = productsList.filter((p) => p.featured);

  const filteredProducts = isFeaturedOnly
    ? featuredProducts
    : productsList.filter((product) => {
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

  // Dynamic headings based on variant and selected category
  const getCategoryTitle = () => {
    if (isFeaturedOnly) return "Featured Collection";
    if (activeCategory === "all") return "Our Complete Collection";
    const found = categoriesList.find((c) => c.id === activeCategory);
    if (found) return found.label;
    if (activeCategory === "buddha") return "Buddha Statues";
    if (activeCategory === "hindu") return "Hindu Statues";
    return "Our Complete Collection";
  };

  const getCategorySubtitle = () => {
    if (isFeaturedOnly) {
      return "Curated antique brass highlights across our Buddha and Hindu devotional collections. Explore bespoke finishes, authentic lost-wax artistry, and heirloom sizes.";
    }
    const found = categoriesList.find((c) => c.id === activeCategory);
    if (found && found.description) return found.description;
    if (activeCategory === "buddha") {
      return "Authentic lost-wax antique brass Buddha sculptures extracted directly from the official Advaita Tattva brochure.";
    }
    if (activeCategory === "hindu") {
      return "Sacred Hindu deities and devotional idols for home, puja space, and thoughtful gifting from the Advaita Tattva brochure.";
    }
    return "Explore our handcrafted antique brass idols, thoughtfully created to bring timeless artistry and spiritual elegance into your space.";
  };

  const HeadingTag = headingLevel;

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
            <span>
              {isFeaturedOnly
                ? "Curated Brass Highlights"
                : "Advaita Tattva Brochure Collection"}
            </span>
          </div>

          <HeadingTag
            id="catalogue-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#1C1917] tracking-tight transition-all duration-300"
          >
            {getCategoryTitle()}
          </HeadingTag>

          <p className="text-sm sm:text-base text-[#44403C] max-w-2xl leading-relaxed">
            {getCategorySubtitle()}
          </p>
        </div>

        {/* Search Input (shown on Complete Collection page) */}
        {!isFeaturedOnly && (
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
              className="w-full px-4 py-2.5 rounded-full border border-[#D8CCBD] bg-white text-xs text-[#1C1917] placeholder:text-[#6E655E] focus:outline-none focus:border-[#B38A38] focus:ring-2 focus:ring-[#B38A38]/20 transition-all shadow-2xs"
            />
          </div>
        )}
      </div>

      {/* Category Pills (Dynamic from categoriesList) */}
      {!isFeaturedOnly && (
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
            All Products <span className="opacity-70 text-[10px]">({productsList.length})</span>
          </button>

          {categoriesList.map((cat) => {
            const count = productsList.filter((p) => p.category === cat.id).length;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id as ProductCategory)}
                className={`px-4 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#1C1917] text-white shadow-xs ring-2 ring-[#B38A38]/30"
                    : "bg-white text-[#44403C] border border-[#E7E0D4] hover:border-[#B38A38] hover:text-[#1C1917]"
                }`}
              >
                {cat.label} <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}

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
      )}

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
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 380px"
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

      {/* Homepage Featured Showcase CTA to Complete Collection */}
      {isFeaturedOnly && (
        <div
          id="complete-collection-cta"
          className="mt-14 rounded-2xl bg-white border border-[#E7E0D4] px-6 py-10 sm:px-10 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-xs"
        >
          <div className="space-y-2 max-w-xl">
            <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#785A1D]">
              {siteConfig.products.length} Handcrafted Sculptures
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917] tracking-tight">
              Explore Our Complete Collection
            </h3>
            <p className="text-sm sm:text-base text-[#44403C] leading-relaxed">
              Discover our complete collection of handcrafted antique brass idols.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1C1917] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#292524] hover:shadow-md transition-all active:scale-[0.98] shrink-0"
          >
            <span>View All Products</span>
            <ArrowUpRight className="w-4 h-4 text-[#D4B062]" />
          </Link>
        </div>
      )}

      {/* Quick View / Brochure Specification Modal */}
      {selectedProduct && (
        <dialog
          ref={quickViewDialogRef}
          aria-modal="true"
          aria-labelledby="quick-view-product-title"
          onCancel={(e) => {
            e.preventDefault();
            setSelectedProduct(null);
          }}
          onClick={(e) => {
            if (e.target === quickViewDialogRef.current) {
              setSelectedProduct(null);
            }
          }}
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
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#785A1D]">
                  {selectedProduct.categoryLabel}
                </span>
                <h3
                  id="quick-view-product-title"
                  className="font-serif text-2xl font-medium text-[#1C1917] mt-1"
                >
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
