import { describe, it, expect, vi } from 'vitest';
import { logger } from '../utils/logger';
import { STORAGE_KEYS, APP_CONFIG, SECURITY_CONFIG, SCIENTIFIC_BENCHMARKS } from '../constants/appConstants';

describe('App Constants & Scientific Benchmarks', () => {
  it('should have valid storage keys defined', () => {
    expect(STORAGE_KEYS.GEMINI_API_KEY).toBe('vayumitra_gemini_api_key');
    expect(STORAGE_KEYS.DARK_MODE).toBe('vayumitra_dark_mode');
    expect(STORAGE_KEYS.HIGH_CONTRAST).toBe('vayumitra_high_contrast');
    expect(STORAGE_KEYS.FAMILY_PROFILE).toBe('vayumitra_family_profile');
  });

  it('should have valid network and caching configurations', () => {
    expect(APP_CONFIG.AQI_CACHE_TTL_MS).toBe(15 * 60 * 1000);
    expect(APP_CONFIG.API_TIMEOUT_MS).toBe(4000);
    expect(APP_CONFIG.OPEN_METEO_BASE_URL).toContain('open-meteo.com');
  });

  it('should enforce strict security limits', () => {
    expect(SECURITY_CONFIG.MAX_PROMPT_LENGTH).toBe(1200);
    expect(SECURITY_CONFIG.MIN_PROMPT_LENGTH).toBe(2);
    expect(SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS).toBe(15);
  });

  it('should maintain calibrated Berkeley Earth benchmark constants', () => {
    expect(SCIENTIFIC_BENCHMARKS.ADULT_DAILY_AIR_VOLUME_M3).toBe(12.0);
    expect(SCIENTIFIC_BENCHMARKS.MICROGRAMS_PER_CIGARETTE).toBe(264);
    expect(SCIENTIFIC_BENCHMARKS.METRO_SAVINGS_CO2_PER_KM_KG).toBeGreaterThan(0.1);
  });
});

describe('Production Logger Utility', () => {
  it('should mask sensitive API keys in log statements', () => {
    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    
    const fakeKey = 'AIzaSyA1234567890abcdefghijklmnopqrstuv';
    logger.info(`Connecting with key ${fakeKey}`);

    expect(consoleSpy).toHaveBeenCalled();
    const loggedMessage = consoleSpy.mock.calls[0].join(' ');
    expect(loggedMessage).not.toContain(fakeKey);
    expect(loggedMessage).toContain('AIzaSy••••••••stuv');

    consoleSpy.mockRestore();
  });

  it('should safely log error objects', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const testError = new Error('Test connection failure with AIzaSy1234567890abcdefghijklmnopqrstuv');
    logger.error('Caught error:', testError);

    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
