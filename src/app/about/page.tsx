"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/siteConfig";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsAppButton } from "@/components/WhatsAppButton";
import { ContactModal } from "@/components/ContactModal";
import { WhatsAppBrandButton } from "@/components/Icons";
import { Sparkles, Hammer, ShieldCheck, Flame, Compass, FileText, ArrowUpRight, ArrowLeft } from "lucide-react";

export default function AboutPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const pillarIcons = [
    <Flame key="flame" className="w-5 h-5 text-[#B38A38]" />,
    <ShieldCheck key="shield" className="w-5 h-5 text-[#B38A38]" />,
    <Hammer key="hammer" className="w-5 h-5 text-[#B38A38]" />,
    <Compass key="compass" className="w-5 h-5 text-[#B38A38]" />,
  ];

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#FAF8F5]">
        {/* Editorial Page Header */}
        <section className="pt-16 pb-14 sm:pt-20 sm:pb-20 border-b border-[#E7E0D4] bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#785A1D] hover:text-[#1C1917] transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Catalogue</span>
            </Link>

            <span className="block text-xs font-semibold tracking-[0.25em] uppercase text-[#B38A38]">
              Advaita Tattva &bull; Antique Brass Idols
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-[#1C1917] tracking-tight">
              About Us
            </h1>

            <p className="text-base sm:text-lg text-[#44403C] max-w-2xl mx-auto leading-relaxed font-light">
              {siteConfig.aboutContent.subheading}
            </p>
          </div>
        </section>

        {/* Narrative & Imagery Section */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Story Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-[#44403C] text-sm sm:text-base leading-relaxed">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F1EB] border border-[#E7E0D4] text-xs font-medium text-[#785A1D]">
                <Sparkles className="w-3.5 h-3.5 text-[#B38A38]" />
                <span>Our Heritage</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1C1917] leading-snug">
                {siteConfig.aboutContent.heading}
              </h2>

              <p className="text-[#1C1917] font-medium text-base sm:text-lg leading-relaxed">
                {siteConfig.aboutContent.leadParagraph}
              </p>

              <div className="space-y-4 pt-2 text-[#44403C]">
                <p>
                  {siteConfig.aboutContent.craftPhilosophy}
                </p>
                <p>
                  {siteConfig.aboutContent.foundryHeritage}
                </p>
                <p>
                  {siteConfig.aboutContent.qualityCommitment}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-[#1C1917] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#292524] transition-all cursor-pointer shadow-sm"
                >
                  Contact Us
                </button>

                <a
                  href={siteConfig.cataloguePdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-[#D8CCBD] bg-white text-xs font-semibold tracking-wider uppercase text-[#1C1917] hover:border-[#B38A38] hover:text-[#B38A38] transition-colors shadow-2xs"
                >
                  <FileText className="w-4 h-4 text-[#B38A38]" />
                  <span>View PDF Brochure</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </a>
              </div>
            </div>

            {/* Visual Showcase (5 cols) using Brochure Images */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative bg-white rounded-3xl p-6 border border-[#E7E0D4] shadow-lg overflow-hidden">
                <div className="relative aspect-square w-full bg-[#FAF8F5] rounded-2xl flex items-center justify-center p-4">
                  <Image
                    src="/products/lord-ganesha.jpg"
                    alt="Lord Ganesha antique brass sculpture from Advaita Tattva brochure"
                    width={500}
                    height={500}
                    className="max-h-full max-w-full object-contain drop-shadow-md"
                  />
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/95 border border-[#E7E0D4] text-[10px] font-semibold tracking-wider uppercase text-[#785A1D]">
                    Hindu Statues &bull; Devotional Art
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-serif text-lg font-medium text-[#1C1917]">
                    Advaita Tattva Antique Brass Collection
                  </h3>
                  <p className="text-xs text-[#44403C] mt-1 leading-relaxed">
                    A timeless devotional accent for your home, puja space, or thoughtful gifting. Solid cast metal with warm antique patina.
                  </p>
                </div>
              </div>

              {/* Secondary Duo Photo Bar */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-[#E7E0D4] flex flex-col items-center">
                  <div className="w-full aspect-square relative flex items-center justify-center bg-[#FAF8F5] rounded-xl p-2">
                    <Image
                      src="/products/seated-buddha.jpg"
                      alt="Seated Buddha sculpture"
                      width={200}
                      height={200}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <p className="text-[11px] font-serif font-medium text-[#1C1917] mt-2 text-center">
                    Seated Buddha
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-[#E7E0D4] flex flex-col items-center">
                  <div className="w-full aspect-square relative flex items-center justify-center bg-[#FAF8F5] rounded-xl p-2">
                    <Image
                      src="/products/maa-lakshmi.jpg"
                      alt="Maa Lakshmi sculpture"
                      width={200}
                      height={200}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <p className="text-[11px] font-serif font-medium text-[#1C1917] mt-2 text-center">
                    Maa Lakshmi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Four Core Pillars */}
        <section className="py-16 sm:py-20 bg-[#F5F1EB] border-t border-[#E7E0D4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#B38A38]">
                Foundry Commitments
              </span>
              <h2 className="text-3xl font-serif font-medium text-[#1C1917]">
                Principles of Our Metalcraft
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {siteConfig.aboutContent.pillars.map((pillar, idx) => (
                <div
                  key={pillar.title}
                  className="bg-white rounded-2xl p-6 border border-[#E7E0D4] shadow-2xs space-y-3"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E7E0D4] flex items-center justify-center">
                    {pillarIcons[idx % pillarIcons.length]}
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#1C1917]">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#44403C] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Direct Studio Contact Banner */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#B38A38]">
            Curatorial Consultations
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#1C1917]">
            Enquire for Custom Sizes &amp; Idols
          </h2>
          <p className="text-sm sm:text-base text-[#44403C] max-w-xl mx-auto leading-relaxed">
            Looking for a different size or custom finish? Custom sizes for both Buddha and Hindu statues are available upon direct request.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <WhatsAppBrandButton
              phone={siteConfig.whatsappNumber}
              text={`Hello ${siteConfig.companyName}, I would like to enquire about custom sizes for your Advaita Tattva antique brass statues.`}
              label="Discuss on WhatsApp"
            />
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[#D8CCBD] bg-white text-xs font-semibold tracking-wider uppercase text-[#1C1917] hover:border-[#B38A38] hover:text-[#B38A38] transition-all cursor-pointer shadow-2xs"
            >
              View Contact Details
            </button>
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
