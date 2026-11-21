export type CommuteMode = 'metro' | 'bus' | 'car_solo' | 'carpool' | 'two_wheeler' | 'walk_cycle' | 'remote';
export type CookingFuel = 'lpg' | 'induction' | 'biomass_wood' | 'mixed';
export type HeatingType = 'electric_blower' | 'oil_radiator' | 'wood_coal_angithi' | 'none';

export interface FamilyProfile {
  cityName: string;
  familyMembersCount: number;
  hasInfants: boolean;
  hasSeniors: boolean;
  hasAsthmaRespiratory: boolean;
  hasPets: boolean;
  commuteMode: CommuteMode;
  cookingFuel: CookingFuel;
  heatingType: HeatingType;
  ventilationType: 'sealed' | 'cross_ventilated' | 'diy_filtered';
  dailyCommuteDistanceKm: number;
}

export interface HourlyRoutineStep {
  timeRange: string;     // e.g. "06:00 - 08:00 AM"
  activityName: string;
  riskLevel: 'Hazardous' | 'Caution' | 'Safe';
  standardRoutine: string;
  lowEmissionRoutine: string;
  indoorAirHack: string;
  whyThisMatters: string;
  icon: string;
}

export interface ImpactMetrics {
  dailyPm25InhalationAvoidedMicrograms: number;
  equivalentCigarettesAvoided: number;
  dailyCo2AvoidedKg: number;
  dailyParticulateEmissionAvertedGrams: number;
  monthlyMedicalCostSavedInr: number;
  communityScaleMultiplier: {
    tenHouseholdsPm25Grams: number;
    hundredHouseholdsCo2Kg: number;
  };
}
