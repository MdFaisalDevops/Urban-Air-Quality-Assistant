export interface IaqHack {
  id: string;
  title: string;
  category: 'diy_purifier' | 'ventilation' | 'cooking_heating' | 'natural_plants' | 'cleaning';
  costLevel: 'Free' | 'Low (₹200-₹500)' | 'Moderate (₹1,500-₹2,500)';
  cadrRatingCfm: number; // Clean Air Delivery Rate in CFM
  pm25ReductionPercent: number;
  setupTimeMinutes: number;
  description: string;
  materialsNeeded: string[];
  steps: string[];
  scientificMechanism: string;
  commonMistakesToAvoid: string[];
}

export interface SustainableAlternative {
  id: string;
  traditionalPractice: string;
  hazardExplanation: string;
  sustainableAlternative: string;
  communityImpact: string;
  co2ReductionKgPerMonth: number;
  pm25AvertedGrams: number;
  costComparison: string;
  badge: string;
}

export interface PlantRecommendation {
  name: string;
  scientificName: string;
  nasaScore: number; // 1-10
  pollutantsFiltered: string[];
  placement: string;
  maintenance: 'Very Low' | 'Low' | 'Medium';
  densityPerSqFt: string;
  childPetSafe: boolean;
  notes: string;
}
