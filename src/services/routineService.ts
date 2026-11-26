import { FamilyProfile } from '../types/routines';
import { CityStation } from '../types/aqi';

export type RoutineRiskLevel = 'Hazardous Outdoors' | 'Moderate' | 'High Traffic Exposure' | 'Safe Window' | 'High Indoor Spike Risk' | 'Restorative Sleep Mode';

export interface GeneratedRoutineStep {
  id: string;
  timeRange: string;
  title: string;
  iconType: 'morning' | 'commute' | 'venting' | 'dinner' | 'night';
  standardRoutine: string;
  lowEmissionRoutine: string;
  indoorHack: string;
  impactReason: string;
  risk: RoutineRiskLevel;
}

/**
 * Pure Domain Service for generating personalized low-emission daily routines
 * Decouples routine logic from UI rendering for maximum testability and maintainability.
 */
export class RoutineService {
  /**
   * Generates a contextually optimized daily schedule based on current city air quality
   * and family lifestyle parameters.
   */
  public static generateDailyRoutine(
    profile: FamilyProfile,
    city: CityStation
  ): GeneratedRoutineStep[] {
    const isSevereAqi = city.currentAqi > 200;
    const hasVulnerable = profile.hasInfants || profile.hasSeniors || profile.hasAsthmaRespiratory;

    return [
      {
        id: 'step-morning-routine',
        timeRange: '06:00 AM – 08:00 AM',
        title: 'Morning Awakening & Physical Routine',
        iconType: 'morning',
        standardRoutine: 'Early morning brisk jog or outdoor morning walk in the park; dry broom sweeping the living room.',
        lowEmissionRoutine: isSevereAqi
          ? 'Indoor stretching, yoga, or treadmill exercise. Shift outdoor activities to 1:30 PM.'
          : 'Outdoor jog safe in parks away from arterial traffic corridors.',
        indoorHack: 'Strictly use damp microfiber mopping (pocha) with warm water. Ban dry brooms which fling PM2.5 up to child lung level.',
        impactReason: 'Morning thermal inversion traps night diesel and biomass smog within 100m of ground level. Morning exercise increases ventilation rate by 400%, forcing particulate deep into lung alveoli.',
        risk: isSevereAqi ? 'Hazardous Outdoors' : 'Moderate',
      },
      {
        id: 'step-school-commute',
        timeRange: '08:00 AM – 09:30 AM',
        title: 'School Run & Daily Commute',
        iconType: 'commute',
        standardRoutine: 'Solo driving in bumper-to-bumper traffic with outside air intake on; waiting with idling engine outside school gate.',
        lowEmissionRoutine: profile.commuteMode === 'metro'
          ? 'Taking electric Metro Rail with N95 mask for walking portions.'
          : profile.commuteMode === 'carpool'
          ? 'Shared 4-parent school carpool cluster; engine turned OFF during wait.'
          : 'Engage Car AC "Recirculate Mode" immediately; do not lower windows.',
        indoorHack: hasVulnerable
          ? 'Equip children and seniors with snug FFP2/N95 masks; avoid porous cloth or surgical masks that offer zero PM2.5 seal.'
          : 'Ensure cabin air filter has active carbon layer; replace every 6 months.',
        impactReason: 'Exhaust from idling cars creates intense local toxic plumes at 3 feet height. Car recirculation mode drops interior PM2.5 by 65%. Commute shifting saves up to 4.2 kg CO2 daily.',
        risk: 'High Traffic Exposure',
      },
      {
        id: 'step-solar-venting',
        timeRange: '01:00 PM – 03:00 PM',
        title: 'Safe Solar Venting Window',
        iconType: 'venting',
        standardRoutine: 'Keeping windows closed all day long or opening them blindly during the morning smog hours.',
        lowEmissionRoutine: 'Open opposing windows for exactly 15 to 20 minutes to cross-ventilate indoor living spaces.',
        indoorHack: 'Take advantage of midday solar heating that breaks the nocturnal inversion layer. Flush stale CO2, kitchen moisture, and indoor VOCs.',
        impactReason: 'Midday sun lifts the atmospheric mixing boundary layer to 1,200m, dispersing surface smog. Prevents indoor CO2 build-up exceeding 1,600 ppm.',
        risk: 'Safe Window',
      },
      {
        id: 'step-dinner-cooking',
        timeRange: '06:30 PM – 08:30 PM',
        title: 'Evening Dinner & Cooking Cleanliness',
        iconType: 'dinner',
        standardRoutine: 'High-heat frying with LPG gas stove without turning on exhaust chimney; burning agarbatti or dhoop for evening prayer.',
        lowEmissionRoutine: profile.cookingFuel === 'induction'
          ? 'Cooking with Induction Cooktop with covered lids; exhaust fan turned on 2 minutes prior.'
          : 'Run kitchen exhaust fan for 10 minutes after cooking; keep kitchen door shut.',
        indoorHack: 'Replace scented dhoop and mosquito coils with smoke-free reed diffusers, LED prayer lamps, and magnetic window insect screens.',
        impactReason: 'LPG combustion and incense emit up to 350 µg/m³ of ultrafine soot and NO2. A single mosquito coil equals 75-100 cigarettes in PM2.5 output.',
        risk: 'High Indoor Spike Risk',
      },
      {
        id: 'step-night-sanctuary',
        timeRange: '09:00 PM – 11:00 PM',
        title: 'Night Bedroom Air Sanctuary',
        iconType: 'night',
        standardRoutine: 'Sleeping with doors unsealed and burning a mosquito coil or unvented coal angithi for warmth.',
        lowEmissionRoutine: 'Run DIY Corsi-Rosenthal / HEPA fan filter on medium speed; door draft stopped with foam or rolled towel.',
        indoorHack: 'Place 2 Snake Plants (Sansevieria) in bedroom—their Crassulacean Acid Metabolism (CAM) absorbs CO2 and releases oxygen throughout the night.',
        impactReason: 'Night temperature drop locks surface pollution until 9 AM. Running an indoor purifier maintains bedroom PM2.5 < 25 µg/m³ for restorative sleep.',
        risk: 'Restorative Sleep Mode',
      },
    ];
  }
}
