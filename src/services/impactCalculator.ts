import { FamilyProfile, ImpactMetrics } from '../types/routines';

/**
 * Scientific Impact Calculator
 * Models direct exposure reduction, emissions prevented, and community amplification.
 * 
 * References:
 * - Berkeley Earth Air Pollution Equivalence: 1 cigarette ≈ 22 µg/m³ PM2.5 exposure per day.
 * - Central Pollution Control Board (CPCB) urban emission factors.
 * - WHO Air Quality Guidelines (2021).
 */
export class ImpactCalculator {
  // Average human daily breathing volume = ~12 m³ for adults, ~8 m³ for toddlers (higher rate per kg)
  private static ADULT_DAILY_AIR_VOLUME_M3 = 12.0;

  /**
   * Computes personalized direct impact based on current city AQI and family profile
   */
  public static calculateImpact(profile: FamilyProfile, currentPm25: number): ImpactMetrics {
    const familySize = Math.max(1, profile.familyMembersCount);
    const hasVulnerable = profile.hasInfants || profile.hasSeniors || profile.hasAsthmaRespiratory;

    // 1. Indoor Air Filtration & Hack Efficiency
    // A sealed room + DIY Corsi-Rosenthal or fan-HEPA reduces indoor PM2.5 by 80-88%
    let indoorReductionFactor = 0.50; // standard baseline
    if (profile.ventilationType === 'diy_filtered') {
      indoorReductionFactor = 0.85;
    } else if (profile.ventilationType === 'sealed') {
      indoorReductionFactor = 0.65;
    }

    // Daily ambient PM2.5 baseline dose without precautions (µg/day)
    // People spend ~18 hours indoors and ~6 hours in transit/outdoors
    const outdoorDosePerPerson = currentPm25 * (6 / 24) * this.ADULT_DAILY_AIR_VOLUME_M3;
    const unmitigatedIndoorDosePerPerson = currentPm25 * (18 / 24) * this.ADULT_DAILY_AIR_VOLUME_M3;
    const mitigatedIndoorDosePerPerson = unmitigatedIndoorDosePerPerson * (1 - indoorReductionFactor);

    // If commuter wears N95 and recirculates car AC or takes metro, transit dose drops by 75%
    const transitReductionFactor = (profile.commuteMode === 'metro' || profile.commuteMode === 'remote') ? 0.75 : 0.40;
    const mitigatedTransitDosePerPerson = outdoorDosePerPerson * (1 - transitReductionFactor);

    // Micrograms PM2.5 avoided per person per day
    const unmitigatedTotalDose = outdoorDosePerPerson + unmitigatedIndoorDosePerPerson;
    const mitigatedTotalDose = mitigatedTransitDosePerPerson + mitigatedIndoorDosePerPerson;
    const avoidedPerPerson = Math.max(0, unmitigatedTotalDose - mitigatedTotalDose);

    const totalFamilyPm25AvoidedMicrograms = Math.round(avoidedPerPerson * familySize);

    // Cigarette Equivalence:
    // Berkeley Earth standard: 22 µg/m³ ambient over 24h corresponds to ~264 µg inhaled per day per cigarette.
    const microgramPerCigarette = 264;
    const equivalentCigarettesAvoided = Number((avoidedPerPerson / microgramPerCigarette).toFixed(1));

    // 2. Daily Emissions Avoided at Source
    let dailyCo2AvoidedKg = 0;
    let dailyParticulateAvertedGrams = 0;

    // Commute substitution:
    const distanceKm = Math.max(5, profile.dailyCommuteDistanceKm || 15);
    if (profile.commuteMode === 'metro') {
      // Switching from solo petrol car (~150g CO2/km) to electric metro (~15g CO2/km)
      dailyCo2AvoidedKg += (distanceKm * 0.135);
      dailyParticulateAvertedGrams += (distanceKm * 0.018 * 2); // tailpipe + brake dust
    } else if (profile.commuteMode === 'carpool') {
      dailyCo2AvoidedKg += (distanceKm * 0.090);
      dailyParticulateAvertedGrams += (distanceKm * 0.012);
    } else if (profile.commuteMode === 'remote') {
      dailyCo2AvoidedKg += (distanceKm * 0.150);
      dailyParticulateAvertedGrams += (distanceKm * 0.020);
    }

    // Cooking substitution:
    if (profile.cookingFuel === 'induction') {
      dailyCo2AvoidedKg += 1.4; // avoids burning fossil gas / LPG
      dailyParticulateAvertedGrams += 0.8;
    }

    // Heating substitution:
    if (profile.heatingType === 'electric_blower' || profile.heatingType === 'oil_radiator') {
      dailyCo2AvoidedKg += 0.5;
      dailyParticulateAvertedGrams += 3.5; // Avoids wood/coal angithi particulate
    }

    // 3. Health & Financial Savings
    // Avoided nebulizer sessions, specialist consultations, and lost workdays
    let baseMonthlyMedicalSavings = 1200;
    if (hasVulnerable) {
      baseMonthlyMedicalSavings += 2200; // Pediatrician or pulmonologist visits averted
    }
    const fuelSavings = profile.commuteMode === 'metro' ? 2800 : profile.commuteMode === 'carpool' ? 1400 : 0;
    const monthlyMedicalCostSavedInr = baseMonthlyMedicalSavings + fuelSavings;

    // 4. Community Multipliers
    const tenHouseholdsPm25Grams = Number(((dailyParticulateAvertedGrams * 10 * 30) / 1000).toFixed(2));
    const hundredHouseholdsCo2Kg = Math.round(dailyCo2AvoidedKg * 100 * 30);

    return {
      dailyPm25InhalationAvoidedMicrograms: totalFamilyPm25AvoidedMicrograms,
      equivalentCigarettesAvoided,
      dailyCo2AvoidedKg: Number(dailyCo2AvoidedKg.toFixed(2)),
      dailyParticulateEmissionAvertedGrams: Number(dailyParticulateAvertedGrams.toFixed(2)),
      monthlyMedicalCostSavedInr,
      communityScaleMultiplier: {
        tenHouseholdsPm25Grams,
        hundredHouseholdsCo2Kg,
      },
    };
  }

  /**
   * Explains the direct impact in simple, family-friendly language
   */
  public static getImpactSummaryText(metrics: ImpactMetrics, cityName: string): string {
    return `By adopting these daily routines and indoor hacks in ${cityName}, your household prevents the inhalation of ${metrics.dailyPm25InhalationAvoidedMicrograms.toLocaleString()} µg of toxic PM2.5 daily (equivalent to avoiding smoking ${metrics.equivalentCigarettesAvoided} cigarettes per family member each day!). Furthermore, your commute and cooking choices reduce ${metrics.dailyCo2AvoidedKg} kg of CO2 and save approximately ₹${metrics.monthlyMedicalCostSavedInr.toLocaleString()} monthly in fuel and medical costs.`;
  }
}

