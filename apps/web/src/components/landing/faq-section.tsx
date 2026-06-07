import { faqs } from "@/components/landing/content";
import { SectionHeader } from "@/components/landing/section-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  return (
    <section className="border-t border-hairline bg-canvas-soft">
      <div className="mx-auto max-w-[1200px] px-5 py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHeader
            eyebrow="FAQ"
            title="A few details before the first upload."
          />
          <Accordion
            type="single"
            collapsible
            className="mt-10 rounded-lg border border-hairline-strong bg-surface-card"
          >
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger className="px-5 py-5 text-lg font-semibold leading-snug tracking-[-0.02em] text-ink">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-sm leading-normal text-body">
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
