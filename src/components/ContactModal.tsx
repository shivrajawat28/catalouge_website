"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/siteConfig";
import { WhatsAppIcon } from "./Icons";
import { X, Phone, Mail, Clock, ExternalLink, ArrowRight } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Handle ESC and native cancel event
  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  // Close when clicking directly on the backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const defaultWhatsAppText = encodeURIComponent(
    `Hello ${siteConfig.companyName}, I would like to get in touch regarding your handcrafted brass catalogue.`
  );
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${defaultWhatsAppText}`;

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 m-auto z-50 p-0 max-w-lg w-[calc(100%-2rem)] rounded-2xl bg-[#FAF8F5] border border-[#E7E0D4] shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-xs open:animate-fade-in focus:outline-none"
    >
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-[#E7E0D4]">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#B38A38]">
              Direct Studio Desk
            </span>
            <h2
              id="contact-modal-title"
              className="text-2xl font-serif font-medium text-[#1C1917] mt-1"
            >
              Get in Touch
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[#44403C] hover:text-[#1C1917] hover:bg-[#EAE3D7] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B38A38]"
            aria-label="Close contact details modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm text-[#44403C] mt-4 leading-relaxed">
          Connect directly with our curatorial desk for catalogue questions, custom commissions, or worldwide insured shipping enquiries.
        </p>

        {/* Contact Actions Grid */}
        <div className="mt-6 space-y-3">
          {/* WhatsApp Direct Action */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/15 hover:border-[#25D366]/50 transition-all text-[#1C1917]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                <WhatsAppIcon className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-xs uppercase font-semibold tracking-wider text-[#128C7E]">
                  Official WhatsApp
                </p>
                <p className="text-sm font-medium text-[#1C1917]">
                  Instant Chat with Curator
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#128C7E] group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Admin Phone */}
          <a
            href={`tel:${siteConfig.adminPhone.replace(/\s+/g, "")}`}
            className="group flex items-center justify-between p-4 rounded-xl bg-white border border-[#E7E0D4] hover:border-[#B38A38] hover:bg-white/80 transition-all text-[#1C1917]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F5F1EB] text-[#B38A38] flex items-center justify-center shrink-0 border border-[#E7E0D4]">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs uppercase font-semibold tracking-wider text-[#785A1D]">
                  Telephone Desk
                </p>
                <p className="text-sm font-medium text-[#1C1917]">
                  {siteConfig.adminPhone}
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-[#785A1D] opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>

          {/* Admin Email */}
          <a
            href={`mailto:${siteConfig.adminEmail}`}
            className="group flex items-center justify-between p-4 rounded-xl bg-white border border-[#E7E0D4] hover:border-[#B38A38] hover:bg-white/80 transition-all text-[#1C1917]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F5F1EB] text-[#B38A38] flex items-center justify-center shrink-0 border border-[#E7E0D4]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs uppercase font-semibold tracking-wider text-[#785A1D]">
                  Curatorial Email
                </p>
                <p className="text-sm font-medium text-[#1C1917] break-all">
                  {siteConfig.adminEmail}
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-[#785A1D] opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

        {/* Studio Hours */}
        <div className="mt-6 pt-5 border-t border-[#E7E0D4] space-y-2.5 text-xs text-[#44403C]">
          {siteConfig.businessHours && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#B38A38] shrink-0" />
              <span>
                <strong>Studio Hours:</strong> {siteConfig.businessHours}
              </span>
            </div>
          )}
        </div>

        {/* Quick Link to Home Enquiry Form */}
        <div className="mt-6 pt-4 border-t border-[#E7E0D4] text-center">
          <button
            type="button"
            onClick={() => {
              onClose();
              const formEl = document.getElementById("enquiry-form");
              if (formEl) {
                formEl.scrollIntoView({ behavior: "smooth" });
              } else {
                router.push("/#enquiry-form");
              }
            }}
            className="text-xs text-[#785A1D] hover:text-[#1C1917] underline underline-offset-4 font-medium transition-colors cursor-pointer"
          >
            Or fill out the direct enquiry form on the page &darr;
          </button>
        </div>
      </div>
    </dialog>
  );
}
