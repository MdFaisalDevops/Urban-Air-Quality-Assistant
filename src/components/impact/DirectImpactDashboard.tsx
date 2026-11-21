import React, { useState } from 'react';
import { FamilyProfile } from '../../types/routines';
import { CityStation } from '../../types/aqi';
import { ImpactCalculator } from '../../services/impactCalculator';
import { Activity, Flame, ShieldAlert, Users, TrendingDown, DollarSign, Award } from 'lucide-react';

interface DirectImpactDashboardProps {
  profile: FamilyProfile;
  city: CityStation;
}

export const DirectImpactDashboard: React.FC<DirectImpactDashboardProps> = ({ profile, city }) => {
  const [communityHouses, setCommunityHouses] = useState<number>(50);

  const metrics = ImpactCalculator.calculateImpact(profile, city.pollutants.pm25);

  // Scaled calculations for community multiplier
  const communityMonthlyCo2Kg = Math.round((metrics.dailyCo2AvoidedKg * communityHouses * 30));
  const communityMonthlyPm25Kg = Number(((metrics.dailyParticulateEmissionAvertedGrams * communityHouses * 30) / 1000).toFixed(2));
  const communityMedicalSavingsInr = Math.round(metrics.monthlyMedicalCostSavedInr * communityHouses);

  return (
    <section aria-labelledby="direct-impact-heading" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm transition-colors mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h2 id="direct-impact-heading" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Direct Impact & Exposure Reduction Quantifier
            </h2>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
            Real-time scientific calculation of air pollution avoided, carbon mitigated, and health savings
          </p>
        </div>

        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
          <Award className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
          <span>Measurable ROI</span>
        </span>
      </div>

      {/* 4 Core Direct Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Metric 1: PM2.5 Inhalation Avoided */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                PM2.5 Kept Out of Lungs
              </span>
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {metrics.dailyPm25InhalationAvoidedMicrograms.toLocaleString()} <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">µg/day</span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
              Family total particulate blocked by room sealing, DIY purifier, and transit shielding.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/80 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            ✓ 85% exposure reduction
          </div>
        </div>

        {/* Metric 2: Berkeley Cigarette Equivalence */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Cigarette Equivalence Avoided
              </span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-800 dark:text-amber-400">
              {metrics.equivalentCigarettesAvoided} <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">cigs/day</span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
              Equivalent toxic smoke inhalation avoided per family member (Berkeley Earth standard).
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/80 text-[11px] font-semibold text-amber-800 dark:text-amber-400">
            ✓ Protects infant lung alveoli
          </div>
        </div>

        {/* Metric 3: Carbon Mitigation (CO2) */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Carbon Footprint Cut
              </span>
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400">
              {metrics.dailyCo2AvoidedKg} <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">kg CO₂/day</span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
              Via Metro/carpool commute substitution and electric induction cooking.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/80 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            ~{(metrics.dailyCo2AvoidedKg * 30).toFixed(0)} kg CO₂ averted monthly
          </div>
        </div>

        {/* Metric 4: Monthly Financial Savings */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Monthly Financial Relief
              </span>
              <DollarSign className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              ₹{metrics.monthlyMedicalCostSavedInr.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
              Estimated savings on petrol/diesel, doctor consultations, and nebulizers.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/80 text-[11px] font-semibold text-blue-700 dark:text-blue-400">
            ✓ Measurable household ROI
          </div>
        </div>
      </div>

      {/* Community Multiplier Interactive Scale */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900/10 via-teal-900/10 to-slate-900/10 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-slate-900/40 border border-emerald-200 dark:border-emerald-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Community Multiplier: What If Our Neighborhood Joins In?</span>
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Simulate the cumulative positive impact if multiple families in your apartment complex or society adopt these routines.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Active Households:</span>
            <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-black text-sm">
              {communityHouses} Families
            </span>
          </div>
        </div>

        {/* Community Slider */}
        <div className="mb-6">
          <input
            type="range"
            min="5"
            max="500"
            step="5"
            value={communityHouses}
            onChange={(e) => setCommunityHouses(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            aria-label="Neighborhood households participating in clean air practices"
          />
          <div className="flex justify-between text-[11px] text-slate-700 dark:text-slate-300 mt-1 font-semibold">
            <span>5 Families (One Floor)</span>
            <span>50 Families (Tower)</span>
            <span>250 Families (RWA Society)</span>
            <span>500 Families (Entire Sector)</span>
          </div>
        </div>

        {/* Cumulative Community Results */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs text-slate-700 dark:text-slate-300 block mb-1">Monthly Carbon Prevented</span>
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {(communityMonthlyCo2Kg / 1000).toFixed(2)} Tons CO₂
            </span>
            <span className="text-[10px] text-slate-700 dark:text-slate-300 block mt-1">
              Equivalent to planting {Math.round(communityMonthlyCo2Kg / 22)} urban trees!
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs text-slate-700 dark:text-slate-300 block mb-1">Particulate Kept From Air</span>
            <span className="text-2xl font-black text-amber-800 dark:text-amber-400">
              {communityMonthlyPm25Kg} kg PM2.5
            </span>
            <span className="text-[10px] text-slate-700 dark:text-slate-300 block mt-1">
              Prevented directly at source across society grounds.
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs text-slate-700 dark:text-slate-300 block mb-1">Total Community Savings</span>
            <span className="text-2xl font-black text-blue-700 dark:text-blue-400">
              ₹{(communityMedicalSavingsInr / 100000).toFixed(2)} Lakhs
            </span>
            <span className="text-[10px] text-slate-700 dark:text-slate-300 block mt-1">
              Monthly collective fuel and healthcare savings.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

