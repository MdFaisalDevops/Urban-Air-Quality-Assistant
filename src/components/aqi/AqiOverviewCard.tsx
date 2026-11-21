import React, { useState } from 'react';
import { AlertTriangle, CloudSun, Droplets, Wind, ShieldAlert, Users, Baby, Activity, Info } from 'lucide-react';
import { CityStation } from '../../types/aqi';
import { getAqiScaleInfo } from '../../constants/aqiScales';

interface AqiOverviewCardProps {
  city: CityStation;
  highContrast?: boolean;
}

export const AqiOverviewCard: React.FC<AqiOverviewCardProps> = ({ city, highContrast }) => {
  const [activeTab, setActiveTab] = useState<'children' | 'seniors' | 'general'>('children');
  const scale = getAqiScaleInfo(city.currentAqi);

  // Inversion risk evaluation based on winter meteorology (low wind < 5km/h, cold temp < 18°C, AQI > 200)
  const isHighInversion = city.weather.temp <= 18 && city.weather.windSpeed <= 6 && city.currentAqi >= 250;

  return (
    <section
      aria-labelledby="aqi-overview-heading"
      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm transition-colors relative overflow-hidden"
    >
      {/* Background ambient subtle glow */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none transition-colors"
        style={{ backgroundColor: scale.colorHex }}
        aria-hidden="true"
      />

      {/* Header Station Info & Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h2 id="aqi-overview-heading" className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {city.name}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {city.state}
            </span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
            {city.stationName}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{city.lastUpdated}</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Gauge + Weather + Inversion Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Big AQI Metric & Category Badge */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex items-baseline space-x-3">
            <span
              className={`text-6xl sm:text-7xl font-black tracking-tight ${highContrast ? 'text-black dark:text-white' : ''}`}
              style={{ color: highContrast ? undefined : scale.colorHex }}
              aria-live="polite"
            >
              {city.currentAqi}
            </span>
            <div className="text-left">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Air Quality Index
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">CPCB 0–500 Standard</span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 justify-center lg:justify-start">
            <span
              className="px-4 py-1.5 rounded-xl text-sm font-extrabold shadow-sm tracking-wide"
              style={{
                backgroundColor: scale.colorHex,
                color: city.currentAqi > 200 ? '#ffffff' : '#1e293b',
              }}
            >
              {city.category}
            </span>
            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              Dominant: <strong className="text-emerald-600 dark:text-emerald-400">{city.dominantPollutant}</strong> ({city.pollutants.pm25} µg/m³)
            </span>
          </div>

          <p className="mt-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-md">
            {scale.healthImplications}
          </p>
        </div>

        {/* Center: Meteorological Conditions */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
              <CloudSun className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-700 dark:text-slate-300 block">Temperature</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{city.weather.temp}°C</span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-700 dark:text-slate-300 block">Humidity</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{city.weather.humidity}%</span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-700 dark:text-slate-300 block">Wind Speed</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{city.weather.windSpeed} km/h</span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-700 dark:text-slate-300 block">Atmosphere</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                {city.weather.condition}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Thermal Inversion Warning & Quick Health Action */}
        <div className="lg:col-span-4 flex flex-col justify-between h-full bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5">
                <ShieldAlert className={`w-4 h-4 ${isHighInversion ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Thermal Inversion Risk
                </span>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  isHighInversion
                    ? 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300'
                    : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                }`}
              >
                {isHighInversion ? 'Severe Trapping' : 'Moderate Dispersion'}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {isHighInversion
                ? 'Cold temperatures (< 18°C) and calm winds are locking toxic vehicle exhaust and particulate within 150m of ground level. Morning outdoor sports strictly discouraged.'
                : 'Wind velocity and afternoon warming are aiding atmospheric mixing. Follow recommended venting windows.'}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Cautionary Stance:</span>
            <span className="font-semibold text-slate-900 dark:text-white text-right line-clamp-1 max-w-[200px]">
              {scale.cautionaryStatement}
            </span>
          </div>
        </div>
      </div>

      {/* Tabbed Family-Specific Safety Guidelines */}
      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Vulnerable Family Guidance for Current Smog Level
            </h3>
          </div>

          {/* Persona selector tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'children'}
              onClick={() => setActiveTab('children')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors flex items-center space-x-1 ${
                activeTab === 'children'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Baby className="w-3.5 h-3.5" />
              <span>Children & Infants</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'seniors'}
              onClick={() => setActiveTab('seniors')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors flex items-center space-x-1 ${
                activeTab === 'seniors'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Seniors & Asthmatics</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'general'}
              onClick={() => setActiveTab('general')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors flex items-center space-x-1 ${
                activeTab === 'general'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>General Public</span>
            </button>
          </div>
        </div>

        {/* Active tab content */}
        <div
          role="tabpanel"
          className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start space-x-3"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
          <p className="leading-relaxed">
            {activeTab === 'children' && scale.familyAdvice.children}
            {activeTab === 'seniors' && scale.familyAdvice.seniors}
            {activeTab === 'general' && scale.familyAdvice.general}
          </p>
        </div>
      </div>
    </section>
  );
};

