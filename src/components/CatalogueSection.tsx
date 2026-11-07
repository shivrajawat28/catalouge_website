"use client";

import React, { useState, useEffect } from "react";
import { siteConfig } from "@/config/siteConfig";
import { FileText, Download, ArrowUpRight, Sparkles, BookOpen, Layers } from "lucide-react";

export function CatalogueSection() {
  const [pdfAvailable, setPdfAvailable] = useState<boolean>(false);

  useEffect(() => {
    // Check if the configured catalogue PDF is available on the server
    fetch(siteConfig.cataloguePdfPath, { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          setPdfAvailable(true);
        } else {
          setPdfAvailable(false);
        }
      })
      .catch(() => {
        setPdfAvailable(false);
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
                <span>Complete 2026 Collection</span>
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

            <p className="text-[11px] text-[#785A1D] italic pt-1">
              File target: <span className="font-mono text-[10px] text-[#44403C] not-italic">/catalogue/advaita-tattva-catalogue.pdf</span>
            </p>
          </div>

          {/* Right Column: PDF Preview Frame / Branded Placeholder */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md sm:max-w-lg aspect-[1/1.38] rounded-2xl bg-white border border-[#E7E0D4] shadow-xl p-3 sm:p-4 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-[#B38A38]/50">
              
              {/* Outer decorative golden corner accents */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#B38A38]/40" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#B38A38]/40" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#B38A38]/40" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#B38A38]/40" />

              {pdfAvailable ? (
                /* Live Embedded PDF Preview */
                <div className="w-full h-full rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E7E0D4]">
                  <iframe
                    src={`${siteConfig.cataloguePdfPath}#toolbar=0&navpanes=0`}
                    className="w-full h-full border-0"
                    title="Advaita Tattva Official Product Catalogue Preview"
                  />
                </div>
              ) : (
                /* Premium Branded Placeholder Frame */
                <div className="w-full h-full rounded-xl bg-gradient-to-b from-[#FAF8F5] via-[#F6F1EA] to-[#ECE5D8] border border-[#E7E0D4] flex flex-col justify-between p-6 sm:p-8 text-center relative overflow-hidden">
                  
                  {/* Subtle inner geometric ornament */}
                  <div className="absolute inset-4 border border-[#B38A38]/20 rounded-lg pointer-events-none" />

                  {/* Top Branding */}
                  <div className="space-y-1 z-10">
                    <p className="font-serif text-xs font-semibold tracking-[0.25em] uppercase text-[#785A1D]">
                      {siteConfig.companyName}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-[#A8A29E]">
                      {siteConfig.tagline}
                    </p>
                  </div>

                  {/* Center Emblem & Message */}
                  <div className="my-auto py-6 space-y-4 z-10 flex flex-col items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 border border-[#E7E0D4] flex items-center justify-center shadow-md">
                      <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-[#B38A38]" />
                    </div>

                    <div className="space-y-1.5 max-w-xs">
                      <span className="inline-block px-3 py-1 rounded-full bg-[#1C1917] text-[#C5A059] text-[10px] font-semibold tracking-widest uppercase">
                        Official Catalogue Coming Soon
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl font-medium text-[#1C1917]">
                        High-Resolution Brochure
                      </h3>
                      <p className="text-xs text-[#57534E] leading-relaxed">
                        Curated collection featuring Buddha and Hindu brass sculptures, verified weights, and certified dimensions.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Metadata Card */}
                  <div className="z-10 bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-[#E7E0D4] space-y-1">
                    <p className="text-[10px] font-mono text-[#785A1D] truncate">
                      advaita-tattva-catalogue.pdf
                    </p>
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
