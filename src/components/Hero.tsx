"use client";

import React, { useState, useRef, useEffect } from "react";
import { siteConfig } from "@/config/siteConfig";
import { ContactModal } from "./ContactModal";
import { FileText, FileDown, ArrowUpRight, Sparkles, Play } from "lucide-react";

export function Hero() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Enforce muted properties prior to playback for reliable cross-browser autoplay
    video.defaultMuted = true;
    video.muted = true;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      video.autoplay = false;
      video.pause();
    }

    const attemptAutoplay = async () => {
      await Promise.resolve();
      if (prefersReducedMotion) {
        video.autoplay = false;
        if (!video.paused) {
          video.pause();
        }
        setAutoplayBlocked(true);
        return;
      }

      try {
        if (video.paused) {
          await video.play();
        }
        setAutoplayBlocked(false);
      } catch {
        setAutoplayBlocked(true);
      }
    };

    attemptAutoplay();
  }, []);

  const handleManualPlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      video.muted = true;
      await video.play();
      setAutoplayBlocked(false);
    } catch {
      setAutoplayBlocked(true);
    }
  };

  return (
    <>
      <section className="relative w-full overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24 lg:pt-16 lg:pb-24 bg-[#FAF8F5] border-b border-[#E7E0D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-8 items-center">
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

            {/* Right Column: Vertical 9:16 Smartphone-Sized Video Showcase (5 cols on lg) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div
                id="hero-video-frame"
                className="relative w-[220px] sm:w-[245px] md:w-[255px] lg:w-[275px] xl:w-[290px] aspect-[9/16] rounded-[2rem] p-1.5 bg-[#1C1917] ring-1 ring-[#B38A38]/35 shadow-md"
              >
                <div className="relative w-full h-full rounded-[1.625rem] overflow-hidden bg-[#1C1917]">
                  <video
                    ref={videoRef}
                    src="/videos/advaita-tattva-hero.mp4"
                    poster="/videos/advaita-tattva-hero-poster.jpg"
                    width={1080}
                    height={1920}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    disablePictureInPicture
                    onPlay={() => setAutoplayBlocked(false)}
                    className="w-full h-full object-cover block"
                    aria-label="Advaita Tattva antique brass idol craftsmanship showcase"
                  />

                  {/* Subtle fallback play button shown only if browser autoplay is restricted */}
                  {autoplayBlocked && (
                    <button
                      type="button"
                      onClick={handleManualPlay}
                      aria-label="Play showcase video"
                      className="absolute inset-0 flex items-center justify-center bg-[#1C1917]/30 backdrop-blur-[2px] transition-opacity hover:bg-[#1C1917]/40 cursor-pointer"
                    >
                      <span className="w-12 h-12 rounded-full bg-[#FAF8F5]/90 text-[#1C1917] border border-[#B38A38]/50 flex items-center justify-center shadow-sm">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </span>
                    </button>
                  )}
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
