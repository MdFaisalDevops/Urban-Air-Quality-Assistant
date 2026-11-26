import React, { useMemo } from 'react';
import { FamilyProfile } from '../../types/routines';
import { CityStation } from '../../types/aqi';
import { RoutineService, GeneratedRoutineStep } from '../../services/routineService';
import { Sun, Car, Wind, Utensils, Moon, Shield, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

interface RoutineGeneratorProps {
  profile: FamilyProfile;
  city: CityStation;
}

const renderStepIcon = (iconType: GeneratedRoutineStep['iconType']): React.ReactNode => {
  switch (iconType) {
    case 'morning':
      return <Sun className="w-5 h-5 text-amber-500" />;
    case 'commute':
      return <Car className="w-5 h-5 text-blue-500" />;
    case 'venting':
      return <Wind className="w-5 h-5 text-emerald-500" />;
    case 'dinner':
      return <Utensils className="w-5 h-5 text-purple-500" />;
    case 'night':
      return <Moon className="w-5 h-5 text-indigo-500" />;
    default:
      return <Shield className="w-5 h-5 text-emerald-500" />;
  }
};

export const RoutineGenerator: React.FC<RoutineGeneratorProps> = ({ profile, city }) => {
  const routineSteps = useMemo(() => {
    return RoutineService.generateDailyRoutine(profile, city);
  }, [profile, city]);

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
        {routineSteps.map((step) => (
          <div
            key={step.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-5 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-3 mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-700 shadow-xs">
                  {renderStepIcon(step.iconType)}
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
