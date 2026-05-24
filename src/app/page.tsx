"use client";

import { useState } from "react";

import { BenefitsSection } from "@/components/landing/benefits-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { Navbar } from "@/components/landing/navbar";
import { PricingSection } from "@/components/landing/pricing-section";
import { ProductPreviewSection } from "@/components/landing/product-preview-section";
import { UploadDialog } from "@/components/landing/upload-dialog";
import { UseCasesSection } from "@/components/landing/use-cases-section";
import type { CreateUploadSessionResponse } from "@/lib/upload/types";

export default function Home() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [, setUploadSession] = useState<CreateUploadSessionResponse | null>(
    null,
  );

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />
      <HeroSection onUploadClick={() => setUploadDialogOpen(true)} />
      <HowItWorksSection />
      <FeaturesSection />
      <ProductPreviewSection />
      <UseCasesSection />
      <BenefitsSection />
      <PricingSection />
      <FaqSection />
      <Footer />
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadSessionCreated={setUploadSession}
      />
    </main>
  );
}
