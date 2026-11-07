"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/siteConfig";
import {
  FileText,
  Download,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  Layers,
  Eye,
  Maximize2,
} from "lucide-react";

export function CatalogueSection() {
  const [pdfAvailable, setPdfAvailable] = useState<boolean>(true);
  const [previewMode, setPreviewMode] = useState<"cover" | "reader">("cover");

  useEffect(() => {
    // Check if catalogue PDF is available via status API, falling back to HEAD
    fetch("/api/catalogue-status")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.available === "boolean") {
          setPdfAvailable(data.available);
        }
      })
      .catch(() => {
        // Fallback HEAD request to static path
        fetch(siteConfig.cataloguePdfPath, { method: "HEAD" })
          .then((res) => setPdfAvailable(res.ok))
          .catch(() => setPdfAvailable(false));
      });
  }, []);

  return (
    <section
      id="catalogue-brochure"
      className="py-16 sm:py-24 bg-[#F5F1EB] border-y border-[#E7E0D4] relative overflow-hidden"
    >
      {/* Subtle background ambient styling */}
      <div className="absolute inset-0 bg-[radial-gradient(#E8DFC8_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Information & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#E7E0D4] text-[10px] font-semibold tracking-[0.2em] uppercase text-[#785A1D] shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#B38A38]" />
              <span>OFFICIAL PRODUCT CATALOGUE</span>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1C1917] tracking-tight leading-[1.15]">
                Explore Our Collection
              </h2>
              <div className="w-16 h-0.5 bg-[#B38A38]" />
            </div>

            <p className="text-sm sm:text-base text-[#44403C] leading-relaxed max-w-xl font-normal">
              Discover our collection of handcrafted brass sculptures, inspired by Indian heritage, spirituality and traditional artistry.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-[#57534E]">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/80 border border-[#E7E0D4]/80">
                <BookOpen className="w-4 h-4 text-[#B38A38] shrink-0" />
                <span>Complete Collection &bull; 21 Pages</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/80 border border-[#E7E0D4]/80">
                <Layers className="w-4 h-4 text-[#B38A38] shrink-0" />
                <span>Custom Sizes on Request</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <a
                href={siteConfig.cataloguePdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#1C1917] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#292524] transition-all shadow-md group cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#C5A059]" />
                <span>View Full Catalogue</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>

              <a
                href={siteConfig.cataloguePdfPath}
                download="Advaita-Tattva-Catalogue.pdf"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[#D8CCBD] bg-white text-[#1C1917] text-xs font-semibold tracking-wider uppercase hover:border-[#B38A38] hover:text-[#B38A38] transition-all shadow-2xs group cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#B38A38] group-hover:translate-y-0.5 transition-transform" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>

          {/* Right Column: PDF Preview Frame */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md sm:max-w-lg rounded-2xl bg-white border border-[#E7E0D4] shadow-xl p-3 sm:p-4 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-[#B38A38]/50">
              
              {/* Outer decorative golden corner accents */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#B38A38]/40 z-20 pointer-events-none" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#B38A38]/40 z-20 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#B38A38]/40 z-20 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#B38A38]/40 z-20 pointer-events-none" />

              {pdfAvailable ? (
                <div className="space-y-3">
                  {/* Top Preview Controls Bar */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#785A1D]">
                        Official Brochure &bull; 21 Pages
                      </span>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="inline-flex rounded-lg bg-[#FAF8F5] p-0.5 border border-[#E7E0D4] text-[10px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setPreviewMode("cover")}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          previewMode === "cover"
                            ? "bg-white text-[#1C1917] shadow-2xs font-bold"
                            : "text-[#78716C] hover:text-[#1C1917]"
                        }`}
                      >
                        Cover Page
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode("reader")}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          previewMode === "reader"
                            ? "bg-white text-[#1C1917] shadow-2xs font-bold"
                            : "text-[#78716C] hover:text-[#1C1917]"
                        }`}
                      >
                        PDF Reader
                      </button>
                    </div>
                  </div>

                  {/* Main Preview Container */}
                  <div className="relative w-full aspect-[1/1.34] rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E7E0D4] shadow-inner group">
                    {previewMode === "cover" ? (
                      /* Actual First Page / Cover Render */
                      <a
                        href={siteConfig.cataloguePdfPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block w-full h-full cursor-pointer overflow-hidden"
                        title="Click to view full 21-page PDF"
                      >
                        <Image
                          src="/catalogue/catalogue-cover.jpg"
                          alt="Advaita Tattva Official Miniature Brass Idol Catalogue Cover"
                          fill
                          sizes="(max-width: 768px) 100vw, 500px"
                          priority
                          className="object-contain p-2 sm:p-3 transition-transform duration-500 group-hover:scale-[1.02]"
                        />

                        {/* Hover Overlay with Action Prompt */}
                        <div className="absolute inset-0 bg-[#1C1917]/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1917]/95 text-white text-xs font-semibold tracking-wider uppercase shadow-lg">
                            <Maximize2 className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>Open Full Catalogue (21 Pages)</span>
                          </span>
                        </div>

                        {/* Bottom Tag */}
                        <div className="absolute bottom-3 right-3 z-10">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-[#E7E0D4] text-[10px] font-semibold text-[#1C1917] shadow-xs">
                            <Eye className="w-3 h-3 text-[#B38A38]" />
                            <span>Click to Expand</span>
                          </span>
                        </div>
                      </a>
                    ) : (
                      /* Live Interactive PDF Viewer */
                      <iframe
                        src={`${siteConfig.cataloguePdfPath}#toolbar=0&navpanes=0&view=Fit`}
                        className="w-full h-full border-0"
                        title="Advaita Tattva Official Product Catalogue Preview"
                      />
                    )}
                  </div>
                </div>
              ) : (
                /* Premium Branded Placeholder Frame (Fallback if PDF is absent) */
                <div className="w-full aspect-[1/1.38] rounded-xl bg-gradient-to-b from-[#FAF8F5] via-[#F6F1EA] to-[#ECE5D8] border border-[#E7E0D4] flex flex-col justify-between p-6 sm:p-8 text-center relative overflow-hidden">
                  <div className="space-y-1 z-10">
                    <p className="font-serif text-xs font-semibold tracking-[0.25em] uppercase text-[#785A1D]">
                      {siteConfig.companyName}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-[#A8A29E]">
                      {siteConfig.tagline}
                    </p>
                  </div>

                  <div className="my-auto py-6 space-y-4 z-10 flex flex-col items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 border border-[#E7E0D4] flex items-center justify-center shadow-md">
                      <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-[#B38A38]" />
                    </div>

                    <div className="space-y-1.5 max-w-xs">
                      <span className="inline-block px-3 py-1 rounded-full bg-[#1C1917] text-[#C5A059] text-[10px] font-semibold tracking-widest uppercase">
                        Official Catalogue
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl font-medium text-[#1C1917]">
                        High-Resolution Brochure
                      </h3>
                      <p className="text-xs text-[#57534E] leading-relaxed">
                        Curated collection featuring Buddha and Hindu brass sculptures, verified weights, and certified dimensions.
                      </p>
                    </div>
                  </div>

                  <div className="z-10 bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-[#E7E0D4] space-y-1">
                    <p className="text-[10px] text-[#78716C]">
                      Full High-Resolution PDF &bull; Ready for offline view &amp; download
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
