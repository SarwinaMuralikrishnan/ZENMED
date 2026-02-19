import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is ZenMed suitable for Type 1 and Type 2 diabetes?",
    a: "Yes! ZenMed supports both Type 1 and Type 2 diabetes with personalized exercise programs and nutrition plans tailored to your condition.",
  },
  {
    q: "How does the AI posture correction work?",
    a: "We use advanced pose detection to analyze your exercise form in real-time via your webcam. The system provides instant feedback and corrections to ensure safe rehabilitation exercises.",
  },
  {
    q: "Can my doctor access my health data?",
    a: "Absolutely. Your doctor or caregiver can be linked to your account and will receive real-time alerts for critical glucose levels, missed exercises, and can send you recommendations.",
  },
  {
    q: "Are the nutrition plans region-specific?",
    a: "Yes! Our nutrition engine generates meal plans based on your location and food preferences, including traditional Tamil Nadu meals with full glycemic index data.",
  },
  {
    q: "Is my health data secure?",
    a: "We use end-to-end encryption, HIPAA-compliant storage, and role-based access control to ensure your health data is always protected.",
  },
];

const FAQSection = () => (
  <section id="faq" className="py-24 bg-muted/50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
      <div className="text-center mb-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">FAQ</p>
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
          Frequently Asked Questions
        </h2>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl px-6 card-shadow border-none">
            <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-5">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
