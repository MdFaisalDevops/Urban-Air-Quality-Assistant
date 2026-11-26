import { CityStation, HourlyForecast } from '../types/aqi';
import { INDIAN_CITIES_STATIONS } from '../data/citiesData';
import { getAqiCategory } from '../constants/aqiScales';
import { APP_CONFIG, STORAGE_KEYS } from '../constants/appConstants';
import { logger } from '../utils/logger';

interface CachedAqiRecord {
  timestamp: number;
  data: CityStation;
}

/**
 * Service managing live AQI data retrieval, CPCB linear interpolation calculations,
 * and resilient local caching.
 */
export class AqiService {
  /**
   * Retrieves all supported Indian city stations with calibrated default data
   */
  public static getAllCities(): CityStation[] {
    return INDIAN_CITIES_STATIONS;
  }

  /**
   * Fetches real-time air quality data for a given city station.
   * Order of precedence: Memory/Storage Cache -> Live Open-Meteo API -> Calibrated Fallback.
   */
  public static async getCityData(stationId: string): Promise<CityStation> {
    const defaultStation = INDIAN_CITIES_STATIONS.find((c) => c.id === stationId) || INDIAN_CITIES_STATIONS[0];
    const cacheKey = `${STORAGE_KEYS.AQI_CACHE_PREFIX}${stationId}`;

    // 1. Check local cache
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as CachedAqiRecord;
        if (Date.now() - parsed.timestamp < APP_CONFIG.AQI_CACHE_TTL_MS) {
          logger.debug(`Serving AQI data for ${stationId} from cache`);
          return parsed.data;
        }
      }
    } catch (err: unknown) {
      logger.warn(`Failed reading cache for station ${stationId}:`, err);
    }

    // 2. Attempt Live API Fetch from Open-Meteo Air Quality
    try {
      const { lat, lon } = defaultStation;
      const url = `${APP_CONFIG.OPEN_METEO_BASE_URL}?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,nitrogen_dioxide,sulphur_dioxide,ozone,carbon_monoxide&hourly=pm10,pm2_5,nitrogen_dioxide&timezone=${encodeURIComponent(APP_CONFIG.TIMEZONE)}&forecast_days=2`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.API_TIMEOUT_MS);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        const current = json.current;
        const hourly = json.hourly;

        if (current && current.pm2_5 !== undefined) {
          const pm25 = Math.round(current.pm2_5 * 10) / 10;
          const pm10 = Math.round((current.pm10 ?? pm25 * 1.5) * 10) / 10;
          const no2 = Math.round((current.nitrogen_dioxide ?? 45) * 10) / 10;
          const so2 = Math.round((current.sulphur_dioxide ?? 15) * 10) / 10;
          const co = Math.round(((current.carbon_monoxide ?? 1500) / 1000) * 10) / 10;
          const o3 = Math.round((current.ozone ?? 30) * 10) / 10;

          const calculatedAqi = this.calculateCpcbAqi(pm25, pm10);
          const category = getAqiCategory(calculatedAqi);

          // Build hourly forecast from API
          const forecast: HourlyForecast[] = [];
          if (hourly && hourly.time && hourly.pm2_5) {
            const currentHour = new Date().getHours();
            // Sample next 8 intervals (every 3 hours)
            for (let i = currentHour; i < currentHour + 24; i += 3) {
              const idx = i < hourly.time.length ? i : currentHour;
              const hourPm25 = Math.round(hourly.pm2_5[idx] || pm25);
              const hourTime = `${String(i % 24).padStart(2, '0')}:00`;
              const hourAqi = this.calculateCpcbAqi(hourPm25, hourPm25 * 1.4);
              
              const isAfternoon = (i % 24) >= 13 && (i % 24) <= 15;
              const isMorningSmogPeak = (i % 24) >= 5 && (i % 24) <= 9;

              forecast.push({
                time: hourTime,
                aqi: hourAqi,
                pm25: hourPm25,
                temperature: isAfternoon ? 22 : isMorningSmogPeak ? 11 : 16,
                inversionRisk: isMorningSmogPeak ? 'Severe' : isAfternoon ? 'Low' : 'High',
                isSafeVentingWindow: isAfternoon && hourAqi < 300,
                recommendation: isAfternoon
                  ? 'Safe Venting Window: 15-min controlled room ventilation.'
                  : isMorningSmogPeak
                  ? 'Severe morning smog inversion: seal doors, wear N95.'
                  : 'Maintain indoor filtration; avoid outdoor exercise.',
              });
            }
          }

          const liveStation: CityStation = {
            ...defaultStation,
            currentAqi: calculatedAqi,
            dominantPollutant: pm25 > pm10 ? 'PM2.5' : 'PM10',
            category,
            pollutants: {
              pm25,
              pm10,
              no2,
              so2,
              co,
              o3,
            },
            forecast: forecast.length > 0 ? forecast : defaultStation.forecast,
            lastUpdated: 'Just now (Live Open-Meteo)',
            source: 'live',
          };

          // Cache valid response
          try {
            const cachePayload: CachedAqiRecord = {
              timestamp: Date.now(),
              data: liveStation,
            };
            localStorage.setItem(cacheKey, JSON.stringify(cachePayload));
          } catch (cacheErr: unknown) {
            logger.warn(`Failed writing AQI cache for ${stationId}:`, cacheErr);
          }

          return liveStation;
        }
      }
    } catch (fetchErr: unknown) {
      logger.warn(`Live API fetch failed for station ${stationId}, serving default:`, fetchErr);
    }

    // 3. Fallback to calibrated station defaults
    return defaultStation;
  }

  /**
   * Calculates Indian CPCB Air Quality Sub-Index
   * Based on CPCB National Air Quality Index calculation rules
   */
  public static calculateCpcbAqi(pm25: number, pm10: number): number {
    const subPm25 = this.linearInterpolation(pm25, [
      { bpL: 0, bpH: 30, iL: 0, iH: 50 },
      { bpL: 31, bpH: 60, iL: 51, iH: 100 },
      { bpL: 61, bpH: 90, iL: 101, iH: 200 },
      { bpL: 91, bpH: 120, iL: 201, iH: 300 },
      { bpL: 121, bpH: 250, iL: 301, iH: 400 },
      { bpL: 251, bpH: 500, iL: 401, iH: 500 },
    ]);

    const subPm10 = this.linearInterpolation(pm10, [
      { bpL: 0, bpH: 50, iL: 0, iH: 50 },
      { bpL: 51, bpH: 100, iL: 51, iH: 100 },
      { bpL: 101, bpH: 250, iL: 101, iH: 200 },
      { bpL: 251, bpH: 350, iL: 201, iH: 300 },
      { bpL: 351, bpH: 430, iL: 301, iH: 400 },
      { bpL: 431, bpH: 600, iL: 401, iH: 500 },
    ]);

    return Math.max(subPm25, subPm10);
  }

  private static linearInterpolation(
    conc: number,
    breakpoints: Array<{ bpL: number; bpH: number; iL: number; iH: number }>
  ): number {
    if (conc <= 0) return 0;
    for (const bp of breakpoints) {
      if (conc >= bp.bpL && conc <= bp.bpH) {
        return Math.round(
          ((bp.iH - bp.iL) / (bp.bpH - bp.bpL)) * (conc - bp.bpL) + bp.iL
        );
      }
    }
    // If above maximum breakpoint
    const highest = breakpoints[breakpoints.length - 1];
    return Math.min(650, Math.round(highest.iH + (conc - highest.bpH) * 0.4));
  }
}
