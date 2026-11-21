export type AqiCategory = 
  | 'Good'           // 0 - 50
  | 'Satisfactory'   // 51 - 100
  | 'Moderate'       // 101 - 200
  | 'Poor'           // 201 - 300
  | 'Very Poor'      // 301 - 400
  | 'Severe'         // 401 - 500
  | 'Hazardous';     // 500+

export interface PollutantValues {
  pm25: number;      // µg/m³
  pm10: number;      // µg/m³
  no2: number;       // µg/m³
  so2: number;       // µg/m³
  co: number;        // mg/m³
  o3: number;        // µg/m³
}

export interface HourlyForecast {
  time: string;       // e.g. "06:00"
  aqi: number;
  pm25: number;
  temperature: number;
  inversionRisk: 'Low' | 'Medium' | 'High' | 'Severe';
  isSafeVentingWindow: boolean;
  recommendation: string;
}

export interface CityStation {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  currentAqi: number;
  dominantPollutant: 'PM2.5' | 'PM10' | 'NO2';
  category: AqiCategory;
  pollutants: PollutantValues;
  weather: {
    temp: number;
    humidity: number;
    windSpeed: number; // km/h
    condition: string;
  };
  forecast: HourlyForecast[];
  lastUpdated: string;
  source: 'live' | 'station-cache';
  stationName: string;
}

export interface AqiScaleDefinition {
  min: number;
  max: number;
  category: AqiCategory;
  colorHex: string;
  bgHex: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  healthImplications: string;
  cautionaryStatement: string;
  familyAdvice: {
    children: string;
    seniors: string;
    general: string;
  };
}

