"use client";

import React, { useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/siteConfig";
import { ContactModal } from "./ContactModal";
import { FileText, FileDown, ArrowUpRight, Sparkles, Shield, ChevronDown } from "lucide-react";

export function Hero() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <section className="relative w-full overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32 bg-[#FAF8F5] border-b border-[#E7E0D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Editorial Headline & Actions (7 cols on lg) */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
              {/* Artisanal Heritage Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E7E0D4] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#B38A38]" />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#785A1D]">
                  {siteConfig.companyName}
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#1C1917] break-words uppercase">
                {siteConfig.tagline}
              </h1>

              {/* Supporting Description */}
              <p className="text-sm sm:text-base lg:text-lg text-[#44403C] font-light max-w-xl leading-relaxed">
                A timeless devotional accent for your home, puja space, or thoughtful gifting. Handcrafted solid antique brass idols — custom sizes are available on request.
              </p>

              {/* Two Primary Actions */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3.5">
                {/* 1. View PDF Catalogue (with direct download companion) */}
                <div className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start rounded-full bg-[#1C1917] text-white shadow-md hover:bg-[#292524] transition-all">
                  <a
                    href={siteConfig.cataloguePdfPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 text-xs font-semibold tracking-wider uppercase text-center"
                  >
                    <FileText className="w-4 h-4 text-[#C5A059]" />
                    <span>View PDF Catalogue</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                  </a>

                  <span className="w-px h-5 bg-white/20" />

                  <a
                    href={siteConfig.cataloguePdfPath}
                    download="Advaita-Tattva-Catalogue.pdf"
                    className="p-3.5 hover:text-[#C5A059] transition-colors"
                    title="Download PDF to device"
                    aria-label="Download PDF Catalogue"
                  >
                    <FileDown className="w-4 h-4" />
                  </a>
                </div>

                {/* 2. Contact Us */}
                <button
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-full border border-[#D8CCBD] bg-white text-xs font-semibold tracking-wider uppercase text-[#1C1917] hover:border-[#B38A38] hover:text-[#B38A38] hover:shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  Contact Us
                </button>
              </div>

              {/* Craftsmanship Reassurance */}
              <div className="pt-6 border-t border-[#E7E0D4] grid grid-cols-3 gap-2 sm:gap-4 max-w-lg text-[11px] sm:text-xs text-[#44403C]">
                <div>
                  <p className="font-serif font-bold text-[#1C1917] text-sm sm:text-base">100%</p>
                  <p className="text-[10px] sm:text-[11px] text-[#785A1D]">Solid Antique Brass</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-[#1C1917] text-sm sm:text-base">2 Categories</p>
                  <p className="text-[10px] sm:text-[11px] text-[#785A1D]">Buddha &amp; Hindu</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-[#1C1917] text-sm sm:text-base">Custom</p>
                  <p className="text-[10px] sm:text-[11px] text-[#785A1D]">Sizes on Request</p>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Product Imagery Arrangement from Brochure (5 cols on lg) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Primary Spotlight Card: Buddha under Bodhi Tree (Page 5) */}
                <div className="relative z-10 bg-white rounded-3xl p-6 sm:p-7 border border-[#E7E0D4] shadow-xl">
                  <div className="relative aspect-square w-full bg-[#FAF8F5] rounded-2xl overflow-hidden flex items-center justify-center p-4">
                    <Image
                      src="/products/buddha-bodhi-tree.jpg"
                      alt="Buddha under Bodhi Tree - Advaita Tattva Brochure"
                      width={600}
                      height={600}
                      priority
                      className="max-h-full max-w-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-700"
                    />

                    <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-[#E7E0D4] text-[10px] font-semibold tracking-wider uppercase text-[#785A1D]">
                      Solid Antique Brass &bull; 6″ to 12″
                    </span>
                  </div>

                  <div className="mt-5 flex items-start justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-[#B38A38]">
                        Featured Buddha Statue
                      </p>
                      <h3 className="font-serif text-xl font-medium text-[#1C1917] mt-0.5">
                        Buddha under Bodhi Tree
                      </h3>
                      <p className="text-xs text-[#785A1D]">
                        Antique Brass &bull; Up to 787 g
                      </p>
                    </div>

                    <a
                      href="#catalogue"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1C1917] hover:text-[#B38A38] transition-colors mt-2"
                    >
                      <span>Explore</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Secondary Layered Card: Lord Ganesha */}
                <div className="hidden sm:block absolute -bottom-8 -left-8 z-20 w-48 bg-white/95 backdrop-blur-sm rounded-2xl p-3 border border-[#E7E0D4] shadow-2xl">
                  <div className="relative aspect-square bg-[#FAF8F5] rounded-xl overflow-hidden p-2 flex items-center justify-center">
                    <Image
                      src="/products/lord-ganesha.jpg"
                      alt="Lord Ganesha - Solid Brass Statue"
                      width={200}
                      height={200}
                      className="max-h-full max-w-full object-contain drop-shadow-sm"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-[11px] font-serif font-medium text-[#1C1917] truncate">
                      Lord Ganesha
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-[#785A1D]">
                      Hindu Statue &bull; Antique Brass
                    </p>
                  </div>
                </div>

                {/* Floating Authentic Stamp */}
                <div className="hidden sm:flex absolute -top-4 -right-4 z-20 items-center gap-2 px-3.5 py-2 rounded-full bg-[#1C1917] text-white shadow-xl text-[10px] uppercase font-semibold tracking-widest">
                  <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Advaita Tattva Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reusable Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
}
