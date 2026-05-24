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
    <section className="mx-auto max-w-4xl px-5 py-20">
      <SectionHeader
        eyebrow="FAQ"
        title="A few details before the first upload."
      />
      <Accordion
        type="single"
        collapsible
        className="mt-10 rounded-xl border border-hairline bg-surface-card"
      >
        {faqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger className="px-5 py-5 text-lg font-semibold text-ink">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 text-sm leading-6 text-body">
              <p>{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
