import { useState } from "react";
import { Bell, Plus, Trash2, Clock, Pill, Droplets, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialReminders = [
  { id: 1, type: "medicine", label: "Metformin 500mg", time: "08:00 AM", days: "Daily", active: true },
  { id: 2, type: "exercise", label: "Morning Walk", time: "06:30 AM", days: "Mon-Fri", active: true },
  { id: 3, type: "water", label: "Drink Water", time: "Every 2 hours", days: "Daily", active: true },
  { id: 4, type: "medicine", label: "Insulin Injection", time: "07:00 PM", days: "Daily", active: true },
  { id: 5, type: "exercise", label: "Shoulder Rehab", time: "05:00 PM", days: "Mon, Wed, Fri", active: false },
];

const typeIcons: Record<string, typeof Pill> = {
  medicine: Pill,
  exercise: Dumbbell,
  water: Droplets,
};

const Reminders = () => {
  const [reminders, setReminders] = useState(initialReminders);

  const toggleReminder = (id: number) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const deleteReminder = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Smart Reminders</h1>
          <p className="text-muted-foreground">Never miss your medication, exercise, or hydration</p>
        </div>
        <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" /> Add Reminder
        </Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 card-shadow">
          <Pill className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold font-display text-foreground">2</p>
          <p className="text-sm text-muted-foreground">Medicine reminders</p>
        </div>
        <div className="bg-card rounded-xl p-5 card-shadow">
          <Dumbbell className="w-5 h-5 text-secondary mb-2" />
          <p className="text-2xl font-bold font-display text-foreground">2</p>
          <p className="text-sm text-muted-foreground">Exercise reminders</p>
        </div>
        <div className="bg-card rounded-xl p-5 card-shadow">
          <Droplets className="w-5 h-5 text-info mb-2" />
          <p className="text-2xl font-bold font-display text-foreground">1</p>
          <p className="text-sm text-muted-foreground">Water reminders</p>
        </div>
      </div>

      <div className="space-y-3">
        {reminders.map((reminder) => {
          const Icon = typeIcons[reminder.type] || Bell;
          return (
            <div key={reminder.id} className={`bg-card rounded-xl p-5 card-shadow flex items-center justify-between ${!reminder.active ? "opacity-50" : ""}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{reminder.label}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {reminder.time}</span>
                    <span>{reminder.days}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => toggleReminder(reminder.id)}>
                  {reminder.active ? "Pause" : "Resume"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteReminder(reminder.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reminders;
