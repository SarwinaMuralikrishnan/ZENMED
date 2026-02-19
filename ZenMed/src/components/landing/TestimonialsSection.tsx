import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Natarajan",
    role: "Type 2 Diabetes Patient",
    text: "ZenMed's nutrition plans using local Tamil Nadu meals made managing my diet so much easier. The glucose tracker is a lifesaver!",
    rating: 5,
  },
  {
    name: "Dr. Ramesh Kumar",
    role: "Endocrinologist",
    text: "The caregiver dashboard gives me real-time visibility into my patients' progress. The alert system catches critical glucose levels instantly.",
    rating: 5,
  },
  {
    name: "Anitha Selvam",
    role: "Caregiver",
    text: "I can monitor my mother's exercise and medication compliance from anywhere. The reminders keep her on track every day.",
    rating: 5,
  },
];

const TestimonialsSection = () => (
  <section id="testimonials" className="py-24 bg-background">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">Testimonials</p>
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
          Trusted by Patients & Doctors
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-card rounded-xl p-8 card-shadow hover:card-shadow-lg transition-shadow">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-warning text-warning" />
              ))}
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed italic">"{t.text}"</p>
            <div>
              <p className="font-semibold text-foreground">{t.name}</p>
              <p className="text-sm text-muted-foreground">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
