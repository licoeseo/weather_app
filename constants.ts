import { City } from './types';

// Pre-defined mapping list for smooth UX as requested in Spec Part 4 (Mapping List)
export const CITY_LIST: City[] = [
  { name: 'Taipei City', lat: 25.0330, lng: 121.5654, countryCode: 'TW' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, countryCode: 'JP' },
  { name: 'New York', lat: 40.7128, lng: -74.0060, countryCode: 'US' },
  { name: 'London', lat: 51.5074, lng: -0.1278, countryCode: 'GB' },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, countryCode: 'FR' },
  { name: 'Seoul', lat: 37.5665, lng: 126.9780, countryCode: 'KR' },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, countryCode: 'AU' },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, countryCode: 'US' },
];
