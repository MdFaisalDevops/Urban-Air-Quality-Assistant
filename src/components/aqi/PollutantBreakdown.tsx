import React from 'react';
import { PollutantValues } from '../../types/aqi';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface PollutantBreakdownProps {
  pollutants: PollutantValues;
}

interface PollutantConfig {
  key: keyof PollutantValues;
  name: string;
  formula: string;
  unit: string;
  cpcbStandard: number;
  description: string;
  healthImpact: string;
}

const POLLUTANT_CONFIGS: PollutantConfig[] = [
  {
    key: 'pm25',
    name: 'Fine Particulate Matter',
    formula: 'PM2.5',
    unit: 'µg/m³',
    cpcbStandard: 60,
    description: 'Microscopic particles < 2.5µm that bypass nasal cilia, penetrate deep lung alveoli, and enter arterial circulation.',
    healthImpact: 'Causes acute asthma, cardiovascular stress, chronic bronchitis, and systemic inflammation.',
  },
  {
    key: 'pm10',
    name: 'Coarse Particulate Matter',
    formula: 'PM10',
    unit: 'µg/m³',
    cpcbStandard: 100,
    description: 'Inhalable dust, construction debris, road dust re-suspension, and soot < 10µm in aerodynamic diameter.',
    healthImpact: 'Irritates upper airways, triggers morning phlegm, coughing fits, and corneal conjunctivitis.',
  },
  {
    key: 'no2',
    name: 'Nitrogen Dioxide',
    formula: 'NO₂',
    unit: 'µg/m³',
    cpcbStandard: 80,
    description: 'Toxic red-brown combustion gas emitted by diesel vehicle exhausts and unvented gas cookstoves.',
    healthImpact: 'Constricts airways, increases sensitivity to aero-allergens, and worsens pediatric lung development.',
  },
  {
    key: 'so2',
    name: 'Sulphur Dioxide',
    formula: 'SO₂',
    unit: 'µg/m³',
    cpcbStandard: 80,
    description: 'Pungent acidic gas from coal power generation, brick kilns, and high-sulphur industrial diesel fuels.',
    healthImpact: 'Causes sudden bronchoconstriction, throat irritation, and chest tightness in asthmatics.',
  },
  {
    key: 'co',
    name: 'Carbon Monoxide',
    formula: 'CO',
    unit: 'mg/m³',
    cpcbStandard: 2.0,
    description: 'Colorless, odorless asphyxiant gas from smoldering biomass, trash burning, and idling motor exhausts.',
    healthImpact: 'Binds with hemoglobin to form carboxyhemoglobin, starving the brain and heart tissues of vital oxygen.',
  },
  {
    key: 'o3',
    name: 'Ground-Level Ozone',
    formula: 'O₃',
    unit: 'µg/m³',
    cpcbStandard: 100,
    description: 'Secondary photochemical pollutant formed when sunlight reacts with nitrogen oxides and vehicle VOC emissions.',
    healthImpact: 'Causes deep lung pain during deep inhalation, reduces lung capacity, and damages respiratory epithelial lining.',
  },
];

export const PollutantBreakdown: React.FC<PollutantBreakdownProps> = ({ pollutants }) => {
  return (
    <section aria-labelledby="pollutants-breakdown-heading" className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 id="pollutants-breakdown-heading" className="text-xl font-bold text-slate-900 dark:text-white">
            Comprehensive Pollutant Breakdown
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Compared against National Ambient Air Quality Standards (NAAQS / CPCB 24-hr benchmarks)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {POLLUTANT_CONFIGS.map((config) => {
          const value = pollutants[config.key] ?? 0;
          const ratio = value / config.cpcbStandard;
          const isElevated = ratio > 1.0;
          const isSevere = ratio > 2.5;

          const statusColor = isSevere
            ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-700'
            : isElevated
            ? 'text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700'
            : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700';

          const barColor = isSevere
            ? 'bg-red-500'
            : isElevated
            ? 'bg-amber-500'
            : 'bg-emerald-500';

          const percentageOfStandard = Math.min(250, Math.round(ratio * 100));

          return (
            <div
              key={config.key}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-lg font-black text-slate-900 dark:text-white mr-1.5">
                      {config.formula}
                    </span>
                    <span className="text-xs text-slate-700 dark:text-slate-300">
                      {config.name}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border flex items-center space-x-1 ${statusColor}`}>
                    {isElevated ? <AlertCircle className="w-3 h-3 mr-0.5" /> : <CheckCircle2 className="w-3 h-3 mr-0.5" />}
                    <span>{ratio.toFixed(1)}x Limit</span>
                  </span>
                </div>

                <div className="mt-3 flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {value}
                  </span>
                  <span className="text-xs text-slate-700 dark:text-slate-300">{config.unit}</span>
                  <span className="text-xs text-slate-700 dark:text-slate-300 ml-auto">
                    CPCB Safe Limit: <strong>{config.cpcbStandard} {config.unit}</strong>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${Math.min(100, (percentageOfStandard / 250) * 100)}%` }}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={config.cpcbStandard * 2.5}
                    aria-label={`${config.name} concentration level`}
                  />
                </div>

                <p className="mt-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {config.description}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-slate-200">Health Impact:</strong> {config.healthImpact}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

