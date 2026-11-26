import { describe, it, expect } from 'vitest';
import { RoutineService } from '../services/routineService';
import { INDIAN_CITIES_STATIONS } from '../data/citiesData';
import { FamilyProfile } from '../types/routines';

describe('RoutineService Domain Logic', () => {
  const delhi = INDIAN_CITIES_STATIONS.find((c) => c.id === 'delhi-anand-vihar')!;
  const bengaluru = INDIAN_CITIES_STATIONS.find((c) => c.id === 'bengaluru-btm')!;

  const vulnerableProfile: FamilyProfile = {
    hasInfants: true,
    hasSeniors: true,
    hasAsthmaRespiratory: true,
    commuteMode: 'two-wheeler',
    cookingFuel: 'lpg',
    housingType: 'apartment',
    currentAirPurifier: 'none',
  };

  const cleanProfile: FamilyProfile = {
    hasInfants: false,
    hasSeniors: false,
    hasAsthmaRespiratory: false,
    commuteMode: 'metro',
    cookingFuel: 'induction',
    housingType: 'independent',
    currentAirPurifier: 'hepa',
  };

  it('generates 5 sequential routine steps covering 24-hour cycle', () => {
    const routine = RoutineService.generateDailyRoutine(vulnerableProfile, delhi);
    expect(routine).toHaveLength(5);

    const stepIds = routine.map((r) => r.id);
    expect(stepIds).toEqual([
      'step-morning-routine',
      'step-school-commute',
      'step-solar-venting',
      'step-dinner-cooking',
      'step-night-sanctuary',
    ]);
  });

  it('adapts morning routine advice based on severe vs moderate AQI', () => {
    // Delhi has severe AQI (> 200)
    const delhiRoutine = RoutineService.generateDailyRoutine(vulnerableProfile, delhi);
    const morningStepDelhi = delhiRoutine.find((s) => s.id === 'step-morning-routine')!;
    expect(morningStepDelhi.risk).toBe('Hazardous Outdoors');
    expect(morningStepDelhi.lowEmissionRoutine).toContain('Indoor stretching, yoga');

    // Bengaluru has lower AQI (< 200)
    const blrRoutine = RoutineService.generateDailyRoutine(vulnerableProfile, bengaluru);
    const morningStepBlr = blrRoutine.find((s) => s.id === 'step-morning-routine')!;
    expect(morningStepBlr.risk).toBe('Moderate');
    expect(morningStepBlr.lowEmissionRoutine).toContain('Outdoor jog safe in parks');
  });

  it('customizes commute advice according to commuteMode', () => {
    const metroRoutine = RoutineService.generateDailyRoutine(cleanProfile, delhi);
    const commuteStep = metroRoutine.find((s) => s.id === 'step-school-commute')!;
    expect(commuteStep.lowEmissionRoutine).toContain('electric Metro Rail');

    const carpoolProfile: FamilyProfile = { ...cleanProfile, commuteMode: 'carpool' };
    const carpoolRoutine = RoutineService.generateDailyRoutine(carpoolProfile, delhi);
    expect(carpoolRoutine.find((s) => s.id === 'step-school-commute')!.lowEmissionRoutine).toContain('school carpool cluster');
  });

  it('customizes vulnerable family indoor protection in commute step', () => {
    const vulnRoutine = RoutineService.generateDailyRoutine(vulnerableProfile, delhi);
    const commuteStep = vulnRoutine.find((s) => s.id === 'step-school-commute')!;
    expect(commuteStep.indoorHack).toContain('FFP2/N95 masks');
  });

  it('tailors cooking advice for induction vs lpg gas users', () => {
    const lpgRoutine = RoutineService.generateDailyRoutine(vulnerableProfile, delhi);
    const dinnerStepLpg = lpgRoutine.find((s) => s.id === 'step-dinner-cooking')!;
    expect(dinnerStepLpg.lowEmissionRoutine).toContain('Run kitchen exhaust fan for 10 minutes');

    const inductionRoutine = RoutineService.generateDailyRoutine(cleanProfile, delhi);
    const dinnerStepInduction = inductionRoutine.find((s) => s.id === 'step-dinner-cooking')!;
    expect(dinnerStepInduction.lowEmissionRoutine).toContain('Induction Cooktop');
  });
});
