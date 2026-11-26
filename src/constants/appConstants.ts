/**
 * Centralized Application Constants & Configuration
 * Replaces magic strings and numbers throughout the codebase for improved maintainability.
 */

export const STORAGE_KEYS = {
  GEMINI_API_KEY: 'vayumitra_gemini_api_key',
  DARK_MODE: 'vayumitra_dark_mode',
  HIGH_CONTRAST: 'vayumitra_high_contrast',
  FAMILY_PROFILE: 'vayumitra_family_profile',
  AQI_CACHE_PREFIX: 'vayumitra_aqi_cache_',
} as const;

export const APP_CONFIG = {
  /** Cache Time-To-Live in milliseconds (15 minutes) */
  AQI_CACHE_TTL_MS: 15 * 60 * 1000,
  /** Network timeout for live air quality API in ms */
  API_TIMEOUT_MS: 4000,
  /** Open-Meteo Air Quality Base URL */
  OPEN_METEO_BASE_URL: 'https://air-quality-api.open-meteo.com/v1/air-quality',
  /** Timezone for data queries */
  TIMEZONE: 'Asia/Kolkata',
} as const;

export const SECURITY_CONFIG = {
  MAX_PROMPT_LENGTH: 1200,
  MIN_PROMPT_LENGTH: 2,
  RATE_LIMIT_MAX_REQUESTS: 15,
  RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minute
} as const;

export const SCIENTIFIC_BENCHMARKS = {
  /** Average adult daily breathing volume in cubic meters */
  ADULT_DAILY_AIR_VOLUME_M3: 12.0,
  /** Micrograms PM2.5 inhaled per day equivalent to 1 cigarette (Berkeley Earth) */
  MICROGRAMS_PER_CIGARETTE: 264,
  /** Baseline CO2 emitted per km by solo petrol/diesel vehicle in kg */
  CAR_SOLO_CO2_PER_KM_KG: 0.150,
  /** Metro rail CO2 per km per passenger in kg */
  METRO_CO2_PER_KM_KG: 0.015,
  /** Net CO2 saved per km by switching car to metro */
  METRO_SAVINGS_CO2_PER_KM_KG: 0.135,
} as const;
