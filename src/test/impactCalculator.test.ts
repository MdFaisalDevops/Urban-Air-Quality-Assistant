import { describe, it, expect } from 'vitest';
import { ImpactCalculator } from '../services/impactCalculator';
import { FamilyProfile } from '../types/routines';

describe('ImpactCalculator (Direct Impact Quantification)', () => {
  const sampleProfile: FamilyProfile = {
    cityName: 'Delhi - Anand Vihar',
    familyMembersCount: 4,
    hasInfants: true,
    hasSeniors: true,
    hasAsthmaRespiratory: false,
    hasPets: false,
    commuteMode: 'metro',
    cookingFuel: 'induction',
    heatingType: 'electric_blower',
    ventilationType: 'diy_filtered',
    dailyCommuteDistanceKm: 20,
  };

  it('should calculate PM2.5 inhalation avoided for a family in high AQI', () => {
    const currentPm25 = 380; // Severe Delhi winter smog
    const metrics = ImpactCalculator.calculateImpact(sampleProfile, currentPm25);

    expect(metrics.dailyPm25InhalationAvoidedMicrograms).toBeGreaterThan(0);
    // 4 members should avoid thousands of micrograms per day
    expect(metrics.dailyPm25InhalationAvoidedMicrograms).toBeGreaterThan(5000);
  });

  it('should compute cigarette equivalence based on Berkeley Earth 22 µg/m³ standard', () => {
    const currentPm25 = 300;
    const metrics = ImpactCalculator.calculateImpact(sampleProfile, currentPm25);

    expect(metrics.equivalentCigarettesAvoided).toBeGreaterThan(0);
    expect(typeof metrics.equivalentCigarettesAvoided).toBe('number');
  });

  it('should calculate positive CO2 reduction when using electric Metro vs solo car', () => {
    const metricsMetro = ImpactCalculator.calculateImpact(sampleProfile, 250);

    const soloCarProfile: FamilyProfile = {
      ...sampleProfile,
      commuteMode: 'car_solo',
      cookingFuel: 'lpg',
    };
    const metricsCar = ImpactCalculator.calculateImpact(soloCarProfile, 250);

    expect(metricsMetro.dailyCo2AvoidedKg).toBeGreaterThan(metricsCar.dailyCo2AvoidedKg);
  });

  it('should correctly scale impact across 10 and 100 community households', () => {
    const metrics = ImpactCalculator.calculateImpact(sampleProfile, 250);

    expect(metrics.communityScaleMultiplier.hundredHouseholdsCo2Kg).toBeGreaterThan(0);
    expect(metrics.communityScaleMultiplier.hundredHouseholdsCo2Kg).toBe(
      Math.round(metrics.dailyCo2AvoidedKg * 100 * 30)
    );
  });

  it('should generate an informative, family-friendly summary text', () => {
    const metrics = ImpactCalculator.calculateImpact(sampleProfile, 350);
    const summary = ImpactCalculator.getImpactSummaryText(metrics, 'Delhi');

    expect(summary).toContain('Delhi');
    expect(summary).toContain('cigarettes per family member');
    expect(summary).toContain('CO2');
  });
});

