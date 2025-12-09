import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog, Moon } from 'lucide-react';

interface WeatherIconProps {
  code: number;
  className?: string;
  isNight?: boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, className = "w-6 h-6", isNight = false }) => {
  // Mapping WMO codes to Lucide Icons
  if (code === 0) return isNight ? <Moon className={className} /> : <Sun className={`${className} text-yellow-400`} />;
  if (code >= 1 && code <= 3) return <Cloud className={`${className} text-blue-300`} />;
  if (code >= 45 && code <= 48) return <CloudFog className={`${className} text-gray-400`} />;
  if (code >= 51 && code <= 55) return <CloudDrizzle className={`${className} text-blue-400`} />;
  if (code >= 61 && code <= 65) return <CloudRain className={`${className} text-blue-500`} />;
  if (code >= 71 && code <= 77) return <CloudSnow className={`${className} text-cyan-200`} />;
  if (code >= 80 && code <= 82) return <CloudRain className={`${className} text-blue-600`} />;
  if (code >= 95) return <CloudLightning className={`${className} text-yellow-500`} />;

  return <Sun className={className} />;
};
