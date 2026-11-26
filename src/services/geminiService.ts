import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_INSTRUCTION_VAYUMITRA } from '../data/personaPrompts';
import { SecurityService } from './securityService';
import { CityStation } from '../types/aqi';
import { FamilyProfile } from '../types/routines';
import { STORAGE_KEYS } from '../constants/appConstants';
import { logger } from '../utils/logger';
import { ExpertEngineService } from './expertEngineService';

export interface AssistantResponse {
  text: string;
  source: 'gemini' | 'expert_engine';
  impactCallout?: string;
  suggestions?: string[];
  error?: string;
}

/**
 * Service managing GenAI interactions via Google Generative AI (Gemini)
 * and providing resilient zero-setup fallback via the Deterministic AI Expert Engine.
 */
export class GeminiService {
  /**
   * Retrieves saved API key from localStorage or Vite environment
   */
  public static getApiKey(): string | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
      if (stored && stored.trim()) return stored.trim();
    } catch (err: unknown) {
      logger.warn('Failed to access localStorage for Gemini API Key:', err);
    }
    // Strongly typed via vite-env.d.ts
    return import.meta.env.VITE_GEMINI_API_KEY || null;
  }

  /**
   * Saves or clears API key in localStorage
   */
  public static setApiKey(key: string): void {
    try {
      if (key.trim()) {
        localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, key.trim());
      } else {
        localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
      }
    } catch (err: unknown) {
      logger.error('Failed to save Gemini API Key to localStorage:', err);
    }
  }

  /**
   * Generates a context-aware air quality advisory response
   * using either live Gemini 1.5 Flash or the built-in Expert Engine.
   */
  public static async generateSmogAdvice(
    userPrompt: string,
    city: CityStation,
    profile?: FamilyProfile
  ): Promise<AssistantResponse> {
    return this.askAssistant(userPrompt, city, profile);
  }

  public static async askAssistant(
    userPrompt: string,
    city: CityStation,
    profile?: FamilyProfile
  ): Promise<AssistantResponse> {
    // 1. Security & Validation Check (OWASP Prompt Injection + XSS defense)
    const validation = SecurityService.validatePrompt(userPrompt);
    if (!validation.isValid) {
      return {
        text: `⚠️ **Security Alert**: ${validation.threatDetected || 'Invalid prompt submission.'}\n\nPlease submit an inquiry related to air quality, family health routines, or sustainable alternatives.`,
        source: 'expert_engine',
        error: validation.threatDetected,
      };
    }

    const rateLimit = SecurityService.checkRateLimit();
    if (!rateLimit.allowed) {
      return {
        text: `⏳ **Rate Limit Notice**: You are asking questions rapidly. Please wait ${rateLimit.waitSeconds} seconds before sending another request to protect computing resources.`,
        source: 'expert_engine',
        error: 'Rate limit reached',
      };
    }

    const apiKey = this.getApiKey();

    // 2. If API Key is configured, attempt live Google Generative AI
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: SYSTEM_INSTRUCTION_VAYUMITRA,
        });

        const contextPrompt = `
Current Context:
- Location: ${city.name} (${city.state})
- Real-time AQI: ${city.currentAqi} (${city.category})
- Dominant Pollutant: ${city.dominantPollutant} (PM2.5: ${city.pollutants.pm25} µg/m³, PM10: ${city.pollutants.pm10} µg/m³)
- Temperature & Humidity: ${city.weather.temp}°C, ${city.weather.humidity}%
${
  profile
    ? `- Family Composition: ${profile.familyMembersCount} members (${profile.hasInfants ? '👶 Infant' : ''} ${profile.hasSeniors ? '👴 Senior' : ''} ${profile.hasAsthmaRespiratory ? '🫁 Asthma/COPD' : ''})
- Commute: ${profile.commuteMode} (${profile.dailyCommuteDistanceKm} km/day)
- Kitchen Fuel: ${profile.cookingFuel}`
    : ''
}

User Question:
${validation.sanitizedText}

Provide an actionable, empathetic, and scientifically rigorous response. At the end, explicitly calculate and state the **Direct Impact of this Choice** (PM2.5 inhaled vs avoided, cigarette equivalence, or CO2 reduction).
`.trim();

        const result = await model.generateContent(contextPrompt);
        const responseText = result.response.text();

        return {
          text: responseText,
          source: 'gemini',
          suggestions: ExpertEngineService.generateFollowUpSuggestions(validation.sanitizedText),
        };
      } catch (err: unknown) {
        logger.warn(
          'Gemini API call failed, falling back to Expert Engine:',
          err instanceof Error ? err.message : err
        );
        // Fall through to Built-in Expert Engine
      }
    }

    // 3. Built-in Deterministic AI Expert Engine (Zero Setup / Instant / Resilient)
    return ExpertEngineService.generateExpertResponse(validation.sanitizedText, city, profile);
  }
}
