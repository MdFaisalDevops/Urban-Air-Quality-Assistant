import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, Trash2, ShieldCheck, Loader2 } from 'lucide-react';
import { ChatMessage } from '../../types/chat';
import { CityStation } from '../../types/aqi';
import { FamilyProfile } from '../../types/routines';
import { PROMPT_SHORTCUTS } from '../../data/personaPrompts';
import { GeminiService } from '../../services/geminiService';

interface GenAiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityStation;
  profile: FamilyProfile;
}

export const GenAiAssistantModal: React.FC<GenAiAssistantModalProps> = ({
  isOpen,
  onClose,
  city,
  profile,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Namaste! I am **VayuBot**, your GenAI urban air defense assistant.\n\nI am currently analyzing real-time air quality in **${city.name}** (AQI **${city.currentAqi}**, Dominant Pollutant **${city.dominantPollutant}** at **${city.pollutants.pm25} µg/m³**).\n\nHow can I help protect your household and community today? You can choose a quick question below or ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'How to build a ₹1,500 DIY Air Purifier?',
        'When is the Safe Venting Window today?',
        'Emergency 5-step protocol for infants & seniors',
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
  }, [isOpen, messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await GeminiService.askAssistant(prompt, city, profile);
      setSourceBadge(response.source);

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: response.suggestions,
        impactCallout: response.impactCallout,
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

  // Simple Markdown Formatter
  const renderFormattedMarkdown = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-sm font-black text-slate-900 dark:text-white mt-3 mb-1">{line.slice(4)}</h3>;
      }
      if (line.startsWith('#### ')) {
        return <h4 key={idx} className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mt-2 mb-1 uppercase tracking-wider">{line.slice(5)}</h4>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-700 dark:text-slate-300 my-0.5">
            <span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-xs text-slate-700 dark:text-slate-300 my-0.5">
            <span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </li>
        );
      }
      if (line.trim() === '---') {
        return <hr key={idx} className="my-2 border-slate-200 dark:border-slate-800" />;
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1" />;
      }
      return (
        <p key={idx} className="text-xs text-slate-700 dark:text-slate-300 my-1 leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        </p>
      );
    });
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
                    <div>{renderFormattedMarkdown(msg.text)}</div>
                  )}

                  <div className="mt-2 text-[10px] opacity-60 text-right">
                    {msg.timestamp}
                  </div>

                  {/* Follow-up suggestion pills */}
                  {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/80 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
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
