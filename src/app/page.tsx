import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CatalogueSection } from "@/components/CatalogueSection";
import { CatalogueShowcase } from "@/components/CatalogueShowcase";
import { ContactForm } from "@/components/ContactForm";
import { FloatingWhatsAppButton } from "@/components/WhatsAppButton";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <CatalogueSection />
        <CatalogueShowcase />
        <ContactForm />
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </>
  );
}
