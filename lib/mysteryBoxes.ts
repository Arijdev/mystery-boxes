export interface MysteryBox {
  id: number;
  name: string;
  price: number;
  originalValue: number;
  category: string;
  image: string;
  description: string;
  items: string;
  rating: number;
  reviews: number;
  popular: boolean;
}

export const mysteryBoxes: MysteryBox[] = [
  {
    id: 1,
    name: "Gaming Legends Box",
    price: 3999.99,
    originalValue: 12000,
    category: "gaming",
    image: "/legend.png",
    description: "Epic gaming gear and collectibles",
    items: "5-7 items",
    rating: 4.8,
    reviews: 234,
    popular: true,
  },
  {
    id: 2,
    name: "Tech Innovator Box",
    price: 6399.99,
    originalValue: 16000,
    category: "tech",
    image: "/tech.png",
    description: "Latest gadgets and tech accessories",
    items: "4-6 items",
    rating: 4.9,
    reviews: 189,
    popular: false,
  },
  {
    id: 3,
    name: "Lifestyle Essentials Box",
    price: 2799.99,
    originalValue: 8000,
    category: "lifestyle",
    image: "/Lifestyle.png",
    description: "Curated lifestyle and wellness items",
    items: "6-8 items",
    rating: 4.7,
    reviews: 156,
    popular: false,
  },
  {
    id: 4,
    name: "Collector's Rare Box",
    price: 10399.99,
    originalValue: 32000,
    category: "collectibles",
    image: "/Collector.png",
    description: "Rare finds and limited edition items",
    items: "3-5 items",
    rating: 4.9,
    reviews: 98,
    popular: true,
  },
  {
    id: 5,
    name: "Fitness Power Box",
    price: 4799.99,
    originalValue: 14400,
    category: "fitness",
    image: "/Fitness.png",
    description: "Premium fitness and workout gear",
    items: "4-7 items",
    rating: 4.6,
    reviews: 203,
    popular: false,
  },
  {
    id: 6,
    name: "Artisan Craft Box",
    price: 3599.99,
    originalValue: 9600,
    category: "crafts",
    image: "/artisan.png",
    description: "Handcrafted items from local artisans",
    items: "5-8 items",
    rating: 4.8,
    reviews: 167,
    popular: false,
  },
];

// Helper function to get boxes by category
export const getBoxesByCategory = (category: string): MysteryBox[] => {
  if (category === "all") return mysteryBoxes;
  return mysteryBoxes.filter((box) => box.category === category);
};

// Helper function to get popular boxes
export const getPopularBoxes = (): MysteryBox[] => {
  return mysteryBoxes.filter((box) => box.popular);
};

// Helper function to get box by ID
export const getBoxById = (id: number): MysteryBox | undefined => {
  return mysteryBoxes.find((box) => box.id === id);
};
