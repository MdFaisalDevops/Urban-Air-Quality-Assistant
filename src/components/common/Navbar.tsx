import React from 'react';
import { Wind, Sparkles, Key, Sun, Moon, HelpCircle } from 'lucide-react';
import { GeminiService } from '../../services/geminiService';
import { SecurityService } from '../../services/securityService';

interface NavbarProps {
  onOpenAssistant: () => void;
  onOpenApiKeyModal: () => void;
  onOpenHelpModal: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAssistant,
  onOpenApiKeyModal,
  onOpenHelpModal,
  darkMode,
  toggleDarkMode,
  highContrast,
  toggleHighContrast,
}) => {
  const currentKey = GeminiService.getApiKey();
  const hasKey = Boolean(currentKey);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Wind className="w-6 h-6 animate-pulse-slow" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Vayu<span className="text-emerald-700 dark:text-emerald-400">Mitra</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  <Sparkles className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400" />
                  GenAI Urban Shield
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 hidden sm:block">
                Winter Smog & Community Air Defense Assistant
              </p>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* GenAI Chat Assistant CTA */}
            <button
              onClick={onOpenAssistant}
              className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 active:scale-95"
              aria-label="Open GenAI Assistant"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              <span>Ask VayuBot</span>
            </button>

            {/* API Key Status Pill */}
            <button
              onClick={onOpenApiKeyModal}
              className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 ${
                hasKey
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title={hasKey ? `Gemini Key Active: ${SecurityService.maskApiKey(currentKey!)}` : 'Click to configure Gemini API Key (or use Zero-Setup Expert Engine)'}
              aria-label="Configure Gemini API Key"
            >
              <Key className="w-3.5 h-3.5 mr-1 text-slate-600 dark:text-slate-300" />
              <span className="hidden md:inline">
                {hasKey ? 'Gemini 1.5' : 'Zero-Setup Mode'}
              </span>
              <span className={`ml-1.5 w-2 h-2 rounded-full ${hasKey ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`} />
            </button>

            {/* High Contrast Mode Toggle for WCAG AAA Accessibility */}
            <button
              onClick={toggleHighContrast}
              className={`p-2 rounded-lg border text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                highContrast
                  ? 'bg-amber-400 text-black border-amber-500 ring-2 ring-amber-400'
                  : 'text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Toggle High Contrast Mode (Accessibility)"
              aria-label="Toggle High Contrast Mode"
            >
              <span className="text-[11px] font-black">A11Y</span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark and Light Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Help / Challenge Info Button */}
            <button
              onClick={onOpenHelpModal}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
              title="Evaluation & Challenge Details"
              aria-label="Evaluation and Challenge Details"
            >
              <HelpCircle className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
