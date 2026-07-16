import { CustomerLayout } from '@/components/layout/customer-layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: "Where do you source your fruits from?",
    answer: "We source our fruits directly from certified organic farms and premium orchards across the globe. Our domestic produce comes from local farmers who practice sustainable agriculture, while our exotic fruits are imported from the finest international growers under strict quality control."
  },
  {
    question: "How long does delivery take?",
    answer: "Standard delivery typically takes 2-3 business days. For fresh fruits, we offer expedited next-day delivery in select metropolitan areas to ensure maximum freshness upon arrival."
  },
  {
    question: "Are your dry fruits artificially sweetened?",
    answer: "No. Our premium dry fruits are naturally dried without any added sugars, preservatives, or artificial colors. We believe in providing the pure, natural sweetness that nature intended."
  },
  {
    question: "What is your return policy for fresh produce?",
    answer: "Due to the perishable nature of fresh fruits, we do not accept returns. However, we have a 100% Satisfaction Guarantee. If any item arrives damaged or in poor condition, please contact our support team within 24 hours with a photo, and we will issue a full refund or replacement."
  },
  {
    question: "Do you offer wholesale or corporate gifting?",
    answer: "Yes! We have a dedicated corporate gifting program and offer wholesale pricing for restaurants and businesses. Please contact us at wholesale@naturafruits.com for a custom quote."
  }
];

export default function FaqPage() {
  return (
    <CustomerLayout>
      <div className="bg-muted/30 py-12 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions about our products, sourcing, and delivery.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-card border rounded-xl px-6 data-[state=open]:shadow-sm">
              <AccordionTrigger className="font-serif font-bold text-lg hover:no-underline hover:text-primary text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </CustomerLayout>
  );
}
