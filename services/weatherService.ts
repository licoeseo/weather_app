import { WeatherData, DailyForecast } from '../types';

export const fetchWeatherData = async (lat: number, lng: number): Promise<WeatherData> => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=relativehumidity_2m,precipitation_probability,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();

    // Process Daily Data (Next 7 days)
    const daily: DailyForecast[] = data.daily.time.map((time: string, index: number) => ({
      time: time,
      weathercode: data.daily.weathercode[index],
      maxTemp: data.daily.temperature_2m_max[index],
      minTemp: data.daily.temperature_2m_min[index],
    }));

    // Get current hour index to fetch hourly details (humidity/precip)
    const currentHour = new Date().getHours();
    
    return {
      currentTemp: data.current_weather.temperature,
      weatherCode: data.current_weather.weathercode,
      windSpeed: data.current_weather.windspeed, // Note: OpenMeteo current_weather has windspeed
      humidity: data.hourly.relativehumidity_2m[currentHour] || 0,
      precipitationProb: data.hourly.precipitation_probability[currentHour] || 0,
      daily: daily,
    };
  } catch (error) {
    console.error("Weather API Error:", error);
    throw error;
  }
};

// Helper to map WMO codes to readable status or generic icon names
export const getWeatherDescription = (code: number): string => {
  if (code === 0) return 'Clear Sky';
  if (code >= 1 && code <= 3) return 'Partly Cloudy';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Unknown';
};
