import { BenefitsSection } from "@/components/landing/benefits-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { Navbar } from "@/components/landing/navbar";
import { PricingSection } from "@/components/landing/pricing-section";
import { ProductPreviewSection } from "@/components/landing/product-preview-section";
import { UseCasesSection } from "@/components/landing/use-cases-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ProductPreviewSection />
      <UseCasesSection />
      <BenefitsSection />
      <PricingSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
