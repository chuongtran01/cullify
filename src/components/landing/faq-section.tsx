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
    <section className="mx-auto max-w-[900px] px-5 py-20">
      <SectionHeader
        eyebrow="FAQ"
        title="A few details before the first upload."
      />
      <Accordion className="mt-10 rounded-[12px] border border-hairline bg-surface-card">
        {faqs.map((faq) => (
          <AccordionItem key={faq.question}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
