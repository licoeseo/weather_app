export interface City {
  name: string;
  lat: number;
  lng: number;
  countryCode: string; // Used for REST Countries flag if needed, or image seeding
}

export interface DailyForecast {
  time: string;
  weathercode: number;
  maxTemp: number;
  minTemp: number;
}

export interface WeatherData {
  currentTemp: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  precipitationProb: number;
  daily: DailyForecast[];
}

export interface OutfitSuggestion {
  text: string;
  isLoading: boolean;
  error: string | null;
}
