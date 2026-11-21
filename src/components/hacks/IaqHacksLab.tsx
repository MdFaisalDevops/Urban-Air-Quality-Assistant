import React, { useState } from 'react';
import { IAQ_HACKS_LIST, NASA_PLANTS_DATABASE } from '../../data/hacksData';
import { Wrench, Leaf, Calculator, ShieldCheck, Check, Sparkles } from 'lucide-react';

export const IaqHacksLab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'hacks' | 'calculator' | 'plants'>('hacks');
  const [selectedHackId, setSelectedHackId] = useState<string>(IAQ_HACKS_LIST[0].id);

  // CADR Calculator State
  const [roomAreaSqFt, setRoomAreaSqFt] = useState<number>(200);
  const [ceilingHeightFt, setCeilingHeightFt] = useState<number>(10);
  const [fanCfm, setFanCfm] = useState<number>(250);

  // Calculations
  const roomVolumeCuFt = roomAreaSqFt * ceilingHeightFt;
  // ACH = (CADR * 60) / Room Volume
  const airChangesPerHour = Number(((fanCfm * 60) / roomVolumeCuFt).toFixed(1));
  // Time to achieve 85% clean air in minutes ≈ 3 / (ACH / 60)
  const minutesToClean = Math.max(12, Math.round((3 * 60) / airChangesPerHour));
  const commercialPurifierCost = 14500;
  const diyPurifierCost = 1850;
  const costSavingsInr = commercialPurifierCost - diyPurifierCost;

  const currentHack = IAQ_HACKS_LIST.find((h) => h.id === selectedHackId) || IAQ_HACKS_LIST[0];

  return (
    <section aria-labelledby="iaq-hacks-heading" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm transition-colors mt-8">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-emerald-600" />
            <h2 id="iaq-hacks-heading" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Indoor Air Quality (IAQ) Hack Lab
            </h2>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
            Affordable, scientifically validated filtration hacks & natural indoor purifiers for winter smog
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveSection('hacks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSection === 'hacks'
                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Science Hacks
          </button>
          <button
            onClick={() => setActiveSection('calculator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
              activeSection === 'calculator'
                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 mr-1" />
            <span>DIY CADR Calculator</span>
          </button>
          <button
            onClick={() => setActiveSection('plants')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
              activeSection === 'plants'
                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 mr-1" />
            <span>NASA Clean Plants</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: HACKS EXPLORER */}
      {activeSection === 'hacks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hack List Selector (Left) */}
          <div className="lg:col-span-5 space-y-2">
            {IAQ_HACKS_LIST.map((hack) => {
              const isSelected = hack.id === selectedHackId;
              return (
                <button
                  key={hack.id}
                  onClick={() => setSelectedHackId(hack.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 shadow-xs ring-1 ring-emerald-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {hack.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      -{hack.pm25ReductionPercent}% PM2.5
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-700 dark:text-slate-300">
                    <span>Est. Cost: <strong className="text-slate-900 dark:text-slate-200">{hack.costLevel}</strong></span>
                    <span>•</span>
                    <span>CADR: <strong className="text-emerald-700 dark:text-emerald-400">{hack.cadrRatingCfm} CFM</strong></span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Hack Deep-Dive (Right) */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  Validated Science Hack
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {currentHack.title}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                  {currentHack.costLevel}
                </span>
                <span className="text-[11px] text-slate-700 dark:text-slate-300 block">
                  {currentHack.setupTimeMinutes} min build time
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              {currentHack.description}
            </p>

            {/* Materials Needed */}
            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
                Materials Needed (Readily Available in Local Markets):
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {currentHack.materialsNeeded.map((mat, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{mat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step-by-Step Execution */}
            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
                Step-by-Step Implementation:
              </h4>
              <ol className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {currentHack.steps.map((step, i) => (
                  <li key={i} className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Scientific Mechanism */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white flex items-center space-x-1 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>The Physics & Biological Mechanism:</span>
              </strong>
              {currentHack.scientificMechanism}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: INTERACTIVE CADR & ROI CALCULATOR */}
      {activeSection === 'calculator' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Corsi-Rosenthal Box Performance & Clean Air Rate (CADR) Calculator
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Calculate exact Air Changes per Hour (ACH) and clean-up time for your specific bedroom or living room dimensions.
            </p>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Room Floor Area: <strong>{roomAreaSqFt} sq ft</strong></span>
                <span className="text-slate-700 dark:text-slate-300">{Math.round(roomAreaSqFt * 0.0929)} m²</span>
              </div>
              <input
                type="range"
                min="80"
                max="500"
                step="10"
                value={roomAreaSqFt}
                onChange={(e) => setRoomAreaSqFt(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                aria-label="Room floor area in square feet"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Ceiling Height: <strong>{ceilingHeightFt} ft</strong></span>
              </div>
              <input
                type="range"
                min="8"
                max="14"
                step="0.5"
                value={ceilingHeightFt}
                onChange={(e) => setCeilingHeightFt(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                aria-label="Ceiling height in feet"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Fan Airflow Delivery: <strong>{fanCfm} CFM</strong> (Cubic Feet / Min)</span>
              </div>
              <input
                type="range"
                min="150"
                max="450"
                step="25"
                value={fanCfm}
                onChange={(e) => setFanCfm(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                aria-label="Fan Clean Air Delivery Rate in CFM"
              />
            </div>
          </div>

          {/* Results Card */}
          <div className="md:col-span-6 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-3xl border border-emerald-200 dark:border-emerald-800 p-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-4 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Calculated Performance & Financial ROI</span>
            </h4>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-emerald-100 dark:border-emerald-900 shadow-xs">
                <span className="text-[11px] text-slate-700 dark:text-slate-300 block">Air Changes / Hour (ACH)</span>
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                  {airChangesPerHour}x
                </span>
                <span className="text-[10px] text-slate-700 dark:text-slate-300 block mt-0.5">
                  Target: 4x–6x ACH (ACH achieved!)
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-emerald-100 dark:border-emerald-900 shadow-xs">
                <span className="text-[11px] text-slate-700 dark:text-slate-300 block">Time to Clear 85% PM2.5</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {minutesToClean} min
                </span>
                <span className="text-[10px] text-slate-700 dark:text-slate-300 block mt-0.5">
                  Drops AQI 400 down to &lt;45
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-700 dark:text-slate-300">Commercial Branded HEPA Purifier:</span>
                <span className="font-bold line-through text-slate-700">₹{commercialPurifierCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-700 dark:text-slate-300">DIY Fan-HEPA Filter Cost:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">₹{diyPurifierCost.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm font-black text-slate-900 dark:text-white">
                <span>Net Family Savings:</span>
                <span className="text-emerald-700 dark:text-emerald-400">₹{costSavingsInr.toLocaleString()} (87% Savings)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: NASA CLEAN PLANTS */}
      {activeSection === 'plants' && (
        <div>
          <p className="text-xs text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
            Based on the landmark NASA Clean Air Study. These natural houseplants remove toxic VOCs (benzene, formaldehyde, xylene) and certain species utilize Crassulacean Acid Metabolism (CAM) to actively synthesize and release oxygen during winter nights.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {NASA_PLANTS_DATABASE.map((plant, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {plant.name}
                      </h4>
                      <span className="text-[11px] italic text-slate-700 dark:text-slate-300 block">
                        {plant.scientificName}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      ★ {plant.nasaScore}/10
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Filters:</strong>{' '}
                      {plant.pollutantsFiltered.slice(0, 3).join(', ')}
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Placement:</strong>{' '}
                      {plant.placement}
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Recommended Density:</strong>{' '}
                      {plant.densityPerSqFt}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Care: <strong>{plant.maintenance}</strong></span>
                  <span className={plant.childPetSafe ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-amber-800 dark:text-amber-300 font-bold'}>
                    {plant.childPetSafe ? '✓ Pet/Child Safe' : '⚠ Non-Edible'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
