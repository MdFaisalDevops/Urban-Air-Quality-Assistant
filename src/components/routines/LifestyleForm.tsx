import React from 'react';
import { FamilyProfile, CommuteMode, CookingFuel, HeatingType } from '../../types/routines';
import { Users, Baby, HeartPulse, Dog, Car, Flame, Heater, Wind } from 'lucide-react';

interface LifestyleFormProps {
  profile: FamilyProfile;
  onChangeProfile: (updated: FamilyProfile) => void;
}

export const LifestyleForm: React.FC<LifestyleFormProps> = ({ profile, onChangeProfile }) => {
  const updateField = <K extends keyof FamilyProfile>(key: K, value: FamilyProfile[K]) => {
    onChangeProfile({
      ...profile,
      [key]: value,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Users className="w-5 h-5 text-emerald-600" />
          <span>Family & Lifestyle Profile Configurator</span>
        </h3>
        <p className="text-xs text-slate-700 dark:text-slate-300">
          Personalize daily routines, vulnerability shields, and direct emission reduction tracking
        </p>
      </div>

      <div className="space-y-5">
        {/* Household Size & Vulnerable Members */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 block mb-2">
            Household Members ({profile.familyMembersCount} people)
          </label>
          <div className="flex items-center space-x-3 mb-4">
            <input
              type="range"
              min="1"
              max="8"
              value={profile.familyMembersCount}
              onChange={(e) => updateField('familyMembersCount', parseInt(e.target.value, 10))}
              className="flex-1 accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              aria-label="Number of family members"
            />
            <span className="w-8 text-center font-bold text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 py-1 rounded-lg">
              {profile.familyMembersCount}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => updateField('hasInfants', !profile.hasInfants)}
              className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 text-xs font-semibold transition-colors ${
                profile.hasInfants
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Baby className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Infant / Toddler</span>
            </button>

            <button
              type="button"
              onClick={() => updateField('hasSeniors', !profile.hasSeniors)}
              className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 text-xs font-semibold transition-colors ${
                profile.hasSeniors
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Senior Citizen</span>
            </button>

            <button
              type="button"
              onClick={() => updateField('hasAsthmaRespiratory', !profile.hasAsthmaRespiratory)}
              className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 text-xs font-semibold transition-colors ${
                profile.hasAsthmaRespiratory
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Asthma / COPD</span>
            </button>

            <button
              type="button"
              onClick={() => updateField('hasPets', !profile.hasPets)}
              className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 text-xs font-semibold transition-colors ${
                profile.hasPets
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Dog className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Pet Animals</span>
            </button>
          </div>
        </div>

        {/* Daily Commute Mode */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <Car className="w-3.5 h-3.5 text-emerald-600" />
              <span>Primary Daily Commute Mode</span>
            </label>
            <span className="text-xs text-slate-700 dark:text-slate-300">
              {profile.dailyCommuteDistanceKm} km round trip
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'metro', label: 'Metro Rail (Electric)', eco: 'Low Emission' },
              { id: 'carpool', label: 'Carpool / Shared Cab', eco: 'Shared' },
              { id: 'car_solo', label: 'Solo Petrol/Diesel Car', eco: 'High Impact' },
              { id: 'bus', label: 'City Bus / Shared Auto', eco: 'Public Transit' },
              { id: 'two_wheeler', label: 'Motorbike / Scooter', eco: 'High Exposure' },
              { id: 'remote', label: 'Work From Home (WFH)', eco: 'Zero Commute' },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => updateField('commuteMode', mode.id as CommuteMode)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  profile.commuteMode === mode.id
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-bold block">{mode.label}</span>
                <span className="text-[10px] text-slate-700 dark:text-slate-300 block">{mode.eco}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Kitchen Fuel & Home Heating Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 mb-2">
              <Flame className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cooking Fuel Setup</span>
            </label>
            <select
              value={profile.cookingFuel}
              onChange={(e) => updateField('cookingFuel', e.target.value as CookingFuel)}
              className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Cooking fuel setup"
            >
              <option value="induction">⚡ Electric Induction Cooktop (Zero NO2 plume)</option>
              <option value="lpg">🔥 LPG Gas Stove with Kitchen Chimney Exhaust</option>
              <option value="mixed">🍳 Mixed (LPG + Induction backup)</option>
              <option value="biomass_wood">🪵 Traditional Biomass / Chulha (High Particulate)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 mb-2">
              <Heater className="w-3.5 h-3.5 text-emerald-600" />
              <span>Winter Heating Method</span>
            </label>
            <select
              value={profile.heatingType}
              onChange={(e) => updateField('heatingType', e.target.value as HeatingType)}
              className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Winter heating method"
            >
              <option value="electric_blower">🔌 Electric Blower / Halogen Heater (Clean)</option>
              <option value="oil_radiator">🛢️ Oil-Filled Radiator (Safe for Asthmatics)</option>
              <option value="none">🧣 Warm Woolens & Quilts Only (No active heating)</option>
              <option value="wood_coal_angithi">⚠️ Open Wood/Coal Angithi (Hazardous)</option>
            </select>
          </div>
        </div>

        {/* Indoor Filtration Status */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 mb-2">
            <Wind className="w-3.5 h-3.5 text-emerald-600" />
            <span>Room Filtration & Ventilation Status</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'diy_filtered', label: 'DIY Filter / HEPA Active', desc: 'Active high CADR filtration' },
              { id: 'sealed', label: 'Sealed Doors & Windows', desc: 'Draft stopped, no active purifier' },
              { id: 'cross_ventilated', label: 'Open Windows / Infiltrated', desc: 'Direct exposure to street smog' },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => updateField('ventilationType', v.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  profile.ventilationType === v.id
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-xs font-bold block">{v.label}</span>
                <span className="text-[10px] text-slate-700 dark:text-slate-300">{v.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

