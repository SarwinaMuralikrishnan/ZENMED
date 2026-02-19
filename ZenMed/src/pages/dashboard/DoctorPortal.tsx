import { Users, AlertTriangle, MessageSquare, Eye, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const patients = [
  { name: "Priya Natarajan", age: 52, type: "Type 2", lastGlucose: 118, status: "stable", alerts: 0 },
  { name: "Rajan Krishnan", age: 64, type: "Type 2", lastGlucose: 265, status: "critical", alerts: 2 },
  { name: "Lakshmi Venkat", age: 45, type: "Type 1", lastGlucose: 95, status: "stable", alerts: 0 },
  { name: "Suresh Mani", age: 58, type: "Type 2", lastGlucose: 68, status: "warning", alerts: 1 },
  { name: "Meera Bala", age: 41, type: "Type 2", lastGlucose: 132, status: "stable", alerts: 0 },
];

const alerts = [
  { patient: "Rajan Krishnan", type: "High Glucose", value: "265 mg/dL", time: "2 hours ago", severity: "critical" },
  { patient: "Rajan Krishnan", type: "Missed Exercise", value: "3 days", time: "Today", severity: "warning" },
  { patient: "Suresh Mani", type: "Low Glucose", value: "68 mg/dL", time: "4 hours ago", severity: "critical" },
];

const DoctorPortal = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground">Doctor Portal</h1>
      <p className="text-muted-foreground">Monitor patients and manage alerts</p>
    </div>

    {alerts.length > 0 && (
      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-5 space-y-3">
        <h3 className="font-semibold text-destructive flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Active Alerts ({alerts.length})
        </h3>
        {alerts.map((alert, i) => (
          <div key={i} className="flex items-center justify-between bg-card rounded-lg p-3">
            <div>
              <p className="font-medium text-sm text-foreground">{alert.patient} — {alert.type}</p>
              <p className="text-xs text-muted-foreground">Value: {alert.value} • {alert.time}</p>
            </div>
            <Button size="sm" variant="outline">
              <Send className="w-3.5 h-3.5 mr-1" /> Respond
            </Button>
          </div>
        ))}
      </div>
    )}

    <div className="bg-card rounded-xl p-6 card-shadow">
      <h3 className="font-semibold font-display text-foreground mb-4 flex items-center gap-2">
        <Users className="w-5 h-5" /> Patient List
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 font-medium text-muted-foreground">Patient</th>
              <th className="text-left py-3 font-medium text-muted-foreground">Age</th>
              <th className="text-left py-3 font-medium text-muted-foreground">Type</th>
              <th className="text-left py-3 font-medium text-muted-foreground">Last Glucose</th>
              <th className="text-left py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-3 font-medium text-foreground">{p.name}</td>
                <td className="py-3 text-muted-foreground">{p.age}</td>
                <td className="py-3 text-muted-foreground">{p.type}</td>
                <td className="py-3">
                  <span className={`font-medium ${
                    p.lastGlucose > 250 ? "text-destructive" : p.lastGlucose < 70 ? "text-warning" : "text-foreground"
                  }`}>
                    {p.lastGlucose} mg/dL
                  </span>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    p.status === "critical" ? "bg-destructive/10 text-destructive" :
                    p.status === "warning" ? "bg-warning/10 text-warning" :
                    "bg-accent text-accent-foreground"
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost"><MessageSquare className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default DoctorPortal;
