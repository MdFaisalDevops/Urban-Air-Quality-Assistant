import React, { useState } from 'react';
import { HourlyForecast } from '../../types/aqi';
import { Clock, ShieldAlert, Sparkles, Sun, Moon } from 'lucide-react';
import { getAqiScaleInfo } from '../../constants/aqiScales';

interface SmogHourlyForecastProps {
  forecast: HourlyForecast[];
}

export const SmogHourlyForecast: React.FC<SmogHourlyForecastProps> = ({ forecast }) => {
  const [selectedHour, setSelectedHour] = useState<HourlyForecast>(forecast[0] || null);

  const safeWindow = forecast.find((f) => f.isSafeVentingWindow);

  return (
    <section aria-labelledby="smog-forecast-heading" className="mt-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 id="smog-forecast-heading" className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span>24-Hour Winter Smog & Thermal Inversion Cycle</span>
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Track diurnal temperature inversion layers and locate optimal indoor venting windows
          </p>
        </div>

        {safeWindow && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <Sun className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Optimal Safe Venting Window: <strong>{safeWindow.time}</strong></span>
          </div>
        )}
      </div>

      {/* Hourly Timeline Ribbon */}
      <div className="overflow-x-auto pb-4 pt-2 -mx-2 px-2 scrollbar-thin">
        <div className="flex space-x-3 min-w-[700px]">
          {forecast.map((hour) => {
            const scale = getAqiScaleInfo(hour.aqi);
            const isSelected = selectedHour?.time === hour.time;
            const hourNum = parseInt(hour.time.split(':')[0], 10);
            const isDay = hourNum >= 7 && hourNum <= 17;

            return (
              <button
                key={hour.time}
                onClick={() => setSelectedHour(hour)}
                className={`flex-1 p-3.5 rounded-2xl border text-center transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[95px] flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 shadow-sm ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-center space-x-1 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-1">
                    {isDay ? <Sun className="w-3 h-3 text-amber-500" /> : <Moon className="w-3 h-3 text-indigo-400" />}
                    <span>{hour.time}</span>
                  </div>

                  <span
                    className="text-lg font-black block my-1"
                    style={{ color: scale.colorHex }}
                  >
                    {hour.aqi}
                  </span>

                  <span className="text-[10px] text-slate-700 dark:text-slate-300 block">
                    PM2.5: {hour.pm25}
                  </span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700/80">
                  {hour.isSafeVentingWindow ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500 text-white tracking-tight">
                      VENT NOW
                    </span>
                  ) : hour.inversionRisk === 'Severe' ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-red-600 text-white tracking-tight">
                      SEAL ROOM
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                      {hour.temperature}°C
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Hour Deep Dive & Actionable Guidance */}
      {selectedHour && (
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className={`p-2.5 rounded-xl ${selectedHour.isSafeVentingWindow ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'}`}>
              {selectedHour.isSafeVentingWindow ? <Sparkles className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Hour {selectedHour.time} Protocol:
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  Inversion Risk: {selectedHour.inversionRisk}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                {selectedHour.recommendation}
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-700 dark:text-slate-300 shrink-0 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>Ambient Temp: <strong className="text-slate-900 dark:text-white">{selectedHour.temperature}°C</strong></div>
            <div>Predicted PM2.5: <strong className="text-slate-900 dark:text-white">{selectedHour.pm25} µg/m³</strong></div>
          </div>
        </div>
      )}
    </section>
  );
};

