import { BarChart3, Download, TrendingUp, TrendingDown, Target, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const sugarTrend = [
  { week: "W1", avg: 145 }, { week: "W2", avg: 138 }, { week: "W3", avg: 132 },
  { week: "W4", avg: 128 }, { week: "W5", avg: 125 }, { week: "W6", avg: 120 },
];

const exerciseConsistency = [
  { week: "W1", pct: 60 }, { week: "W2", pct: 70 }, { week: "W3", pct: 75 },
  { week: "W4", pct: 80 }, { week: "W5", pct: 85 }, { week: "W6", pct: 90 },
];

const dietAdherence = [
  { name: "Followed", value: 82 },
  { name: "Skipped", value: 18 },
];
const DIET_COLORS = ["hsl(152, 55%, 45%)", "hsl(210, 15%, 89%)"];

const postureProgress = [
  { session: "1", score: 65 }, { session: "5", score: 72 }, { session: "10", score: 78 },
  { session: "15", score: 83 }, { session: "20", score: 87 }, { session: "24", score: 92 },
];

const Analytics = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Recovery Analytics</h1>
        <p className="text-muted-foreground">Insights, predictions, and progress reports</p>
      </div>
      <Button variant="outline">
        <Download className="w-4 h-4 mr-2" /> Export PDF
      </Button>
    </div>

    <div className="grid sm:grid-cols-4 gap-4">
      {[
        { icon: TrendingDown, label: "Sugar Trend", value: "↓ Improving", color: "text-success" },
        { icon: Activity, label: "Exercise Score", value: "90%", color: "text-primary" },
        { icon: Target, label: "Diet Adherence", value: "82%", color: "text-secondary" },
        { icon: TrendingUp, label: "Posture Score", value: "92/100", color: "text-info" },
      ].map((card) => (
        <div key={card.label} className="bg-card rounded-xl p-5 card-shadow">
          <card.icon className={`w-5 h-5 ${card.color} mb-2`} />
          <p className="text-xl font-bold font-display text-foreground">{card.value}</p>
          <p className="text-sm text-muted-foreground">{card.label}</p>
        </div>
      ))}
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-xl p-6 card-shadow">
        <h3 className="font-semibold font-display text-foreground mb-4">Sugar Trend Prediction</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={sugarTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 89%)" />
            <XAxis dataKey="week" fontSize={12} stroke="hsl(210, 10%, 45%)" />
            <YAxis fontSize={12} stroke="hsl(210, 10%, 45%)" domain={[100, 160]} />
            <Tooltip />
            <Line type="monotone" dataKey="avg" stroke="hsl(195, 80%, 40%)" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-xl p-6 card-shadow">
        <h3 className="font-semibold font-display text-foreground mb-4">Exercise Consistency</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={exerciseConsistency}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 89%)" />
            <XAxis dataKey="week" fontSize={12} stroke="hsl(210, 10%, 45%)" />
            <YAxis fontSize={12} stroke="hsl(210, 10%, 45%)" domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="pct" fill="hsl(152, 55%, 45%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-xl p-6 card-shadow">
        <h3 className="font-semibold font-display text-foreground mb-4">Diet Adherence</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={dietAdherence} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
              {dietAdherence.map((_, i) => (
                <Cell key={i} fill={DIET_COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-2">
          {dietAdherence.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ background: DIET_COLORS[i] }} />
              <span className="text-muted-foreground">{item.name}: {item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 card-shadow">
        <h3 className="font-semibold font-display text-foreground mb-4">Posture Score Progress</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={postureProgress}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 89%)" />
            <XAxis dataKey="session" fontSize={12} stroke="hsl(210, 10%, 45%)" />
            <YAxis fontSize={12} stroke="hsl(210, 10%, 45%)" domain={[50, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="hsl(210, 80%, 55%)" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default Analytics;
