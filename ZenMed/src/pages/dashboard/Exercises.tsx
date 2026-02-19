import { Dumbbell, Play, Clock, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const exerciseCategories = {
  beginner: [
    { name: "Gentle Walking", duration: "15 min", reps: "—", calories: 60, completed: true },
    { name: "Chair Squats", duration: "10 min", reps: "3×10", calories: 45, completed: true },
    { name: "Arm Circles", duration: "5 min", reps: "3×15", calories: 20, completed: false },
    { name: "Seated Leg Lifts", duration: "10 min", reps: "3×12", calories: 35, completed: false },
  ],
  intermediate: [
    { name: "Brisk Walking", duration: "25 min", reps: "—", calories: 120, completed: false },
    { name: "Resistance Band Rows", duration: "15 min", reps: "4×12", calories: 80, completed: false },
    { name: "Step-Ups", duration: "10 min", reps: "3×15", calories: 70, completed: false },
    { name: "Wall Push-Ups", duration: "10 min", reps: "3×10", calories: 55, completed: false },
  ],
  rehab: [
    { name: "Shoulder Mobility", duration: "10 min", reps: "3×8", calories: 25, completed: false },
    { name: "Ankle Rotations", duration: "5 min", reps: "3×10", calories: 15, completed: false },
    { name: "Neck Stretches", duration: "5 min", reps: "3×6", calories: 10, completed: false },
    { name: "Hip Flexor Stretch", duration: "10 min", reps: "3×8", calories: 20, completed: false },
  ],
};

const ExerciseCard = ({ exercise }: { exercise: typeof exerciseCategories.beginner[0] }) => (
  <div className={`bg-card rounded-xl p-5 card-shadow border-l-4 ${exercise.completed ? "border-l-success" : "border-l-primary"}`}>
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        {exercise.completed ? (
          <CheckCircle2 className="w-5 h-5 text-success" />
        ) : (
          <Dumbbell className="w-5 h-5 text-primary" />
        )}
        <h3 className="font-semibold text-foreground">{exercise.name}</h3>
      </div>
      {!exercise.completed && (
        <Button size="sm" variant="ghost" className="text-primary">
          <Play className="w-4 h-4 mr-1" /> Start
        </Button>
      )}
    </div>
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {exercise.duration}</span>
      <span>Reps: {exercise.reps}</span>
      <span>{exercise.calories} cal</span>
    </div>
  </div>
);

const Exercises = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground">Exercise Programs</h1>
      <p className="text-muted-foreground">Guided rehabilitation exercises tailored for you</p>
    </div>

    <div className="grid sm:grid-cols-3 gap-4">
      <div className="bg-card rounded-xl p-5 card-shadow">
        <p className="text-sm text-muted-foreground mb-1">Today's Progress</p>
        <p className="text-3xl font-bold font-display text-foreground">2/4</p>
        <p className="text-sm text-muted-foreground">exercises completed</p>
      </div>
      <div className="bg-card rounded-xl p-5 card-shadow">
        <p className="text-sm text-muted-foreground mb-1">Streak</p>
        <p className="text-3xl font-bold font-display text-foreground flex items-center gap-1">5 <Star className="w-5 h-5 text-warning fill-warning" /></p>
        <p className="text-sm text-muted-foreground">consecutive days</p>
      </div>
      <div className="bg-card rounded-xl p-5 card-shadow">
        <p className="text-sm text-muted-foreground mb-1">Calories Burned</p>
        <p className="text-3xl font-bold font-display text-foreground">105</p>
        <p className="text-sm text-muted-foreground">today</p>
      </div>
    </div>

    <Tabs defaultValue="beginner">
      <TabsList>
        <TabsTrigger value="beginner">Beginner</TabsTrigger>
        <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
        <TabsTrigger value="rehab">Rehabilitation</TabsTrigger>
      </TabsList>
      {Object.entries(exerciseCategories).map(([key, exercises]) => (
        <TabsContent key={key} value={key} className="space-y-3 mt-4">
          {exercises.map((ex, i) => (
            <ExerciseCard key={i} exercise={ex} />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  </div>
);

export default Exercises;
