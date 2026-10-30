"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/siteConfig";
import { WhatsAppIcon } from "./Icons";
import { Phone, Mail, FileText } from "lucide-react";

export function Footer() {
  const currentYear = 2026;

  const defaultWhatsAppText = encodeURIComponent(
    `Hello ${siteConfig.companyName}, I would like to enquire about your handcrafted brass catalogue.`
  );
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${defaultWhatsAppText}`;

  return (
    <footer className="w-full bg-[#F4EFEB] border-t border-[#E7E0D4] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          {/* Brand Info */}
          <div className="space-y-2">
            <Link href="/" className="inline-block">
              <span className="font-serif text-xl font-bold tracking-[0.16em] uppercase text-[#1C1917] hover:text-[#B38A38] transition-colors">
                {siteConfig.companyName}
              </span>
            </Link>
            <p className="text-xs text-[#44403C] max-w-sm">
              {siteConfig.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-6 text-xs uppercase font-medium tracking-wider text-[#44403C]">
            <Link href="/" className="hover:text-[#1C1917] transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-[#1C1917] transition-colors">
              About Us
            </Link>
            <a
              href={siteConfig.cataloguePdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#B38A38] transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#B38A38]" />
              <span>PDF Catalogue</span>
            </a>
          </nav>

          {/* Direct Communication Channels */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {siteConfig.adminPhone && (
              <a
                href={`tel:${siteConfig.adminPhone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-[#E7E0D4] text-[#1C1917] hover:border-[#B38A38] hover:text-[#B38A38] transition-colors"
                title="Call Studio"
              >
                <Phone className="w-3.5 h-3.5 text-[#B38A38]" />
                <span>{siteConfig.adminPhone}</span>
              </a>
            )}

            {siteConfig.adminEmail && (
              <a
                href={`mailto:${siteConfig.adminEmail}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-[#E7E0D4] text-[#1C1917] hover:border-[#B38A38] hover:text-[#B38A38] transition-colors"
                title="Email Studio"
              >
                <Mail className="w-3.5 h-3.5 text-[#B38A38]" />
                <span>{siteConfig.adminEmail}</span>
              </a>
            )}

            {/* WhatsApp Link with Official Brand Icon */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366] text-white font-medium hover:bg-[#20ba59] transition-all shadow-xs"
              title="Chat on WhatsApp"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[#E7E0D4]/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#785A1D]">
          <p>
            &copy; {currentYear} {siteConfig.companyName}. All rights reserved.
          </p>
          <p className="text-[#44403C]">
            Authentic lost-wax casting and traditional hand-chiseled bronze art.
          </p>
        </div>
      </div>
    </footer>
  );
}
