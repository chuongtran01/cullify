"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { BenefitsSection } from "@/components/landing/benefits-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { ProductPreviewSection } from "@/components/landing/product-preview-section";
import { UploadDialog } from "@/components/landing/upload-dialog";
import { UseCasesSection } from "@/components/landing/use-cases-section";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import type { CreateUploadSessionResponse } from "@/lib/upload/types";

export default function Home() {
  const router = useRouter();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  function handleUploadSessionCreated(response: CreateUploadSessionResponse) {
    router.push(`/batches/${response.sessionId}/progress`);
  }

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Navbar />
      <HeroSection onUploadClick={() => setUploadDialogOpen(true)} />
      <ProductPreviewSection />
      <HowItWorksSection />
      <FeaturesSection />
      <BenefitsSection />
      <UseCasesSection />
      <PricingSection />
      <FaqSection />
      <Footer />
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadSessionCreated={handleUploadSessionCreated}
      />
    </main>
  );
}
