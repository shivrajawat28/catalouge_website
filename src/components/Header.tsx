"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/config/siteConfig";
import { ContactModal } from "./ContactModal";
import { FileDown, FileText, Menu, X, ArrowUpRight, MoreVertical, Sparkles } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const buddhaCount = siteConfig.products.filter((p) => p.category === "buddha").length;
  const hinduCount = siteConfig.products.filter((p) => p.category === "hindu").length;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const inDesktop = desktopMenuRef.current?.contains(target);
      const inMobile = mobileMenuRef.current?.contains(target);
      if (!inDesktop && !inMobile) {
        setCategoryMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCategoryMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectCategory = (cat: "buddha" | "hindu" | "all") => {
    setCategoryMenuOpen(false);
    setMobileMenuOpen(false);

    if (pathname === "/") {
      // Dispatch custom event for immediate responsive update
      window.dispatchEvent(new CustomEvent("select-catalogue-category", { detail: cat }));
      const catalogueEl = document.getElementById("catalogue");
      if (catalogueEl) {
        catalogueEl.scrollIntoView({ behavior: "smooth" });
      }
      window.history.pushState({}, "", `/?category=${cat}#catalogue`);
    } else {
      router.push(`/?category=${cat}#catalogue`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E0D4] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo / Configurable Placeholder */}
          <Link
            href="/"
            className="flex flex-col group focus:outline-none focus:ring-2 focus:ring-[#B38A38] rounded-sm py-1"
          >
            <span className="font-serif text-lg sm:text-2xl font-bold tracking-[0.14em] sm:tracking-[0.18em] uppercase text-[#1C1917] group-hover:text-[#B38A38] transition-colors">
              {siteConfig.companyName}
            </span>
            <span className="text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#785A1D] font-medium">
              {siteConfig.tagline}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <Link
              href="/"
              className={`transition-colors py-1 relative ${
                pathname === "/"
                  ? "text-[#1C1917] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#B38A38]"
                  : "text-[#44403C] hover:text-[#1C1917]"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`transition-colors py-1 relative ${
                pathname === "/about"
                  ? "text-[#1C1917] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#B38A38]"
                  : "text-[#44403C] hover:text-[#1C1917]"
              }`}
            >
              About Us
            </Link>

            {/* Three-Dot Category Menu Dropdown */}
            <div className="relative" ref={desktopMenuRef}>
              <button
                type="button"
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                aria-expanded={categoryMenuOpen}
                aria-haspopup="true"
                aria-label="Statue Categories Menu"
                className={`p-2 rounded-full border transition-all duration-200 cursor-pointer flex items-center justify-center ${
                  categoryMenuOpen
                    ? "bg-[#1C1917] text-white border-[#1C1917] shadow-sm"
                    : "bg-white text-[#1C1917] border-[#D8CCBD] hover:border-[#B38A38] hover:text-[#B38A38]"
                }`}
                title="Browse Statue Categories"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown Popover */}
              {categoryMenuOpen && (
                <div
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute left-0 mt-2.5 w-64 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D4] shadow-2xl p-2 z-50 animate-fade-in"
                >
                  <div className="px-3 py-2 border-b border-[#E7E0D4]/70 mb-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#B38A38]">
                      Statue Categories
                    </p>
                    <p className="text-[11px] text-[#44403C]">
                      Select category to filter catalogue
                    </p>
                  </div>

                  {/* Buddha Statues Option */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleSelectCategory("buddha")}
                    className="w-full text-left p-3 rounded-xl hover:bg-white hover:border-[#E7E0D4] border border-transparent transition-all group flex items-start gap-3 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E7E0D4] group-hover:border-[#B38A38] text-[#B38A38] flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-serif font-medium text-[#1C1917] group-hover:text-[#B38A38] transition-colors">
                        Buddha Statues
                      </p>
                      <p className="text-[11px] text-[#785A1D]">
                        {buddhaCount} authentic pieces
                      </p>
                    </div>
                  </button>

                  {/* Hindu Statues Option */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleSelectCategory("hindu")}
                    className="w-full text-left p-3 rounded-xl hover:bg-white hover:border-[#E7E0D4] border border-transparent transition-all group flex items-start gap-3 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E7E0D4] group-hover:border-[#B38A38] text-[#B38A38] flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-serif font-medium text-[#1C1917] group-hover:text-[#B38A38] transition-colors">
                        Hindu Statues
                      </p>
                      <p className="text-[11px] text-[#785A1D]">
                        {hinduCount} devotional deity idols
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* PDF Catalogue View Button */}
            <div className="relative group inline-flex items-center">
              <a
                href={siteConfig.cataloguePdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#D8CCBD] bg-white text-xs font-semibold tracking-wider uppercase text-[#1C1917] hover:border-[#B38A38] hover:text-[#B38A38] transition-all shadow-xs"
                title="View complete PDF Catalogue"
              >
                <FileText className="w-3.5 h-3.5 text-[#B38A38]" />
                <span>PDF Catalogue</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>

              {/* Direct Download Icon Button */}
              <a
                href={siteConfig.cataloguePdfPath}
                download="Advaita-Tattva-Brass-Brochure.pdf"
                className="ml-1 p-2 rounded-full border border-[#D8CCBD] bg-white text-[#44403C] hover:text-[#B38A38] hover:border-[#B38A38] transition-all shadow-xs"
                title="Direct Download PDF Catalogue"
                aria-label="Download PDF Catalogue"
              >
                <FileDown className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Contact Us Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#1C1917] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#292524] hover:shadow-md transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#B38A38] cursor-pointer"
            >
              Contact Us
            </button>
          </div>

          {/* Mobile Actions: Three-dot quick toggle + PDF + Hamburger */}
          <div className="flex md:hidden items-center gap-1.5">
            {/* Mobile Three-dot Menu */}
            <div className="relative" ref={mobileMenuRef}>
              <button
                type="button"
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                aria-expanded={categoryMenuOpen}
                aria-label="Statue Categories"
                className="p-2 rounded-lg text-[#1C1917] hover:bg-[#EAE3D7] transition-colors cursor-pointer"
              >
                <MoreVertical className="w-5 h-5 text-[#B38A38]" />
              </button>

              {categoryMenuOpen && (
                <div
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D4] shadow-2xl p-2 z-50 animate-fade-in"
                >
                  <div className="px-3 py-1.5 border-b border-[#E7E0D4]/70 mb-1">
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-[#B38A38]">
                      Categories
                    </p>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleSelectCategory("buddha")}
                    className="w-full text-left px-3 py-2.5 text-xs font-serif font-medium text-[#1C1917] hover:bg-white rounded-lg cursor-pointer"
                  >
                    Buddha Statues ({buddhaCount})
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleSelectCategory("hindu")}
                    className="w-full text-left px-3 py-2.5 text-xs font-serif font-medium text-[#1C1917] hover:bg-white rounded-lg cursor-pointer"
                  >
                    Hindu Statues ({hinduCount})
                  </button>
                </div>
              )}
            </div>

            <a
              href={siteConfig.cataloguePdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-[#1C1917] hover:bg-[#EAE3D7] transition-colors"
              aria-label="View PDF Catalogue"
            >
              <FileText className="w-5 h-5 text-[#B38A38]" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1C1917] hover:bg-[#EAE3D7] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B38A38]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E7E0D4] bg-[#FAF8F5] px-4 pt-4 pb-6 space-y-4 animate-fade-in shadow-xl">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  pathname === "/"
                    ? "bg-[#EAE3D7] text-[#1C1917] font-semibold"
                    : "text-[#44403C] hover:bg-[#F5F1EB]"
                }`}
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  pathname === "/about"
                    ? "bg-[#EAE3D7] text-[#1C1917] font-semibold"
                    : "text-[#44403C] hover:bg-[#F5F1EB]"
                }`}
              >
                About Us
              </Link>

              {/* Mobile Category Links */}
              <div className="pt-2 pb-1 border-t border-[#E7E0D4]/70">
                <p className="px-3 py-1 text-[10px] uppercase tracking-widest font-semibold text-[#B38A38]">
                  Statue Categories
                </p>
                <div className="flex gap-2 px-1 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelectCategory("buddha")}
                    className="flex-1 py-2 px-3 text-xs rounded-lg border border-[#D8CCBD] bg-white text-[#1C1917] font-medium text-center"
                  >
                    Buddha Statues (2)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectCategory("hindu")}
                    className="flex-1 py-2 px-3 text-xs rounded-lg border border-[#D8CCBD] bg-white text-[#1C1917] font-medium text-center"
                  >
                    Hindu Statues (5)
                  </button>
                </div>
              </div>
            </nav>

            <div className="pt-3 border-t border-[#E7E0D4] flex flex-col gap-2.5">
              <div className="flex gap-2">
                <a
                  href={siteConfig.cataloguePdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#D8CCBD] bg-white text-xs font-semibold tracking-wider uppercase text-[#1C1917]"
                >
                  <FileText className="w-4 h-4 text-[#B38A38]" />
                  <span>View PDF</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </a>

                <a
                  href={siteConfig.cataloguePdfPath}
                  download="Advaita-Tattva-Brass-Brochure.pdf"
                  className="inline-flex items-center justify-center p-3 rounded-xl border border-[#D8CCBD] bg-white text-[#1C1917]"
                  title="Download PDF"
                  aria-label="Download PDF Catalogue"
                >
                  <FileDown className="w-4 h-4 text-[#B38A38]" />
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsContactOpen(true);
                }}
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-[#1C1917] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#292524] transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Contact Details Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
}
