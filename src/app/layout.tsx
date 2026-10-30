import type { Metadata } from "next";
import { Cinzel, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/siteConfig";

const cinzel = Cinzel({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${siteConfig.companyName} | ${siteConfig.tagline}`,
  description: siteConfig.shortBio,
  keywords: [
    "brass sculptures",
    "brass idols",
    "lost wax brass casting",
    "handcrafted statues",
    "ganesha idol brass",
    "krishna statue brass",
    "temple sculptures",
    "luxury brass decor",
    "artisan metalcraft"
  ],
  authors: [{ name: siteConfig.companyName }],
  openGraph: {
    title: `${siteConfig.companyName} | ${siteConfig.tagline}`,
    description: siteConfig.shortBio,
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${plusJakartaSans.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-[#FAF8F5] text-[#1C1917] font-sans selection:bg-[#B38A38]/20 selection:text-[#1C1917] flex flex-col">
        {children}
      </body>
    </html>
  );
}
