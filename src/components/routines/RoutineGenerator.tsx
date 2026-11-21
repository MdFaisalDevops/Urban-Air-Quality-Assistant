import React from 'react';
import { FamilyProfile } from '../../types/routines';
import { CityStation } from '../../types/aqi';
import { Sun, Car, Wind, Utensils, Moon, Shield, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

interface RoutineGeneratorProps {
  profile: FamilyProfile;
  city: CityStation;
}

export const RoutineGenerator: React.FC<RoutineGeneratorProps> = ({ profile, city }) => {
  const isHighAqi = city.currentAqi > 200;

  const routineSteps = [
    {
      timeRange: '06:00 AM – 08:00 AM',
      title: 'Morning Awakening & Physical Routine',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      standardRoutine: 'Early morning brisk jog or outdoor morning walk in the park; dry broom sweeping the living room.',
      lowEmissionRoutine: isHighAqi
        ? 'Indoor stretching, yoga, or treadmill exercise. Shift outdoor activities to 1:30 PM.'
        : 'Outdoor jog safe in parks away from arterial traffic corridors.',
      indoorHack: 'Strictly use damp microfiber mopping (pocha) with warm water. Ban dry brooms which fling PM2.5 up to child lung level.',
      impactReason: 'Morning thermal inversion traps night diesel and biomass smog within 100m of ground level. Morning exercise increases ventilation rate by 400%, forcing particulate deep into lung alveoli.',
      risk: isHighAqi ? 'Hazardous Outdoors' : 'Moderate',
    },
    {
      timeRange: '08:00 AM – 09:30 AM',
      title: 'School Run & Daily Commute',
      icon: <Car className="w-5 h-5 text-blue-500" />,
      standardRoutine: 'Solo driving in bumper-to-bumper traffic with outside air intake on; waiting with idling engine outside school gate.',
      lowEmissionRoutine: profile.commuteMode === 'metro'
        ? 'Taking electric Metro Rail with N95 mask for walking portions.'
        : profile.commuteMode === 'carpool'
        ? 'Shared 4-parent school carpool cluster; engine turned OFF during wait.'
        : 'Engage Car AC "Recirculate Mode" immediately; do not lower windows.',
      indoorHack: 'Equip children with snug FFP2/N95 masks; avoid porous cloth or surgical masks that offer zero PM2.5 seal.',
      impactReason: 'Exhaust from idling cars creates intense local toxic plumes at 3 feet height. Car recirculation mode drops interior PM2.5 by 65%. Commute shifting saves up to 4.2 kg CO2 daily.',
      risk: 'High Traffic Exposure',
    },
    {
      timeRange: '01:00 PM – 03:00 PM',
      title: 'Safe Solar Venting Window',
      icon: <Wind className="w-5 h-5 text-emerald-500" />,
      standardRoutine: 'Keeping windows closed all day long or opening them blindly during the morning smog hours.',
      lowEmissionRoutine: 'Open opposing windows for exactly 15 to 20 minutes to cross-ventilate indoor living spaces.',
      indoorHack: 'Take advantage of midday solar heating that breaks the nocturnal inversion layer. Flush stale CO2, kitchen moisture, and indoor VOCs.',
      impactReason: 'Midday sun lifts the atmospheric mixing boundary layer to 1,200m, dispersing surface smog. Prevents indoor CO2 build-up exceeding 1,600 ppm.',
      risk: 'Safe Window',
    },
    {
      timeRange: '06:30 PM – 08:30 PM',
      title: 'Evening Dinner & Cooking Cleanliness',
      icon: <Utensils className="w-5 h-5 text-purple-500" />,
      standardRoutine: 'High-heat frying with LPG gas stove without turning on exhaust chimney; burning agarbatti or dhoop for evening prayer.',
      lowEmissionRoutine: profile.cookingFuel === 'induction'
        ? 'Cooking with Induction Cooktop with covered lids; exhaust fan turned on 2 minutes prior.'
        : 'Run kitchen exhaust fan for 10 minutes after cooking; keep kitchen door shut.',
      indoorHack: 'Replace scented dhoop and mosquito coils with smoke-free reed diffusers, LED prayer lamps, and magnetic window insect screens.',
      impactReason: 'LPG combustion and incense emit up to 350 µg/m³ of ultrafine soot and NO2. A single mosquito coil equals 75-100 cigarettes in PM2.5 output.',
      risk: 'High Indoor Spike Risk',
    },
    {
      timeRange: '09:00 PM – 11:00 PM',
      title: 'Night Bedroom Air Sanctuary',
      icon: <Moon className="w-5 h-5 text-indigo-500" />,
      standardRoutine: 'Sleeping with doors unsealed and burning a mosquito coil or unvented coal angithi for warmth.',
      lowEmissionRoutine: 'Run DIY Corsi-Rosenthal / HEPA fan filter on medium speed; door draft stopped with foam or rolled towel.',
      indoorHack: 'Place 2 Snake Plants (Sansevieria) in bedroom—their Crassulacean Acid Metabolism (CAM) absorbs CO2 and releases oxygen throughout the night.',
      impactReason: 'Night temperature drop locks surface pollution until 9 AM. Running an indoor purifier maintains bedroom PM2.5 < 25 µg/m³ for restorative sleep.',
      risk: 'Restorative Sleep Mode',
    },
  ];

  return (
    <section aria-labelledby="routine-generator-heading" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h2 id="routine-generator-heading" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Personalized Low-Emission Daily Routine
            </h2>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
            Tailored for {city.name} (AQI {city.currentAqi}) • {profile.familyMembersCount} Family Members ({profile.hasInfants ? '👶 Infant' : ''} {profile.hasSeniors ? '👴 Senior' : ''} {profile.hasAsthmaRespiratory ? '🫁 Asthmatic' : ''})
          </p>
        </div>

        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
          <span>Dynamically Optimized</span>
        </span>
      </div>

      {/* Routine Timeline Cards */}
      <div className="space-y-4">
        {routineSteps.map((step, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-5 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-3 mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-700 shadow-xs">
                  {step.icon}
                </div>
                <div>
                  <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase block">
                    {step.timeRange}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold self-start sm:self-auto ${
                step.risk.includes('Safe')
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : step.risk.includes('Hazardous')
                  ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {step.risk}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* High-Exposure Default Routine */}
              <div className="p-3.5 rounded-xl bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60">
                <span className="font-bold text-red-900 dark:text-red-300 flex items-center space-x-1 mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  <span>Standard High-Exposure Practice:</span>
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {step.standardRoutine}
                </p>
              </div>

              {/* Low-Emission Shielded Alternative */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center space-x-1 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Low-Emission & Shielded Alternative:</span>
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {step.lowEmissionRoutine}
                </p>
              </div>
            </div>

            {/* Indoor Air Hack & Impact Reason */}
            <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start space-x-2 text-slate-700 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white">Indoor Air Hack:</strong> {step.indoorHack}
                </div>
              </div>

              <div className="flex items-start space-x-2 text-slate-700 dark:text-slate-300">
                <Shield className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white">Why This Choice Matters:</strong> {step.impactReason}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
