import React from 'react';
import { DailyForecast } from '../types';
import { WeatherIcon } from './WeatherIcon';

interface ForecastStripProps {
  forecast: DailyForecast[];
}

export const ForecastStrip: React.FC<ForecastStripProps> = ({ forecast }) => {
  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  return (
    <div className="w-full mt-6">
      <h3 className="text-center text-sm font-bold tracking-widest mb-3 text-gray-500">7-DAY FORECAST</h3>
      <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2 px-2 justify-between">
        {forecast.map((day, idx) => (
          <div key={idx} className="flex flex-col items-center min-w-[3rem] p-2 bg-white/40 rounded-xl backdrop-blur-sm border border-white/60 shadow-sm">
            <WeatherIcon code={day.weathercode} className="w-6 h-6 mb-2" />
            <span className="text-xs font-bold text-deep-text">{getDayName(day.time)}</span>
            <span className="text-xs text-gray-500 mt-1">{Math.round(day.maxTemp)}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};
