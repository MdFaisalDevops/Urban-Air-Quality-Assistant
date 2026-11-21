import React, { useState } from 'react';
import { Key, ShieldCheck, ExternalLink, X, Check, AlertCircle } from 'lucide-react';
import { GeminiService } from '../../services/geminiService';
import { SecurityService } from '../../services/securityService';

interface ApiKeyConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
}

export const ApiKeyConfigModal: React.FC<ApiKeyConfigModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
}) => {
  const currentKey = GeminiService.getApiKey() || '';
  const [apiKeyInput, setApiKeyInput] = useState(currentKey);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = apiKeyInput.trim();
    if (trimmed && !SecurityService.isValidApiKeyFormat(trimmed)) {
      setFeedback({
        message: 'Notice: Google Gemini API keys typically start with "AIza" and are ~39 characters. Saving nonetheless.',
        type: 'error',
      });
    }

    GeminiService.setApiKey(trimmed);
    setFeedback({
      message: trimmed ? 'Gemini API Key saved securely in your local browser storage!' : 'Switched to Built-in Zero-Setup Expert Engine.',
      type: 'success',
    });

    onKeyUpdated();
    setTimeout(() => {
      onClose();
      setFeedback(null);
    }, 1200);
  };

  const handleClear = () => {
    setApiKeyInput('');
    GeminiService.setApiKey('');
    setFeedback({
      message: 'Cleared. Using Built-in Deterministic AI Expert Engine.',
      type: 'success',
    });
    onKeyUpdated();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 relative transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          aria-label="Close configuration modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 id="api-key-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
              Google Gemini GenAI Configuration
            </h3>
            <span className="text-xs text-slate-500">
              PromptWars Evaluation Setting
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          VayuMitra supports both <strong>Live Google Gemini 1.5/2.0 Flash</strong> and an offline <strong>Built-in AI Expert Engine</strong>. Evaluators can test with or without an API key!
        </p>

        {/* Input */}
        <div className="mb-4">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            Gemini API Key (Optional)
          </label>
          <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Enter Google Gemini API Key"
          />
          <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500">
            <span>Stored in browser localStorage only</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
            >
              Get Free Key <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`p-3 rounded-xl text-xs mb-4 flex items-center space-x-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                : 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
            }`}
          >
            {feedback.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Security Notice */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 mb-5 flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Zero Security Leakage:</strong> Your key is never forwarded to any 3rd party backend or logged to telemetry. Requests route directly to Google Generative AI endpoints.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={handleClear}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Use Built-in Engine
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            Save & Connect
          </button>
        </div>
      </div>
    </div>
  );
};

