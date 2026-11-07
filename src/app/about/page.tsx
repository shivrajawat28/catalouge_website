"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/siteConfig";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsAppButton } from "@/components/WhatsAppButton";
import { ContactModal } from "@/components/ContactModal";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Flame,
  Mail,
} from "lucide-react";

export default function AboutPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { aboutContent } = siteConfig;

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#FAF8F5] text-[#1C1917]">
        {/* ============================================================ */}
        {/* SECTION A — EDITORIAL HERO                                   */}
        {/* ============================================================ */}
        <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#E7E0D4] bg-gradient-to-b from-white to-[#FAF8F5] overflow-hidden">
          {/* Subtle background texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#E8DFC8_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back link */}
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#785A1D] hover:text-[#1C1917] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Catalogue</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Hero Text */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F1EB] border border-[#E7E0D4] text-[11px] font-semibold tracking-[0.25em] uppercase text-[#785A1D]">
                  <Sparkles className="w-3.5 h-3.5 text-[#B38A38]" />
                  <span>{aboutContent.hero.eyebrow}</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-[#1C1917] tracking-tight leading-[1.12]">
                    {aboutContent.hero.brandName}
                  </h1>
                  <div className="w-20 h-0.5 bg-[#B38A38]" />
                </div>

                <p className="font-serif text-xl sm:text-2xl text-[#785A1D] leading-snug font-normal max-w-2xl">
                  {aboutContent.hero.tagline}
                </p>

                <p className="text-sm sm:text-base text-[#44403C] leading-relaxed max-w-xl font-light">
                  Rooted in the timeless wisdom of ancient India, our creations reflect a dedication to artistic depth, sacred iconography, and authentic lost-wax metal craftsmanship.
                </p>
              </div>

              {/* Hero Visual: Authentic Brass Sculpture Showcase */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md bg-white rounded-3xl p-6 border border-[#E7E0D4] shadow-xl">
                  <div className="relative aspect-square w-full bg-[#FAF8F5] rounded-2xl flex items-center justify-center p-6 overflow-hidden border border-[#F0EAE1]">
                    <Image
                      src="/products/buddha-bodhi-tree.jpg"
                      alt="Buddha under Bodhi Tree - Advaita Tattva authentic antique brass sculpture"
                      width={500}
                      height={500}
                      priority
                      className="max-h-full max-w-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-[#E7E0D4] text-[10px] font-semibold tracking-wider uppercase text-[#785A1D]">
                      Spiritual Art &bull; Solid Brass
                    </span>
                  </div>

                  <div className="mt-4 text-center space-y-1">
                    <p className="font-serif text-base font-medium text-[#1C1917]">
                      Authentic Indian Metalcraft
                    </p>
                    <p className="text-xs text-[#785A1D] italic">
                      Sculpted with devotion, cast in antique brass
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION B — OUR PHILOSOPHY                                   */}
        {/* ============================================================ */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#B38A38]">
              Foundational Belief
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#1C1917] tracking-tight">
              {aboutContent.philosophy.heading}
            </h2>
            <div className="w-12 h-0.5 bg-[#B38A38]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-[#44403C] text-base leading-relaxed">
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E0D4] shadow-xs space-y-4">
                <p className="font-serif text-lg text-[#1C1917] font-medium leading-snug">
                  {aboutContent.philosophy.paragraphs[0]}
                </p>
                <p className="text-sm sm:text-base leading-relaxed">
                  {aboutContent.philosophy.paragraphs[1]}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E0D4] shadow-xs space-y-4">
                <p className="text-sm sm:text-base leading-relaxed">
                  {aboutContent.philosophy.paragraphs[2]}
                </p>
                <p className="text-sm sm:text-base leading-relaxed text-[#1C1917] font-medium pt-2 border-t border-[#F0EAE1]">
                  {aboutContent.philosophy.paragraphs[3]}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION C — THE MEANING BEHIND OUR NAME                      */}
        {/* ============================================================ */}
        <section className="py-16 sm:py-24 bg-[#F5F1EB] border-y border-[#E7E0D4] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#B38A38]">
                Identity &amp; Etymology
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#1C1917] tracking-tight">
                {aboutContent.nameMeaning.heading}
              </h2>
              <div className="w-16 h-0.5 bg-[#B38A38] mx-auto" />
              <p className="text-sm sm:text-base text-[#44403C] leading-relaxed pt-2">
                {aboutContent.nameMeaning.intro}
              </p>
            </div>

            {/* Two Pillars: ADVAITA and TATTVA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {/* Card 1: ADVAITA */}
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E7E0D4] shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-28 h-28 bg-[#FAF8F5] rounded-bl-full border-b border-l border-[#E7E0D4]/60 -z-0" />
                <div className="space-y-4 z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E7E0D4] text-[11px] font-mono text-[#785A1D] tracking-wider uppercase">
                    Non-Duality &bull; Sanskrit
                  </div>
                  <h3 className="font-serif text-3xl sm:text-4xl font-medium tracking-wide text-[#1C1917]">
                    {aboutContent.nameMeaning.advaita.term}
                  </h3>
                  <p className="text-xs uppercase tracking-widest font-semibold text-[#B38A38]">
                    {aboutContent.nameMeaning.advaita.concept}
                  </p>
                  <p className="text-sm sm:text-base text-[#44403C] leading-relaxed pt-2">
                    {aboutContent.nameMeaning.advaita.description}
                  </p>
                </div>
              </div>

              {/* Card 2: TATTVA */}
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E7E0D4] shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-28 h-28 bg-[#FAF8F5] rounded-bl-full border-b border-l border-[#E7E0D4]/60 -z-0" />
                <div className="space-y-4 z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E7E0D4] text-[11px] font-mono text-[#785A1D] tracking-wider uppercase">
                    Essence &bull; Sanskrit
                  </div>
                  <h3 className="font-serif text-3xl sm:text-4xl font-medium tracking-wide text-[#1C1917]">
                    {aboutContent.nameMeaning.tattva.term}
                  </h3>
                  <p className="text-xs uppercase tracking-widest font-semibold text-[#B38A38]">
                    {aboutContent.nameMeaning.tattva.concept}
                  </p>
                  <p className="text-sm sm:text-base text-[#44403C] leading-relaxed pt-2">
                    {aboutContent.nameMeaning.tattva.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Central Composition: ADVAITA + TATTVA */}
            <div className="mt-12 bg-white rounded-3xl p-8 sm:p-12 border border-[#E7E0D4] shadow-md text-center max-w-4xl mx-auto space-y-6 relative overflow-hidden">
              <div className="inline-flex items-center justify-center gap-3 px-5 py-2 rounded-full bg-[#FAF8F5] border border-[#E7E0D4]">
                <span className="font-serif text-sm sm:text-base font-semibold tracking-[0.2em] uppercase text-[#1C1917]">
                  ADVAITA
                </span>
                <span className="text-[#B38A38] text-lg font-light">+</span>
                <span className="font-serif text-sm sm:text-base font-semibold tracking-[0.2em] uppercase text-[#1C1917]">
                  TATTVA
                </span>
              </div>

              <div className="space-y-4 max-w-2xl mx-auto">
                <p className="font-serif text-lg sm:text-xl text-[#1C1917] leading-relaxed font-medium">
                  {aboutContent.nameMeaning.synthesis}
                </p>
                <div className="w-12 h-0.5 bg-[#B38A38] mx-auto" />
                <p className="text-sm sm:text-base text-[#44403C] leading-relaxed italic">
                  {aboutContent.nameMeaning.conclusion}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION D — OUR JOURNEY: ROOTED IN INDIAN CRAFTSMANSHIP      */}
        {/* ============================================================ */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#B38A38]">
                  Evolution &amp; Heritage
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#1C1917] tracking-tight leading-snug">
                  {aboutContent.journey.heading}
                </h2>
                <div className="w-16 h-0.5 bg-[#B38A38]" />
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#44403C] leading-relaxed">
                <p>{aboutContent.journey.paragraphs[0]}</p>
                <p>{aboutContent.journey.paragraphs[1]}</p>
                <p className="font-medium text-[#1C1917]">
                  {aboutContent.journey.paragraphs[2]}
                </p>
              </div>

              {/* Lost-Wax Casting Technical Emphasis */}
              <div className="p-6 rounded-2xl bg-white border border-[#B38A38]/30 shadow-xs space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E7E0D4] flex items-center justify-center">
                    <Flame className="w-4 h-4 text-[#B38A38]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-semibold text-[#1C1917] uppercase tracking-wider">
                      Traditional Lost-Wax Casting (Madhuchishtavidhana)
                    </h3>
                    <p className="text-[11px] text-[#785A1D]">
                      Refined finishing &bull; Intricate detailing &bull; Structural precision
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed pt-1">
                  {aboutContent.journey.lostWaxHighlight}
                </p>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#44403C] leading-relaxed pt-2">
                <p>{aboutContent.journey.paragraphs[4]}</p>
                <p className="font-medium text-[#1C1917]">
                  {aboutContent.journey.paragraphs[5]}
                </p>
              </div>
            </div>

            {/* Right Visual: Authentic Lost-Wax Cast Sculpture */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full bg-white rounded-3xl p-6 border border-[#E7E0D4] shadow-lg">
                <div className="relative aspect-square w-full bg-[#FAF8F5] rounded-2xl flex items-center justify-center p-6 overflow-hidden border border-[#F0EAE1]">
                  <Image
                    src="/products/lord-ganesha.jpg"
                    alt="Lord Ganesha handcrafted solid brass idol from Advaita Tattva catalogue"
                    width={500}
                    height={500}
                    className="max-h-full max-w-full object-contain drop-shadow-md"
                  />
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/95 border border-[#E7E0D4] text-[10px] font-semibold tracking-wider uppercase text-[#785A1D]">
                    Lost-Wax Cast &bull; Fine Chiseled Brass
                  </span>
                </div>
                <div className="mt-4 text-center">
                  <p className="font-serif text-sm font-medium text-[#1C1917]">
                    Master Artisan Casting
                  </p>
                  <p className="text-xs text-[#785A1D]">
                    Generations of artistic knowledge, patience, and creativity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION E — OUR APPROACH: TRADITION MEETS MODERN LIVING      */}
        {/* ============================================================ */}
        <section className="py-16 sm:py-24 bg-[#F5F1EB] border-t border-[#E7E0D4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12 space-y-3">
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#B38A38]">
                Living Tradition
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#1C1917] tracking-tight leading-snug">
                {aboutContent.approach.heading}
              </h2>
              <div className="w-16 h-0.5 bg-[#B38A38]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Core Text Narrative */}
              <div className="lg:col-span-8 space-y-6 text-[#44403C] text-sm sm:text-base leading-relaxed">
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E7E0D4] shadow-xs space-y-5">
                  <p className="font-serif text-lg text-[#1C1917] font-medium leading-relaxed">
                    {aboutContent.approach.paragraphs[0]}
                  </p>
                  <p>{aboutContent.approach.paragraphs[1]}</p>
                  <p>{aboutContent.approach.paragraphs[2]}</p>
                  <p>{aboutContent.approach.paragraphs[3]}</p>
                  <p className="font-medium text-[#1C1917] pt-3 border-t border-[#F0EAE1]">
                    {aboutContent.approach.paragraphs[4]}
                  </p>
                </div>
              </div>

              {/* Supporting Secondary Idol View */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-3xl p-5 border border-[#E7E0D4] shadow-sm flex flex-col items-center">
                  <div className="w-full aspect-square relative flex items-center justify-center bg-[#FAF8F5] rounded-2xl p-4 border border-[#F0EAE1]">
                    <Image
                      src="/products/seated-buddha.jpg"
                      alt="Seated Buddha brass idol"
                      width={300}
                      height={300}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <p className="font-serif text-sm font-medium text-[#1C1917] mt-3">
                    Timeless Elegance
                  </p>
                  <p className="text-xs text-[#785A1D] text-center">
                    Designed for modern sanctuaries and personal spaces
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION F — CLOSING CTA                                      */}
        {/* ============================================================ */}
        <section className="py-20 sm:py-28 bg-white border-t border-[#E7E0D4] text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#B38A38]">
              Sanctuary &bull; Devotion &bull; Craft
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#1C1917] tracking-tight">
              {aboutContent.closingCta.heading}
            </h2>

            <p className="text-base sm:text-lg text-[#44403C] max-w-2xl mx-auto leading-relaxed font-light">
              {aboutContent.closingCta.supportingText}
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/#catalogue"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#1C1917] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#292524] transition-all shadow-md group cursor-pointer"
              >
                <span>Explore Our Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-[#D8CCBD] bg-[#FAF8F5] text-[#1C1917] text-xs font-semibold tracking-wider uppercase hover:border-[#B38A38] hover:text-[#B38A38] transition-all shadow-2xs cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#B38A38]" />
                <span>Contact Us</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsAppButton />

      {/* Reusable Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
}
