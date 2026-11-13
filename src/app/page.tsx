import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { QuickNavigation } from "@/components/QuickNavigation";
import { CatalogueSection } from "@/components/CatalogueSection";
import { CatalogueShowcase } from "@/components/CatalogueShowcase";
import { VideoGallery } from "@/components/VideoGallery";
import { ContactForm } from "@/components/ContactForm";
import { FloatingWhatsAppButton } from "@/components/WhatsAppButton";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <QuickNavigation />
        <CatalogueSection />
        <CatalogueShowcase variant="featured" />
        <VideoGallery />
        <ContactForm />
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </>
  );
}
