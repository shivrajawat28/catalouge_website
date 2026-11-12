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
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
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
