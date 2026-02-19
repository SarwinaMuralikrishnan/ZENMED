import { UserPlus, Settings, BarChart3, HeartPulse } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Sign Up", description: "Create your patient, doctor, or caregiver account in seconds." },
  { icon: Settings, title: "Set Up Profile", description: "Enter your health data, food preferences, and exercise goals." },
  { icon: HeartPulse, title: "Follow Your Plan", description: "Get AI-personalized exercises, nutrition, and reminders daily." },
  { icon: BarChart3, title: "Track Progress", description: "Monitor glucose, posture scores, and recovery analytics over time." },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-24 bg-muted/50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">How It Works</p>
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
          Get Started in 4 Simple Steps
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <div key={step.title} className="relative text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto mb-5 flex items-center justify-center">
              <step.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="absolute top-0 right-1/2 translate-x-[3.5rem] -translate-y-2 text-xs font-bold text-primary bg-accent px-2 py-0.5 rounded-full">
              {i + 1}
            </span>
            <h3 className="text-lg font-semibold font-display text-foreground mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
