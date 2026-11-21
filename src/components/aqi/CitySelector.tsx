import React, { useState } from 'react';
import { Search, MapPin, RefreshCw } from 'lucide-react';
import { CityStation } from '../../types/aqi';
import { getAqiScaleInfo } from '../../constants/aqiScales';

interface CitySelectorProps {
  cities: CityStation[];
  selectedCityId: string;
  onSelectCity: (id: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  cities,
  selectedCityId,
  onSelectCity,
  onRefresh,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCities = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-emerald-600" aria-hidden="true" />
            <span>Select Urban Station</span>
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Real-time CPCB calibrated air monitoring across winter smog hotspots
          </p>
        </div>

        {/* Search Input & Refresh Button */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" aria-hidden="true" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search city (e.g. Delhi, Kolkata)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              aria-label="Filter city stations by name or state"
            />
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
            title="Refresh Live Air Quality Data"
            aria-label="Refresh Air Quality Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* City Station Cards List */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5"
        role="listbox"
        aria-label="Indian Cities Air Quality Stations"
      >
        {filteredCities.map((city) => {
          const isSelected = city.id === selectedCityId;
          const scale = getAqiScaleInfo(city.currentAqi);

          return (
            <button
              key={city.id}
              role="option"
              aria-selected={isSelected}
              onClick={() => onSelectCity(city.id)}
              className={`p-3 rounded-xl border text-left transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-sm ring-1 ring-emerald-500'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                    {city.name}
                  </span>
                </div>
                <span className="text-[11px] text-slate-700 dark:text-slate-300 block mb-2">
                  {city.state}
                </span>
              </div>

              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  AQI <strong className="text-sm font-black text-slate-900 dark:text-white">{city.currentAqi}</strong>
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight shadow-sm"
                  style={{
                    backgroundColor: scale.colorHex,
                    color: city.currentAqi > 200 ? '#ffffff' : '#1e293b',
                  }}
                >
                  {city.category}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
