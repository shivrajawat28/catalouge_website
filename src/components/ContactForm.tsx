"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/siteConfig";
import { WhatsAppIcon } from "./Icons";
import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

interface FormState {
  fullName: string;
  phoneNumber: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  phoneNumber?: string;
  message?: string;
}

export function ContactForm({
  initialMessage = "",
}: {
  initialMessage?: string;
}) {
  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    phoneNumber: "",
    message: initialMessage || "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedStatus, setSubmittedStatus] = useState<boolean>(false);

  // Validation function
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name.";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters.";
    }

    // Validate Phone Number
    // Cleans digits and validates basic phone format (between 9 and 15 digits)
    const digitsOnly = formData.phoneNumber.replace(/\D/g, "");
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Please enter your contact phone number.";
    } else if (digitsOnly.length < 9 || digitsOnly.length > 15) {
      newErrors.phoneNumber = "Please enter a valid phone number (at least 9-10 digits).";
    }

    // Validate Message
    if (!formData.message.trim()) {
      newErrors.message = "Please describe the sculpture or enquiry details.";
    } else if (formData.message.trim().length < 5) {
      newErrors.message = "Message must be at least 5 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Construct the requested WhatsApp message format exactly as specified
    const textMessage = `Hello, I would like to enquire about your products.

Name: ${formData.fullName.trim()}
Phone: ${formData.phoneNumber.trim()}
Message: ${formData.message.trim()}

Please get in touch with me.`;

    const encodedText = encodeURIComponent(textMessage);
    // Use official wa.me format with digits-only phone number
    const cleanWhatsappNumber = siteConfig.whatsappNumber.replace(/\D/g, "");
    const waUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodedText}`;

    // Open WhatsApp in a new tab/window
    window.open(waUrl, "_blank", "noopener,noreferrer");

    // Indicate that WhatsApp has launched with the prepared message ready to review and send
    setSubmittedStatus(true);
  };

  return (
    <section
      id="enquiry-form"
      aria-labelledby="enquiry-heading"
      className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#F5F1EB] border-t border-[#E7E0D4]"
    >
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#B38A38]">
            Direct Artisanal Inquiries
          </span>
          <h2
            id="enquiry-heading"
            className="text-3xl sm:text-4xl font-serif font-medium text-[#1C1917] tracking-tight"
          >
            Enquire on WhatsApp
          </h2>
          <p className="text-sm sm:text-base text-[#44403C] max-w-xl mx-auto leading-relaxed">
            Have questions about a particular piece, custom dimensions, or sanctum installation? Submit your enquiry below to start a direct WhatsApp conversation with our studio curator.
          </p>
        </div>

        {/* Minimal Form Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E7E0D4] shadow-xs">
          {submittedStatus && (
            <div
              role="alert"
              className="mb-8 p-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-[#128C7E] shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-[#128C7E]">
                  WhatsApp Opened in New Window
                </p>
                <p className="text-[#1C1917] mt-0.5">
                  Your enquiry has been prepared. Review and send the prefilled message directly in your WhatsApp conversation.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedStatus(false)}
                  className="mt-2 text-xs text-[#785A1D] hover:underline font-medium"
                >
                  Edit enquiry details
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-2"
              >
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                }}
                placeholder="e.g. Rameshwar Sharma"
                className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1C1917] placeholder:text-[#8C827A] bg-[#FAF8F5] focus:bg-white focus:outline-none transition-colors ${
                  errors.fullName
                    ? "border-red-400 focus:ring-2 focus:ring-red-400/30"
                    : "border-[#D8CCBD] focus:border-[#B38A38] focus:ring-2 focus:ring-[#B38A38]/20"
                }`}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
                required
              />
              {errors.fullName && (
                <p
                  id="fullName-error"
                  className="mt-1.5 text-xs text-red-600 flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-2"
              >
                Phone Number (with Country Code) <span className="text-red-600">*</span>
              </label>
              <input
                id="phoneNumber"
                type="tel"
                autoComplete="tel"
                value={formData.phoneNumber}
                onChange={(e) => {
                  setFormData({ ...formData, phoneNumber: e.target.value });
                  if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: undefined });
                }}
                placeholder="e.g. +91 98765 43210 or 9876543210"
                className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1C1917] placeholder:text-[#8C827A] bg-[#FAF8F5] focus:bg-white focus:outline-none transition-colors ${
                  errors.phoneNumber
                    ? "border-red-400 focus:ring-2 focus:ring-red-400/30"
                    : "border-[#D8CCBD] focus:border-[#B38A38] focus:ring-2 focus:ring-[#B38A38]/20"
                }`}
                aria-invalid={!!errors.phoneNumber}
                aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
                required
              />
              {errors.phoneNumber && (
                <p
                  id="phoneNumber-error"
                  className="mt-1.5 text-xs text-red-600 flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.phoneNumber}</span>
                </p>
              )}
            </div>

            {/* Message Area */}
            <div>
              <label
                htmlFor="message"
                className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-2"
              >
                Enquiry Details <span className="text-red-600">*</span>
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (errors.message) setErrors({ ...errors, message: undefined });
                }}
                placeholder="Please mention the sculpture name, dimensions, or specific questions..."
                className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1C1917] placeholder:text-[#8C827A] bg-[#FAF8F5] focus:bg-white focus:outline-none transition-colors resize-y ${
                  errors.message
                    ? "border-red-400 focus:ring-2 focus:ring-red-400/30"
                    : "border-[#D8CCBD] focus:border-[#B38A38] focus:ring-2 focus:ring-[#B38A38]/20"
                }`}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                required
              />
              {errors.message && (
                <p
                  id="message-error"
                  className="mt-1.5 text-xs text-red-600 flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.message}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#25D366] text-white font-medium text-sm sm:text-base hover:bg-[#20ba59] active:scale-[0.99] transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white shrink-0" />
                <span className="font-semibold tracking-wide">
                  Send Enquiry on WhatsApp
                </span>
              </button>
            </div>

            {/* Privacy / Direct Note */}
            <div className="flex items-center justify-center gap-2 text-xs text-[#785A1D] pt-2 text-center">
              <ShieldCheck className="w-4 h-4 text-[#B38A38]" />
              <span>
                Your privacy is respected. No data is stored or forwarded to third parties.
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
