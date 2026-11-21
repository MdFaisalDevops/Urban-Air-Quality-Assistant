import { useState, useEffect, useCallback } from 'react';
import { CityStation } from '../types/aqi';
import { AqiService } from '../services/aqiService';
import { INDIAN_CITIES_STATIONS } from '../data/citiesData';

export function useAqiData(initialCityId?: string) {
  const [cities] = useState<CityStation[]>(AqiService.getAllCities());
  const [selectedCityId, setSelectedCityId] = useState<string>(
    initialCityId || INDIAN_CITIES_STATIONS[0].id
  );
  const [cityData, setCityData] = useState<CityStation>(
    INDIAN_CITIES_STATIONS.find((c) => c.id === selectedCityId) || INDIAN_CITIES_STATIONS[0]
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCity = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AqiService.getCityData(id);
      setCityData(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch AQI data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCity(selectedCityId);
  }, [selectedCityId, fetchCity]);

  const selectCity = (id: string) => {
    setSelectedCityId(id);
  };

  const refresh = () => {
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

