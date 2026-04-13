import { motion } from "framer-motion";
import { Salad, Leaf, Flame, Droplets, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const meals = [
  {
    label: "Breakfast",
    emoji: "🌅",
    time: "7:00 – 9:00 AM",
    color: "from-amber-400/15 to-orange-300/10",
    border: "border-amber-200/50",
    tagColor: "bg-amber-100 text-amber-700",
    img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=140&auto=format&fit=crop",
    items: [
      { name: "Poha", desc: "Flattened rice with mustard seeds, turmeric & veggies — light, low GI & easy to digest", tag: "Low GI" },
      { name: "Upma", desc: "Semolina with vegetables & curry leaves — filling, low cost & hormone-friendly", tag: "High Fibre" },
      { name: "Besan Chilla", desc: "Chickpea flour pancakes with veggies — high protein, low GI, PCOS-ideal", tag: "High Protein" },
      { name: "Sprouts Salad", desc: "Mixed sprouts with lemon, cumin & tomato — packed with zinc & fibre", tag: "Anti-inflammatory" },
      { name: "Oats Porridge", desc: "Steel-cut oats with nuts & seeds — reduces insulin spikes, great for hormones", tag: "Blood Sugar" },
    ],
  },
  {
    label: "Lunch",
    emoji: "☀️",
    time: "12:00 – 2:00 PM",
    color: "from-emerald-400/15 to-teal-300/10",
    border: "border-emerald-200/50",
    tagColor: "bg-emerald-100 text-emerald-700",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=140&auto=format&fit=crop",
    items: [
      { name: "Dal + Brown Rice", desc: "Yellow moong dal or toor dal with brown rice — complete protein, manages insulin", tag: "Complete Protein" },
      { name: "Roti + Sabzi", desc: "2-3 multigrain rotis with any seasonal vegetable sabzi — balanced & affordable", tag: "Balanced Meal" },
      { name: "Chana Masala", desc: "Chickpea curry with onion & tomato — high protein, high fibre, very filling", tag: "High Protein" },
      { name: "Rajma + Roti", desc: "Kidney beans curry with roti — excellent protein & iron source for PCOS", tag: "Iron-Rich" },
      { name: "Salad", desc: "Cucumber, tomato, carrot, beetroot with lemon & black salt — always add raw veg!", tag: "Vitamins" },
    ],
  },
  {
    label: "Dinner",
    emoji: "🌙",
    time: "7:00 – 8:00 PM",
    color: "from-violet-400/15 to-purple-300/10",
    border: "border-violet-200/50",
    tagColor: "bg-violet-100 text-violet-700",
    img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=140&auto=format&fit=crop",
    items: [
      { name: "Khichdi", desc: "Moong dal + rice with ghee & jeera — easy to digest, gut-healing, light on hormones", tag: "Gut-Friendly" },
      { name: "Light Roti + Sabzi", desc: "1-2 rotis with a lighter vegetable curry — don't skip dinner but keep it light", tag: "Light Meal" },
      { name: "Vegetable Soup", desc: "Tomato, spinach or mixed veg soup — warming, low calorie, anti-inflammatory", tag: "Anti-inflammatory" },
      { name: "Daliya (Broken Wheat)", desc: "Broken wheat upma or porridge — high fibre, keeps you full through the night", tag: "High Fibre" },
    ],
  },
  {
    label: "Snacks",
    emoji: "🍎",
    time: "Between meals",
    color: "from-pink-400/15 to-rose-300/10",
    border: "border-pink-200/50",
    tagColor: "bg-rose-100 text-rose-700",
    img: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=300&h=140&auto=format&fit=crop",
    items: [
      { name: "Roasted Chana", desc: "Bengal gram roasted with spices — very affordable, high protein, controls hunger", tag: "High Protein" },
      { name: "Peanuts (boiled/roasted)", desc: "A small handful — healthy fats, magnesium, supports ovarian function", tag: "Healthy Fats" },
      { name: "Seasonal Fruits", desc: "Banana (post-workout), apple, guava, papaya — low to medium GI fruits for PCOS", tag: "Natural Sugar" },
      { name: "Makhana (Fox Nuts)", desc: "Roasted lotus seeds with black pepper — low calorie, high calcium & magnesium", tag: "Low Calorie" },
    ],
  },
  {
    label: "Drinks",
    emoji: "💧",
    time: "Throughout the day",
    color: "from-blue-400/15 to-cyan-300/10",
    border: "border-blue-200/50",
    tagColor: "bg-blue-100 text-blue-700",
    img: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300&h=140&auto=format&fit=crop",
    items: [
      { name: "Water (2–3 Litres)", desc: "The most important habit for PCOS. Flushes toxins, supports kidney & hormone balance", tag: "Essential" },
      { name: "Lemon Water", desc: "Warm lemon water first thing in the morning — reduces inflammation, boosts metabolism", tag: "Morning Ritual" },
      { name: "Herbal Tea", desc: "Spearmint tea (reduces androgens!), turmeric tea, or chamomile — powerful for PCOS", tag: "Hormone Support" },
      { name: "Jeera Water", desc: "Cumin seeds soaked overnight — aids digestion, reduces bloating, supports weight loss", tag: "Digestive" },
    ],
  },
];

const avoidFoods = [
  { name: "Sugar & Sweets", emoji: "🍬", reason: "Spikes insulin rapidly, worsens PCOS hormonal imbalance" },
  { name: "Maida (White Flour)", emoji: "🍞", reason: "High GI, causes inflammation, increases androgen production" },
  { name: "Fried Food", emoji: "🍟", reason: "Trans fats increase inflammation and worsen insulin resistance" },
  { name: "Soft Drinks", emoji: "🥤", reason: "High fructose corn syrup directly worsens ovarian function" },
  { name: "Junk Food", emoji: "🍕", reason: "Highly processed, triggers chronic low-grade inflammation" },
  { name: "Dairy (excess)", emoji: "🧈", reason: "May increase IGF-1 levels — limit full-fat dairy if symptoms persist" },
  { name: "Alcohol", emoji: "🍷", reason: "Disrupts liver function, which is vital for hormone clearance" },
  { name: "Excess Salt", emoji: "🧂", reason: "Causes bloating and water retention, common PCOS complaint" },
];

const nutrients = [
  { name: "Inositol", emoji: "💊", source: "Mango, citrus fruits, beans, lentils", benefit: "Improves insulin sensitivity & ovulation" },
  { name: "Magnesium", emoji: "🌿", source: "Pumpkin seeds, spinach, dark chocolate, almonds", benefit: "Reduces insulin resistance & inflammation" },
  { name: "Vitamin D", emoji: "☀️", source: "Sunlight, fortified foods, mushrooms", benefit: "Regulates menstrual cycle & insulin signalling" },
  { name: "Omega-3", emoji: "🐟", source: "Flaxseeds, chia seeds, walnuts", benefit: "Reduces inflammation, regulates hormones" },
  { name: "Iron", emoji: "💪", source: "Spinach, beetroot, dates, rajma, lentils", benefit: "Prevents anaemia from heavy periods" },
  { name: "Zinc", emoji: "⚡", source: "Pumpkin seeds, sesame seeds, chickpeas", benefit: "Reduces acne, supports hair health & ovulation" },
];

export default function Diet() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <motion.div variants={container} initial="hidden" animate="show">

        {/* Header */}
        <motion.div variants={item}>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 p-6 md:p-8 text-white shadow-xl shadow-emerald-300/25">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/8 -translate-y-1/4 translate-x-1/4" />
            <img
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=200&auto=format&fit=crop"
              alt="Indian vegan food"
              className="absolute inset-0 w-full h-full object-cover opacity-15"
            />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-3 py-1.5 text-xs font-medium mb-3">
                <Leaf className="h-3.5 w-3.5" /> 100% Vegan · Affordable · Indian
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">PCOS-Friendly Indian Diet 🌿</h1>
              <p className="text-white/75 text-sm max-w-xl">A practical, affordable, 100% plant-based Indian meal plan designed specifically to balance PCOS hormones, manage insulin, and reduce inflammation.</p>
            </div>
          </div>
        </motion.div>

        {/* Daily nutrition reminder */}
        <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Droplets, label: "2-3L Water", value: "Daily", color: "text-blue-500", bg: "bg-blue-50" },
            { icon: Flame, label: "1,500–1,800 kcal", value: "Target", color: "text-orange-500", bg: "bg-orange-50" },
            { icon: Salad, label: "5+ Servings", value: "Vegetables", color: "text-emerald-500", bg: "bg-emerald-50" },
            { icon: Leaf, label: "Low GI", value: "Always", color: "text-green-600", bg: "bg-green-50" },
          ].map(stat => (
            <Card key={stat.label} className={`${stat.bg} border-0 shadow-sm`}>
              <CardContent className="p-4 text-center">
                <stat.icon className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
                <p className="font-bold text-sm text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Meal sections */}
        {meals.map((meal) => (
          <motion.div key={meal.label} variants={item}>
            <Card className={`bg-gradient-to-br ${meal.color} border ${meal.border} shadow-sm overflow-hidden`}>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <img src={meal.img} alt={meal.label} className="w-full md:w-44 h-36 md:h-auto object-cover flex-shrink-0" />
                  <div className="p-5 flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">{meal.emoji}</span>
                      <div>
                        <h3 className="text-lg font-bold">{meal.label}</h3>
                        <p className="text-xs text-muted-foreground">{meal.time}</p>
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      {meal.items.map(food => (
                        <div key={food.name} className="flex items-start gap-3 bg-white/55 rounded-xl p-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-sm font-semibold">{food.name}</p>
                              <Badge className={`${meal.tagColor} border-0 text-[10px] h-4 px-1.5 flex-shrink-0`}>{food.tag}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{food.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Foods to avoid */}
        <motion.div variants={item}>
          <Card className="bg-rose-50/80 border border-rose-200/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-rose-500" />
                Foods to Avoid with PCOS
              </CardTitle>
              <p className="text-xs text-muted-foreground">These foods worsen insulin resistance, inflammation & hormonal imbalance</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {avoidFoods.map(food => (
                  <div key={food.name} className="bg-white/70 rounded-xl p-3 text-center border border-rose-100">
                    <div className="text-2xl mb-1">{food.emoji}</div>
                    <p className="text-xs font-semibold text-foreground mb-1">{food.name}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug">{food.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Nutrients */}
        <motion.div variants={item}>
          <Card className="bg-violet-50/80 border border-violet-200/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Leaf className="h-5 w-5 text-violet-500" />
                Key Nutrients for PCOS
              </CardTitle>
              <p className="text-xs text-muted-foreground">Focus on these nutrients through food and supplements</p>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {nutrients.map(n => (
                  <div key={n.name} className="flex items-start gap-3 bg-white/60 rounded-xl p-3">
                    <span className="text-xl flex-shrink-0">{n.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold">{n.name}</p>
                      <p className="text-xs text-muted-foreground mb-1">{n.benefit}</p>
                      <p className="text-[10px] text-violet-600 font-medium">Found in: {n.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  );
}
