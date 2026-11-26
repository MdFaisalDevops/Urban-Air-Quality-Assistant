import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, ShieldCheck, Loader2, Trash2 } from 'lucide-react';
import { CityStation } from '../../types/aqi';
import { FamilyProfile } from '../../types/routines';
import { PROMPT_SHORTCUTS } from '../../data/personaPrompts';
import { GeminiService } from '../../services/geminiService';
import { SafeMarkdownRenderer } from '../../utils/markdownParser';

interface GenAiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityStation;
  profile: FamilyProfile;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'expert_engine';
  suggestions?: string[];
}

export const GenAiAssistantModal: React.FC<GenAiAssistantModalProps> = ({
  isOpen,
  onClose,
  city,
  profile,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am **VayuBot**, your AI-powered winter smog advisor for **${city.name}** (Current AQI: **${city.currentAqi} - ${city.category}**).\n\nAsk me anything about indoor air quality hacks, DIY air cleaners, safe outdoor workout windows, or safeguarding children and seniors.`,
      timestamp: 'Just now',
      source: 'expert_engine',
      suggestions: [
        'How to build a ₹1,500 DIY Air Purifier?',
        'When is the safest time to ventilate today?',
        'Emergency checklist for infants & asthmatics',
      ],
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sourceBadge, setSourceBadge] = useState<'gemini' | 'expert_engine'>('expert_engine');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await GeminiService.generateSmogAdvice(textToSend, city, profile);
      setSourceBadge(response.source);

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: response.source,
        suggestions: response.suggestions,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'assistant',
          text: 'An error occurred while generating a response. Please check your network or try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: `Chat cleared. Ready for your questions regarding air quality in **${city.name}** (AQI ${city.currentAqi}).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="assistant-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full h-[90vh] flex flex-col overflow-hidden relative">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 id="assistant-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                  VayuBot | GenAI Smog Defense Assistant
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {sourceBadge === 'gemini' ? 'Google Gemini 1.5' : 'AI Expert Engine'}
                </span>
              </div>
              <span className="text-[11px] text-slate-700 dark:text-slate-300 block">
                Context: {city.name} (AQI {city.currentAqi}) • {profile.familyMembersCount} Family Members
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleClear}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Clear Conversation"
              aria-label="Clear Conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prompt Shortcuts Carousel */}
        <div className="px-4 py-2.5 bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none flex space-x-2">
          {PROMPT_SHORTCUTS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleSend(sc.prompt)}
              disabled={isLoading}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-600 whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
            >
              {sc.label}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white ${
                    isUser ? 'bg-blue-600' : 'bg-emerald-600'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-xs text-xs ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-tl-xs'
                  }`}
                >
                  {isUser ? (
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <SafeMarkdownRenderer content={msg.text} />
                  )}

                  <div className="mt-2 text-[10px] opacity-60 text-right">
                    {msg.timestamp}
                  </div>

                  {/* Follow-up suggestion pills */}
                  {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/80 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((sug) => (
                        <button
                          key={sug}
                          onClick={() => handleSend(sug)}
                          disabled={isLoading}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center space-x-2 text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>VayuBot is computing tailored advice & direct impact...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask about winter smog, DIY purifiers, safe routines, vulnerable family care..."
                disabled={isLoading}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-3 pl-4 pr-10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                aria-label="Ask VayuBot a question"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-colors shadow-xs"
              aria-label="Send prompt to VayuBot"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Prompt injection defense active • Rate limit guarded</span>
            </span>
            <span>Press Enter to send</span>
          </div>
        </div>
      </div>
    </div>
  );
};
