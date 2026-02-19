import { Utensils, Leaf, Flame, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const meals = {
  breakfast: [
    { name: "Idli (3 pcs) with Sambar", carbs: 35, gi: "Low", calories: 180, safe: true },
    { name: "Ragi Dosa with Chutney", carbs: 28, gi: "Low", calories: 150, safe: true },
    { name: "Oats Pongal", carbs: 30, gi: "Medium", calories: 200, safe: true },
  ],
  lunch: [
    { name: "Brown Rice with Rasam & Vegetables", carbs: 45, gi: "Medium", calories: 320, safe: true },
    { name: "Millets with Sambar & Greens", carbs: 38, gi: "Low", calories: 280, safe: true },
    { name: "Chapati (2) with Dal & Sabzi", carbs: 42, gi: "Medium", calories: 300, safe: true },
  ],
  dinner: [
    { name: "Ragi Mudde with Soppu Saaru", carbs: 32, gi: "Low", calories: 220, safe: true },
    { name: "Vegetable Soup with Multigrain Bread", carbs: 25, gi: "Low", calories: 180, safe: true },
    { name: "Dosa (2) with Coconut Chutney", carbs: 30, gi: "Medium", calories: 200, safe: true },
  ],
  snacks: [
    { name: "Sundal (Chickpea Salad)", carbs: 15, gi: "Low", calories: 90, safe: true },
    { name: "Buttermilk (Moru)", carbs: 5, gi: "Low", calories: 40, safe: true },
    { name: "Mixed Nuts (handful)", carbs: 8, gi: "Low", calories: 120, safe: true },
  ],
};

type MealItem = { name: string; carbs: number; gi: string; calories: number; safe: boolean };

const MealCard = ({ meal }: { meal: MealItem }) => (
  <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Leaf className="w-5 h-5 text-secondary shrink-0" />
      <div>
        <p className="font-medium text-sm text-foreground">{meal.name}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span>Carbs: {meal.carbs}g</span>
          <span className={`px-1.5 py-0.5 rounded ${meal.gi === "Low" ? "bg-accent text-accent-foreground" : "bg-warning/10 text-warning"}`}>
            GI: {meal.gi}
          </span>
        </div>
      </div>
    </div>
    <div className="text-right">
      <span className="flex items-center gap-1 text-sm text-muted-foreground">
        <Flame className="w-3.5 h-3.5" /> {meal.calories} cal
      </span>
    </div>
  </div>
);

const Nutrition = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground">Nutrition Plan</h1>
      <p className="text-muted-foreground">Personalized diabetic-safe meal plans with local Tamil Nadu cuisine</p>
    </div>

    <div className="bg-accent rounded-xl p-4 flex items-start gap-3">
      <Info className="w-5 h-5 text-accent-foreground mt-0.5 shrink-0" />
      <div>
        <p className="font-medium text-sm text-accent-foreground">Personalized for your region</p>
        <p className="text-xs text-accent-foreground/70">Based on Tamil Nadu dietary preferences with glycemic index data for every meal.</p>
      </div>
    </div>

    <div className="grid sm:grid-cols-4 gap-4">
      <div className="bg-card rounded-xl p-5 card-shadow">
        <p className="text-sm text-muted-foreground mb-1">Daily Calories</p>
        <p className="text-2xl font-bold font-display text-foreground">1,650</p>
        <p className="text-xs text-muted-foreground">recommended</p>
      </div>
      <div className="bg-card rounded-xl p-5 card-shadow">
        <p className="text-sm text-muted-foreground mb-1">Total Carbs</p>
        <p className="text-2xl font-bold font-display text-foreground">180g</p>
        <p className="text-xs text-muted-foreground">daily target</p>
      </div>
      <div className="bg-card rounded-xl p-5 card-shadow">
        <p className="text-sm text-muted-foreground mb-1">Protein</p>
        <p className="text-2xl font-bold font-display text-foreground">65g</p>
        <p className="text-xs text-muted-foreground">daily target</p>
      </div>
      <div className="bg-card rounded-xl p-5 card-shadow">
        <p className="text-sm text-muted-foreground mb-1">Fiber</p>
        <p className="text-2xl font-bold font-display text-foreground">30g</p>
        <p className="text-xs text-muted-foreground">daily target</p>
      </div>
    </div>

    <Tabs defaultValue="breakfast">
      <TabsList>
        <TabsTrigger value="breakfast">🌅 Breakfast</TabsTrigger>
        <TabsTrigger value="lunch">☀️ Lunch</TabsTrigger>
        <TabsTrigger value="dinner">🌙 Dinner</TabsTrigger>
        <TabsTrigger value="snacks">🍎 Snacks</TabsTrigger>
      </TabsList>
      {Object.entries(meals).map(([key, mealList]) => (
        <TabsContent key={key} value={key} className="space-y-3 mt-4">
          {mealList.map((meal, i) => (
            <MealCard key={i} meal={meal} />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  </div>
);

export default Nutrition;
