import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { CatalogueShowcase } from "@/components/CatalogueShowcase";
import { Footer } from "@/components/Footer";
import { FloatingWhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Our Complete Collection | Advaita Tattva",
  description:
    "Explore our complete collection of 24 handcrafted antique brass Buddha and Hindu deity idols, crafted with authentic lost-wax casting.",
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header />
      <main className="flex-1">
        <CatalogueShowcase variant="all" headingLevel="h1" />
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}
