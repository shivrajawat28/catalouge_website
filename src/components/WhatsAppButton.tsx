"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/siteConfig";
import { WhatsAppIcon } from "./Icons";

export function FloatingWhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  const defaultMessage = encodeURIComponent(
    `Hello ${siteConfig.companyName}, I would like to enquire about your handcrafted brass catalogue.`
  );
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${defaultMessage}`;

  return (
    <aside
      aria-label="WhatsApp quick chat"
      className="fixed bottom-6 right-6 z-40 flex items-center group"
    >
      {/* Accessible Tooltip */}
      <span
        role="tooltip"
        className={`hidden sm:inline-block absolute right-16 mr-3 px-3.5 py-1.5 rounded-full bg-[#1C1917] text-white text-xs font-medium tracking-wide shadow-lg whitespace-nowrap transition-all duration-200 pointer-events-none ${
          showTooltip ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
        }`}
      >
        Chat on WhatsApp
      </span>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${siteConfig.companyName} on WhatsApp`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-[#20ba59] hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        <WhatsAppIcon className="w-7 h-7 fill-white drop-shadow-xs" />
      </a>
    </aside>
  );
}
