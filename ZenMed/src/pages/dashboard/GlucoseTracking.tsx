import { useState } from "react";
import { Droplets, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const monthlyData = [
  { date: "Feb 1", glucose: 130 }, { date: "Feb 3", glucose: 125 },
  { date: "Feb 5", glucose: 142 }, { date: "Feb 7", glucose: 118 },
  { date: "Feb 9", glucose: 135 }, { date: "Feb 11", glucose: 120 },
  { date: "Feb 13", glucose: 115 }, { date: "Feb 15", glucose: 128 },
  { date: "Feb 17", glucose: 122 }, { date: "Feb 18", glucose: 118 },
];

const readings = [
  { time: "7:00 AM", value: 105, type: "Fasting", status: "normal" },
  { time: "9:30 AM", value: 145, type: "Post-Breakfast", status: "normal" },
  { time: "1:00 PM", value: 160, type: "Post-Lunch", status: "elevated" },
  { time: "6:30 PM", value: 132, type: "Pre-Dinner", status: "normal" },
  { time: "9:00 PM", value: 118, type: "Post-Dinner", status: "normal" },
];

const GlucoseTracking = () => {
  const [newReading, setNewReading] = useState("");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Glucose Tracking</h1>
          <p className="text-muted-foreground">Monitor and log your blood sugar levels</p>
        </div>
        <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" /> Add Reading
        </Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 card-shadow">
          <p className="text-sm text-muted-foreground mb-1">Current Level</p>
          <p className="text-3xl font-bold font-display text-foreground">118 <span className="text-base font-normal text-muted-foreground">mg/dL</span></p>
          <div className="flex items-center gap-1 mt-2 text-success text-sm">
            <TrendingDown className="w-4 h-4" /> 8% from yesterday
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 card-shadow">
          <p className="text-sm text-muted-foreground mb-1">7-Day Average</p>
          <p className="text-3xl font-bold font-display text-foreground">127 <span className="text-base font-normal text-muted-foreground">mg/dL</span></p>
          <div className="flex items-center gap-1 mt-2 text-success text-sm">
            <TrendingDown className="w-4 h-4" /> Improving
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 card-shadow">
          <p className="text-sm text-muted-foreground mb-1">HbA1c Estimate</p>
          <p className="text-3xl font-bold font-display text-foreground">6.2<span className="text-base font-normal text-muted-foreground">%</span></p>
          <div className="flex items-center gap-1 mt-2 text-primary text-sm">
            <TrendingUp className="w-4 h-4" /> Within target
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 card-shadow">
        <h3 className="font-semibold font-display text-foreground mb-4">Blood Sugar Trend (February)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 89%)" />
            <XAxis dataKey="date" fontSize={12} stroke="hsl(210, 10%, 45%)" />
            <YAxis fontSize={12} stroke="hsl(210, 10%, 45%)" domain={[80, 200]} />
            <Tooltip />
            <Line type="monotone" dataKey="glucose" stroke="hsl(195, 80%, 40%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(195, 80%, 40%)" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-xl p-6 card-shadow">
        <h3 className="font-semibold font-display text-foreground mb-4">Today's Readings</h3>
        <div className="space-y-3">
          {readings.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Droplets className={`w-5 h-5 ${r.status === "elevated" ? "text-warning" : "text-primary"}`} />
                <div>
                  <p className="font-medium text-sm text-foreground">{r.value} mg/dL</p>
                  <p className="text-xs text-muted-foreground">{r.type}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{r.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlucoseTracking;
