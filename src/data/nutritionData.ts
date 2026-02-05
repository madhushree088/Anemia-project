export interface NutritionItem {
  id: string;
  name: string;
  ironContent: number; // mg per 100g
  vitaminC: boolean;
  category: 'meat' | 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'legumes' | 'nuts';
  description: string;
  servingSize: string;
  benefits: string[];
  image: string;
}

export interface NutritionTip {
  id: string;
  title: string;
  description: string;
  category: 'absorption' | 'foods' | 'cooking' | 'timing' | 'supplements' | 'lifestyle';
  severity: 'normal' | 'mild' | 'moderate' | 'severe' | 'all';
  icon: string;
}

export const nutritionItems: NutritionItem[] = [
  {
    id: '1',
    name: 'Lean Beef',
    ironContent: 2.6,
    vitaminC: false,
    category: 'meat',
    description: 'Excellent source of heme iron, easily absorbed by the body',
    servingSize: '100g',
    benefits: ['High bioavailability', 'Complete protein', 'Vitamin B12'],
    image: 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '2',
    name: 'Spinach',
    ironContent: 2.7,
    vitaminC: false,
    category: 'vegetables',
    description: 'Rich in non-heme iron and folate, essential for blood formation',
    servingSize: '100g cooked',
    benefits: ['High folate', 'Vitamin K', 'Antioxidants'],
    image: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '3',
    name: 'Lentils',
    ironContent: 3.3,
    vitaminC: false,
    category: 'legumes',
    description: 'Plant-based iron powerhouse with fiber and protein',
    servingSize: '100g cooked',
    benefits: ['High fiber', 'Plant protein', 'Folate'],
    image: 'https://images.pexels.com/photos/793785/pexels-photo-793785.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '4',
    name: 'Dark Chocolate',
    ironContent: 7.3,
    vitaminC: false,
    category: 'nuts',
    description: 'Surprisingly high in iron and antioxidants',
    servingSize: '30g (1 oz)',
    benefits: ['Antioxidants', 'Magnesium', 'Mood booster'],
    image: 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '5',
    name: 'Quinoa',
    ironContent: 1.5,
    vitaminC: false,
    category: 'grains',
    description: 'Complete protein grain with good iron content',
    servingSize: '100g cooked',
    benefits: ['Complete protein', 'Gluten-free', 'Fiber'],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '6',
    name: 'Tofu',
    ironContent: 2.7,
    vitaminC: false,
    category: 'legumes',
    description: 'Versatile soy product rich in iron and protein',
    servingSize: '100g',
    benefits: ['Plant protein', 'Calcium', 'Isoflavones'],
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '7',
    name: 'Pumpkin Seeds',
    ironContent: 8.8,
    vitaminC: false,
    category: 'nuts',
    description: 'Tiny seeds packed with iron and healthy fats',
    servingSize: '30g',
    benefits: ['Healthy fats', 'Magnesium', 'Zinc'],
    image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '8',
    name: 'Fortified Cereals',
    ironContent: 18.0,
    vitaminC: false,
    category: 'grains',
    description: 'Iron-fortified breakfast cereals for easy daily intake',
    servingSize: '30g',
    benefits: ['Fortified vitamins', 'B vitamins', 'Convenient'],
    image: 'https://images.pexels.com/photos/5938/food-breakfast-cereal-milk.jpg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '9',
    name: 'Oysters',
    ironContent: 5.1,
    vitaminC: false,
    category: 'meat',
    description: 'Shellfish with exceptional iron and zinc content',
    servingSize: '100g',
    benefits: ['High zinc', 'Vitamin B12', 'Low calories'],
    image: 'https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '10',
    name: 'Chickpeas',
    ironContent: 2.9,
    vitaminC: false,
    category: 'legumes',
    description: 'Versatile legume rich in iron and fiber',
    servingSize: '100g cooked',
    benefits: ['High fiber', 'Plant protein', 'Folate'],
    image: 'https://images.pexels.com/photos/6287525/pexels-photo-6287525.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '11',
    name: 'Bell Peppers',
    ironContent: 0.3,
    vitaminC: true,
    category: 'vegetables',
    description: 'High in vitamin C to enhance iron absorption',
    servingSize: '100g',
    benefits: ['Vitamin C', 'Antioxidants', 'Low calories'],
    image: 'https://images.pexels.com/photos/594137/pexels-photo-594137.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '12',
    name: 'Citrus Fruits',
    ironContent: 0.1,
    vitaminC: true,
    category: 'fruits',
    description: 'Vitamin C powerhouse for better iron absorption',
    servingSize: '1 medium orange',
    benefits: ['Vitamin C', 'Fiber', 'Folate'],
    image: 'https://images.pexels.com/photos/327098/pexels-photo-327098.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

export const nutritionTips: NutritionTip[] = [
  {
    id: '1',
    title: 'Combine Iron with Vitamin C',
    description: 'Eat iron-rich foods with vitamin C sources like citrus fruits, bell peppers, or tomatoes to enhance absorption by up to 300%.',
    category: 'absorption',
    severity: 'all',
    icon: '🍊'
  },
  {
    id: '2',
    title: 'Cook in Cast Iron',
    description: 'Cooking acidic foods like tomato sauce in cast iron cookware can increase the iron content of your meals.',
    category: 'cooking',
    severity: 'mild',
    icon: '🍳'
  },
  {
    id: '3',
    title: 'Avoid Tea and Coffee with Meals',
    description: 'Tannins in tea and coffee can reduce iron absorption by up to 60%. Drink them between meals instead.',
    category: 'timing',
    severity: 'moderate',
    icon: '☕'
  },
  {
    id: '4',
    title: 'Include Heme Iron Sources',
    description: 'Animal-based iron (heme iron) is absorbed 2-3 times better than plant-based iron. Include lean meats, fish, or poultry.',
    category: 'foods',
    severity: 'severe',
    icon: '🥩'
  },
  {
    id: '5',
    title: 'Soak and Sprout Legumes',
    description: 'Soaking beans and lentils overnight and sprouting them can reduce phytates that inhibit iron absorption.',
    category: 'cooking',
    severity: 'all',
    icon: '🫘'
  },
  {
    id: '6',
    title: 'Consider Iron Supplements',
    description: 'If dietary changes aren\'t enough, consult your doctor about iron supplements. Take them on an empty stomach with vitamin C.',
    category: 'supplements',
    severity: 'severe',
    icon: '💊'
  },
  {
    id: '7',
    title: 'Eat Iron-Rich Breakfast',
    description: 'Start your day with iron-fortified cereals, eggs, or smoothies with spinach to boost your daily iron intake.',
    category: 'timing',
    severity: 'all',
    icon: '🥣'
  },
  {
    id: '8',
    title: 'Manage Calcium Intake',
    description: 'While calcium is important, avoid taking calcium supplements with iron-rich meals as it can reduce iron absorption.',
    category: 'absorption',
    severity: 'moderate',
    icon: '🥛'
  }
];

export const vitaminCSources = [
  'Oranges and citrus fruits',
  'Bell peppers (especially red)',
  'Strawberries',
  'Kiwi fruit',
  'Broccoli',
  'Tomatoes',
  'Brussels sprouts',
  'Cantaloupe'
];