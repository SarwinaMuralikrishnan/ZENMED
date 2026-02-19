import { Camera, AlertTriangle, CheckCircle2, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const postureHistory = [
  { date: "Feb 18", exercise: "Chair Squats", score: 92, feedback: "Excellent form! Keep your back straight." },
  { date: "Feb 17", exercise: "Wall Push-Ups", score: 78, feedback: "Elbows slightly too wide. Adjust angle." },
  { date: "Feb 16", exercise: "Step-Ups", score: 85, feedback: "Good knee alignment. Watch your balance." },
  { date: "Feb 15", exercise: "Arm Circles", score: 95, feedback: "Perfect range of motion!" },
];

const AIPosture = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground">AI Posture Correction</h1>
      <p className="text-muted-foreground">Real-time exercise form analysis powered by AI</p>
    </div>

    <div className="bg-card rounded-xl p-8 card-shadow text-center">
      <div className="w-full max-w-2xl mx-auto aspect-video bg-muted rounded-xl flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border">
        <Camera className="w-12 h-12 text-muted-foreground" />
        <div>
          <p className="font-semibold text-foreground">Start Posture Analysis</p>
          <p className="text-sm text-muted-foreground">Allow camera access for real-time AI corrections</p>
        </div>
        <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
          <Camera className="w-4 h-4 mr-2" /> Enable Camera
        </Button>
      </div>
    </div>

    <div className="grid sm:grid-cols-3 gap-4">
      <div className="bg-card rounded-xl p-5 card-shadow">
        <p className="text-sm text-muted-foreground mb-1">Average Score</p>
        <p className="text-3xl font-bold font-display text-foreground">87.5</p>
        <p className="text-sm text-success">Good posture</p>
      </div>
      <div className="bg-card rounded-xl p-5 card-shadow">
        <p className="text-sm text-muted-foreground mb-1">Sessions</p>
        <p className="text-3xl font-bold font-display text-foreground">24</p>
        <p className="text-sm text-muted-foreground">this month</p>
      </div>
      <div className="bg-card rounded-xl p-5 card-shadow">
        <p className="text-sm text-muted-foreground mb-1">Improvement</p>
        <p className="text-3xl font-bold font-display text-foreground">+12%</p>
        <p className="text-sm text-primary">since last week</p>
      </div>
    </div>

    <div className="bg-card rounded-xl p-6 card-shadow">
      <h3 className="font-semibold font-display text-foreground mb-4">Recent Sessions</h3>
      <div className="space-y-3">
        {postureHistory.map((session, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              {session.score >= 90 ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : session.score >= 80 ? (
                <Target className="w-5 h-5 text-primary" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-warning" />
              )}
              <div>
                <p className="font-medium text-sm text-foreground">{session.exercise}</p>
                <p className="text-xs text-muted-foreground">{session.feedback}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-foreground">{session.score}/100</p>
              <p className="text-xs text-muted-foreground">{session.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AIPosture;
