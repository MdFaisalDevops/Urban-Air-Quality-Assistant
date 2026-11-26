import React, { useState } from 'react';
import { SUSTAINABLE_ALTERNATIVES_LIST } from '../../data/alternativesData';
import { Users, FlameKindling, ShieldCheck, HeartHandshake, CheckCircle2, Share2 } from 'lucide-react';

export const CommunityActionBeacon: React.FC = () => {
  const [pledged, setPledged] = useState<boolean>(false);
  const [pledgeCount, setPledgeCount] = useState<number>(1428);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [templateCopied, setTemplateCopied] = useState<boolean>(false);

  const handlePledge = () => {
    if (!pledged) {
      setPledged(true);
      setPledgeCount((prev) => prev + 1);
    }
  };

  const handleShare = (altId: string) => {
    setCopiedId(altId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyTemplate = async () => {
    const templateText = `VayuMitra RWA Action Resolution Template:
1. Security Guard Electric Heater Provisioning (replace open leaf/wood drum fires).
2. Ban on Open Leaf Sweeping Burning (community compost mandate).
3. 4-Family School Carpool Registry (eliminate gate idling).
4. Safe Venting Alert display on society notice board (1:00 PM - 3:15 PM).`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(templateText);
      }
    } catch {
      // Graceful fallback if clipboard API restricted in test env
    }
    setTemplateCopied(true);
    setTimeout(() => setTemplateCopied(false), 3000);
  };

  return (
    <section aria-labelledby="community-beacon-heading" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm transition-colors mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h2 id="community-beacon-heading" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Community Action Beacon & Sustainable Alternatives
            </h2>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
            Empowering Resident Welfare Associations (RWAs), schools, and apartment societies to replace toxic habits with sustainable choices
          </p>
        </div>

        {/* Citizen Clean Air Pledge Button */}
        <button
          onClick={handlePledge}
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            pledged
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-600 hover:text-white text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 active:scale-95'
          }`}
          aria-label="Pledge for Clean Air & Smoke-Free Communities"
        >
          <HeartHandshake className="w-4 h-4" />
          <span>{pledged ? '✓ Pledged for Clean Air!' : 'Take Anti-Burning Pledge'}</span>
          <span className="ml-1 text-[11px] opacity-80">({pledgeCount.toLocaleString()})</span>
        </button>
      </div>

      {/* Sustainable Alternatives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {SUSTAINABLE_ALTERNATIVES_LIST.map((alt) => (
          <div
            key={alt.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {alt.badge}
                </span>
                <button
                  onClick={() => handleShare(alt.id)}
                  className="text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs flex items-center space-x-1 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                  title="Share action proposal with your RWA or society WhatsApp group"
                  aria-label={`Share ${alt.badge}`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedId === alt.id ? 'Copied Link!' : 'Share'}</span>
                </button>
              </div>

              {/* Traditional vs Sustainable */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60">
                  <span className="font-bold text-red-900 dark:text-red-300 flex items-center space-x-1.5 mb-1">
                    <FlameKindling className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                    <span>Traditional Toxic Practice:</span>
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {alt.traditionalPractice}
                  </p>
                  <p className="mt-1.5 text-[11px] text-red-800 dark:text-red-300 italic">
                    <strong>Hazard:</strong> {alt.hazardExplanation}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center space-x-1.5 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Clean Sustainable Alternative:</span>
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {alt.sustainableAlternative}
                  </p>
                </div>
              </div>
            </div>

            {/* Impact stats footer */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300">
              <div>
                Cuts <strong className="text-emerald-700 dark:text-emerald-400">-{alt.co2ReductionKgPerMonth} kg CO₂</strong> & <strong className="text-amber-800 dark:text-amber-400">-{alt.pm25AvertedGrams}g PM2.5</strong>/mo
              </div>
              <div className="text-slate-700 dark:text-slate-300 line-clamp-1 max-w-[180px]">
                {alt.costComparison}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RWA Template Download Banner */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Society RWA Smog Defense Resolution (Ready-to-Use Template)
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
              Includes formal agenda points, budget allocation guidelines for guard cabin heaters, and zero open-burning bylaws.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyTemplate}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 shadow-xs ${
            templateCopied
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
              : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900'
          }`}
          aria-live="polite"
        >
          {templateCopied ? '✓ Copied to Clipboard!' : 'Copy RWA Template'}
        </button>
      </div>
    </section>
  );
};
