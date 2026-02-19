import { Link } from "react-router-dom";
import { ArrowRight, Shield, Brain, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-hero opacity-80" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground/80">AI-Powered Diabetes Management</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold font-display leading-tight mb-6 animate-fade-in text-primary-foreground">
            Your Personal{" "}
            <span className="text-gradient">Health</span>{" "}
            Companion
          </h1>

          <p className="text-lg sm:text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Smart rehabilitation exercises, real-time posture correction, personalized nutrition, 
            and glucose tracking — all powered by AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Link to="/register">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 px-8 h-12 text-base glow">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-8 h-12 text-base">
                Learn More
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {[
              { icon: Brain, label: "AI Posture Correction" },
              { icon: Heart, label: "Health Monitoring" },
              { icon: Shield, label: "Doctor Alerts" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 glass rounded-xl p-4">
                <Icon className="w-6 h-6 text-secondary" />
                <span className="text-xs sm:text-sm font-medium text-primary-foreground/70">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
