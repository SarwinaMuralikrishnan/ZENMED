import {
  Activity, Brain, Utensils, Bell, LineChart, Users, Globe, Camera,
} from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "AI Posture Correction",
    description: "Real-time pose detection with skeleton overlay and exercise form analysis using AI.",
  },
  {
    icon: Activity,
    title: "Exercise Programs",
    description: "Guided beginner to advanced rehabilitation exercises with video demos and rep tracking.",
  },
  {
    icon: Utensils,
    title: "Localized Nutrition",
    description: "Personalized meal plans based on your region, featuring glycemic index data for every dish.",
  },
  {
    icon: LineChart,
    title: "Glucose Tracking",
    description: "Log readings, import CSV data, and visualize trends with weekly and monthly charts.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Never miss medication, exercise, or water intake with intelligent activity reminders.",
  },
  {
    icon: Brain,
    title: "Recovery Analytics",
    description: "AI-powered insights, sugar trend predictions, and exportable health reports.",
  },
  {
    icon: Users,
    title: "Doctor & Caregiver Portal",
    description: "Caregivers and doctors can monitor patients, view reports, and send recommendations.",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Full support for English and Tamil with easy language switching throughout the app.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="py-24 bg-background">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">Features</p>
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-4">
          Everything You Need to Manage Diabetes
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive tools powered by AI to help you stay healthy, active, and informed.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="group bg-card rounded-xl p-6 card-shadow hover:card-shadow-lg transition-all duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4 group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-colors">
              <f.icon className="w-6 h-6 text-accent-foreground group-hover:text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold font-display text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
