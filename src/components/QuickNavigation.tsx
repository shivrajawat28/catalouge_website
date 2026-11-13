"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Film, ArrowRight } from "lucide-react";

export function QuickNavigation() {
  const handleScrollToVideos = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("video-gallery");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (typeof window !== "undefined" && window.history?.pushState) {
        window.history.pushState(null, "", "#video-gallery");
      }
    }
  };

  return (
    <section
      aria-label="Quick Navigation"
      className="w-full bg-[#FAF8F5] border-b border-[#E7E0D4] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 relative z-10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card 1: Explore Products */}
          <Link
            href="/products"
            data-testid="quick-nav-products"
            className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-[#E7E0D4] hover:border-[#B38A38]/50 shadow-xs hover:shadow-[0_12px_28px_-8px_rgba(179,138,56,0.15),0_4px_12px_rgba(28,25,23,0.03)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#B38A38] focus:ring-offset-2 focus:ring-offset-[#FAF8F5]"
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E7E0D4] group-hover:border-[#B38A38]/40 group-hover:bg-[#F4EFEB] flex items-center justify-center text-[#B38A38] transition-colors shrink-0">
                  <Sparkles className="w-4 h-4 text-[#B38A38]" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#785A1D] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#E7E0D4]/80">
                  Collection
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1C1917] group-hover:text-[#785A1D] transition-colors leading-snug">
                Explore Products
              </h3>

              <p className="mt-1.5 text-xs sm:text-sm text-[#44403C] leading-relaxed">
                Discover our handcrafted brass collection.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F4EFEB] flex items-center justify-between text-xs sm:text-sm font-semibold tracking-wide text-[#785A1D] group-hover:text-[#B38A38] transition-colors">
              <span>Explore Collection</span>
              <span className="w-8 h-8 rounded-full bg-[#FAF8F5] group-hover:bg-[#B38A38] group-hover:text-white flex items-center justify-center text-[#785A1D] transition-all">
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>

          {/* Card 2: Watch Our Films */}
          <a
            href="#video-gallery"
            onClick={handleScrollToVideos}
            data-testid="quick-nav-films"
            className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-[#E7E0D4] hover:border-[#B38A38]/50 shadow-xs hover:shadow-[0_12px_28px_-8px_rgba(179,138,56,0.15),0_4px_12px_rgba(28,25,23,0.03)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#B38A38] focus:ring-offset-2 focus:ring-offset-[#FAF8F5]"
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E7E0D4] group-hover:border-[#B38A38]/40 group-hover:bg-[#F4EFEB] flex items-center justify-center text-[#B38A38] transition-colors shrink-0">
                  <Film className="w-4 h-4 text-[#B38A38]" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#785A1D] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#E7E0D4]/80">
                  Films
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1C1917] group-hover:text-[#785A1D] transition-colors leading-snug">
                Watch Our Films
              </h3>

              <p className="mt-1.5 text-xs sm:text-sm text-[#44403C] leading-relaxed">
                Experience our artistry in motion.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F4EFEB] flex items-center justify-between text-xs sm:text-sm font-semibold tracking-wide text-[#785A1D] group-hover:text-[#B38A38] transition-colors">
              <span>Watch Videos</span>
              <span className="w-8 h-8 rounded-full bg-[#FAF8F5] group-hover:bg-[#B38A38] group-hover:text-white flex items-center justify-center text-[#785A1D] transition-all">
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
