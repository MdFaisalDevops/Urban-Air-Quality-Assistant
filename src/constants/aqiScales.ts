import { AqiCategory, AqiScaleDefinition } from '../types/aqi';

export const CPCB_AQI_SCALES: Record<AqiCategory, AqiScaleDefinition> = {
  Good: {
    min: 0,
    max: 50,
    category: 'Good',
    colorHex: '#10B981', // green-500
    bgHex: '#ECFDF5',
    textClass: 'text-emerald-700 dark:text-emerald-300',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/60',
    borderClass: 'border-emerald-300 dark:border-emerald-700',
    healthImplications: 'Minimal impact. Air quality is considered satisfactory.',
    cautionaryStatement: 'Ideal for all outdoor activities, natural ventilation, and sports.',
    familyAdvice: {
      children: 'Safe for all outdoor play and sports.',
      seniors: 'Safe for morning/evening walks.',
      general: 'Great day to ventilate indoor living spaces.',
    },
  },
  Satisfactory: {
    min: 51,
    max: 100,
    category: 'Satisfactory',
    colorHex: '#84CC16', // lime-500
    bgHex: '#F7FEE7',
    textClass: 'text-lime-700 dark:text-lime-300',
    bgClass: 'bg-lime-50 dark:bg-lime-950/60',
    borderClass: 'border-lime-300 dark:border-lime-700',
    healthImplications: 'Minor breathing discomfort to sensitive people.',
    cautionaryStatement: 'Unusually sensitive individuals should consider limiting prolonged outdoor exertion.',
    familyAdvice: {
      children: 'Normal outdoor activities permitted.',
      seniors: 'Slight caution if experiencing seasonal cough.',
      general: 'Keep windows open during afternoon warmth.',
    },
  },
  Moderate: {
    min: 101,
    max: 200,
    category: 'Moderate',
    colorHex: '#F59E0B', // amber-500
    bgHex: '#FFFBEB',
    textClass: 'text-amber-700 dark:text-amber-300',
    bgClass: 'bg-amber-50 dark:bg-amber-950/60',
    borderClass: 'border-amber-300 dark:border-amber-700',
    healthImplications: 'Breathing discomfort to the people with lungs, asthma and heart diseases.',
    cautionaryStatement: 'Children and older adults should reduce heavy or prolonged outdoor exertion.',
    familyAdvice: {
      children: 'Limit strenuous outdoor games past 6 PM.',
      seniors: 'Avoid cold early morning walks; switch to afternoon.',
      general: 'Run DIY air purifiers in bedrooms on low CADR.',
    },
  },
  Poor: {
    min: 201,
    max: 300,
    category: 'Poor',
    colorHex: '#F97316', // orange-500
    bgHex: '#FFF7ED',
    textClass: 'text-orange-700 dark:text-orange-300',
    bgClass: 'bg-orange-50 dark:bg-orange-950/60',
    borderClass: 'border-orange-300 dark:border-orange-700',
    healthImplications: 'Breathing discomfort to most people on prolonged exposure.',
    cautionaryStatement: 'Everyone should reduce outdoor activities. Keep doors and windows closed in morning/night.',
    familyAdvice: {
      children: 'Avoid outdoor morning sports assemblies at school.',
      seniors: 'Stay indoors; keep emergency bronchodilators accessible.',
      general: 'Wear N95/FFP2 masks if commuting on two-wheelers.',
    },
  },
  'Very Poor': {
    min: 301,
    max: 400,
    category: 'Very Poor',
    colorHex: '#EF4444', // red-500
    bgHex: '#FEF2F2',
    textClass: 'text-rose-700 dark:text-rose-300',
    bgClass: 'bg-rose-50 dark:bg-rose-950/60',
    borderClass: 'border-rose-300 dark:border-rose-700',
    healthImplications: 'Respiratory illness to the people on prolonged exposure. Significant risk to infants.',
    cautionaryStatement: 'Avoid outdoor activities. Strict indoor air filtration advised.',
    familyAdvice: {
      children: 'Strictly avoid outdoor sports; use air filters in nurseries.',
      seniors: 'Do not step outdoors during early morning smog spikes.',
      general: 'Seal window gaps with foam tape or wet towels; wet-mop floors only.',
    },
  },
  Severe: {
    min: 401,
    max: 500,
    category: 'Severe',
    colorHex: '#991B1B', // red-800
    bgHex: '#450A0A',
    textClass: 'text-red-900 dark:text-red-200',
    bgClass: 'bg-red-100 dark:bg-red-950/80',
    borderClass: 'border-red-400 dark:border-red-600',
    healthImplications: 'Affects healthy people and seriously impacts those with existing diseases.',
    cautionaryStatement: 'Health emergency alert. Physical outdoor activity strictly restricted.',
    familyAdvice: {
      children: 'School closures / shift to online classes advised; run HEPA 24x7.',
      seniors: 'Continuous indoor isolation in sealed, purified room.',
      general: 'N95 mandatory if stepping out. Avoid all open-flame cooking without exhaust.',
    },
  },
  Hazardous: {
    min: 501,
    max: 999,
    category: 'Hazardous',
    colorHex: '#581C87', // purple-900
    bgHex: '#3B0764',
    textClass: 'text-purple-900 dark:text-purple-200',
    bgClass: 'bg-purple-100 dark:bg-purple-950/90',
    borderClass: 'border-purple-400 dark:border-purple-700',
    healthImplications: 'Severe toxic smog inversion. General public may experience severe eye and throat burning.',
    cautionaryStatement: 'Full emergency mode. Stay sealed in purified indoor zones.',
    familyAdvice: {
      children: 'Extreme danger. Keep in high-CADR purified room.',
      seniors: 'Continuous pulse oximeter monitoring if respiratory history.',
      general: 'Community action: zero open fires, carpool only for emergency trips.',
    },
  },
};

export function getAqiCategory(aqi: number): AqiCategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  if (aqi <= 500) return 'Severe';
  return 'Hazardous';
}

export function getAqiScaleInfo(aqi: number): AqiScaleDefinition {
  const category = getAqiCategory(aqi);
  return CPCB_AQI_SCALES[category];
}
