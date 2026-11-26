import { useState, useEffect, useCallback } from 'react';
import { CityStation } from '../types/aqi';
import { AqiService } from '../services/aqiService';
import { INDIAN_CITIES_STATIONS } from '../data/citiesData';
import { logger } from '../utils/logger';

export interface UseAqiDataReturn {
  /** All supported Indian city stations */
  cities: CityStation[];
  /** Currently selected city ID */
  selectedCityId: string;
  /** Complete air quality and forecast data for current city */
  cityData: CityStation;
  /** Whether a network fetch is currently in progress */
  isLoading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Callback to select a different city station */
  selectCity: (id: string) => void;
  /** Callback to force re-fetch live air data */
  refresh: () => void;
}

/**
 * Custom Hook for real-time Air Quality Data
 * Manages active city station, live Open-Meteo queries, local TTL caching, and graceful fallbacks.
 */
export function useAqiData(initialCityId?: string): UseAqiDataReturn {
  const [cities] = useState<CityStation[]>(AqiService.getAllCities());
  const [selectedCityId, setSelectedCityId] = useState<string>(
    initialCityId || INDIAN_CITIES_STATIONS[0].id
  );
  const [cityData, setCityData] = useState<CityStation>(
    INDIAN_CITIES_STATIONS.find((c) => c.id === selectedCityId) || INDIAN_CITIES_STATIONS[0]
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCity = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AqiService.getCityData(id);
      setCityData(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch AQI data';
      setError(errorMessage);
      logger.error(`Failed to fetch AQI for city station "${id}":`, err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCity(selectedCityId);
  }, [selectedCityId, fetchCity]);

  const selectCity = (id: string): void => {
    setSelectedCityId(id);
  };

  const refresh = (): void => {
    fetchCity(selectedCityId);
  };

  return {
    cities,
    selectedCityId,
    cityData,
    isLoading,
    error,
    selectCity,
    refresh,
  };
}
