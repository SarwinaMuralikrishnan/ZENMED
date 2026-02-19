import { Droplets, Dumbbell, Utensils, Heart, TrendingUp, Brain, AlertTriangle, CheckCircle2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const glucoseData = [
  { day: "Mon", glucose: 120 }, { day: "Tue", glucose: 145 },
  { day: "Wed", glucose: 110 }, { day: "Thu", glucose: 135 },
  { day: "Fri", glucose: 125 }, { day: "Sat", glucose: 140 },
  { day: "Sun", glucose: 118 },
];

const exerciseData = [
  { day: "Mon", mins: 30 }, { day: "Tue", mins: 45 },
  { day: "Wed", mins: 20 }, { day: "Thu", mins: 35 },
  { day: "Fri", mins: 50 }, { day: "Sat", mins: 25 },
  { day: "Sun", mins: 40 },
];

const summaryCards = [
  { icon: Droplets, label: "Blood Glucose", value: "118 mg/dL", status: "Normal", color: "text-primary" },
  { icon: Dumbbell, label: "Exercises Done", value: "5/7", status: "On Track", color: "text-secondary" },
  { icon: Utensils, label: "Diet Adherence", value: "82%", status: "Good", color: "text-warning" },
  { icon: Heart, label: "Health Score", value: "78/100", status: "Improving", color: "text-success" },
];

const recommendations = [
  { icon: CheckCircle2, text: "Great job completing your morning walk today!", type: "success" },
  { icon: TrendingUp, text: "Your glucose levels are trending down this week — keep it up!", type: "info" },
  { icon: AlertTriangle, text: "You missed your evening medication yesterday. Set a reminder?", type: "warning" },
  { icon: Brain, text: "Try the new shoulder rehab exercise added to your program.", type: "info" },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Good Morning, Priya 👋</h1>
        <p className="text-muted-foreground">Here's your health summary for today.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="bg-card rounded-xl p-5 card-shadow">
            <div className="flex items-center justify-between mb-3">
              <card.icon className={`w-5 h-5 ${card.color}`} />
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{card.status}</span>
            </div>
            <p className="text-2xl font-bold font-display text-foreground">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 card-shadow">
          <h3 className="font-semibold font-display text-foreground mb-4">Blood Glucose (This Week)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={glucoseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 89%)" />
              <XAxis dataKey="day" fontSize={12} stroke="hsl(210, 10%, 45%)" />
              <YAxis fontSize={12} stroke="hsl(210, 10%, 45%)" />
              <Tooltip />
              <Line type="monotone" dataKey="glucose" stroke="hsl(195, 80%, 40%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(195, 80%, 40%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-6 card-shadow">
          <h3 className="font-semibold font-display text-foreground mb-4">Exercise Minutes (This Week)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={exerciseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 89%)" />
              <XAxis dataKey="day" fontSize={12} stroke="hsl(210, 10%, 45%)" />
              <YAxis fontSize={12} stroke="hsl(210, 10%, 45%)" />
              <Tooltip />
              <Bar dataKey="mins" fill="hsl(152, 55%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 card-shadow">
        <h3 className="font-semibold font-display text-foreground mb-4">AI Recommendations</h3>
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
              rec.type === "success" ? "bg-accent" : rec.type === "warning" ? "bg-warning/10" : "bg-muted"
            }`}>
              <rec.icon className={`w-5 h-5 mt-0.5 shrink-0 ${
                rec.type === "success" ? "text-success" : rec.type === "warning" ? "text-warning" : "text-info"
              }`} />
              <p className="text-sm text-foreground">{rec.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
