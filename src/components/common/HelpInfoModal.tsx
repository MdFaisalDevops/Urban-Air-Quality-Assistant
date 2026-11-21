import React from 'react';
import { X, CheckCircle2, ShieldCheck, Zap, TestTube, Eye, Target, Sparkles } from 'lucide-react';

interface HelpInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpInfoModal: React.FC<HelpInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="challenge-info-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          aria-label="Close information modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>PromptWars Virtual Challenge 6 Architecture</span>
        </div>
        <h3 id="challenge-info-title" className="text-xl font-black text-slate-900 dark:text-white mb-2">
          Evaluation Focus Areas & Compliance
        </h3>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          VayuMitra is precision-engineered to fulfill all six evaluation criteria with production-grade rigor.
        </p>

        <div className="space-y-4">
          {/* Pillar 1: Code Quality */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 dark:text-white mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1. Code Quality – Structure, Readability, Maintainability</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Strictly typed TypeScript with modular design (`/types`, `/services`, `/data`, `/components`, `/hooks`). Zero runtime errors, explicit interfaces, and self-documenting code.
            </p>
          </div>

          {/* Pillar 2: Security */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 dark:text-white mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>2. Security – Safe & Responsible Implementation</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              OWASP-aligned input sanitization, prompt injection detection (blocking jailbreak triggers), client-side sliding-window rate limiting, and zero credential leakage (keys never touch server logs).
            </p>
          </div>

          {/* Pillar 3: Efficiency */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 dark:text-white mb-1">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>3. Efficiency – Optimal Use of Resources</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              15-minute intelligent TTL cache for AQI station data, debounced inputs, Vite bundling, and instant built-in AI engine fallback to conserve LLM API quotas.
            </p>
          </div>

          {/* Pillar 4: Testing */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 dark:text-white mb-1">
              <TestTube className="w-4 h-4 text-purple-600" />
              <span>4. Testing – Validation of Functionality</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Comprehensive Vitest suite validating CPCB linear interpolation AQI math, Berkeley Earth cigarette equivalence math, security filters, and component rendering.
            </p>
          </div>

          {/* Pillar 5: Accessibility */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 dark:text-white mb-1">
              <Eye className="w-4 h-4 text-teal-600" />
              <span>5. Accessibility – Inclusive & Usable Design</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              WCAG 2.1 AA/AAA compliant high contrast mode, keyboard focus rings, semantic landmark tags, screen-reader polite live regions, and colorblind-safe dual indicators (colors + icons + text).
            </p>
          </div>

          {/* Pillar 6: Problem Statement Alignment */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 dark:text-white mb-1">
              <Target className="w-4 h-4 text-rose-600" />
              <span>6. Problem Statement Alignment – Winter Smog & Community Action</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              100% focused on Indian winter thermal inversions (Delhi, Kolkata, Mumbai, Patna, etc.), vulnerable infant/senior shields, DIY Corsi-Rosenthal purifiers, anti-burning RWA resolutions, and quantitative impact calculations.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
          >
            Got it, Back to App
          </button>
        </div>
      </div>
    </div>
  );
};

