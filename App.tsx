import React, { useState, useEffect } from 'react';
import { CITY_LIST } from './constants';
import { City, WeatherData } from './types';
import { fetchWeatherData, getWeatherDescription } from './services/weatherService';
import { getOutfitSuggestion } from './services/geminiService';
import { WeatherIcon } from './components/WeatherIcon';
import { ForecastStrip } from './components/ForecastStrip';
import { ChevronDown, Wind, Droplets, CloudRain, Sparkles, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City>(CITY_LIST[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // AI State
  const [outfitText, setOutfitText] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    loadWeather(selectedCity);
    setOutfitText(null); // Reset AI suggestion on city change
  }, [selectedCity]);

  const loadWeather = async (city: City) => {
    setLoading(true);
    try {
      const data = await fetchWeatherData(city.lat, city.lng);
      setWeather(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetOutfit = async () => {
    if (!weather) return;
    setIsAiLoading(true);
    setShowModal(true);
    const suggestion = await getOutfitSuggestion(selectedCity.name, weather);
    setOutfitText(suggestion);
    setIsAiLoading(false);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    const city = CITY_LIST.find(c => c.name === cityName);
    if (city) setSelectedCity(city);
  };

  // Construct City Image URL (using picsum with seed for consistency)
  // Using city name hash or index to keep the image consistent for the demo
  const cityImageSeed = selectedCity.name.replace(/\s/g, ''); 
  const cityImageUrl = `https://picsum.photos/seed/${cityImageSeed}/600/600`;

  return (
    <div className="min-h-screen w-full bg-dreamy-gradient p-4 md:p-8 flex justify-center items-center">
      
      {/* Main Container - Card Style */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-[32px] border-4 border-white shadow-2xl overflow-hidden relative">
        
        {/* Decorative Header Sparkles */}
        <div className="absolute top-4 left-4 text-pink-300 opacity-50 animate-pulse"><Sparkles size={20} /></div>
        <div className="absolute top-4 right-4 text-blue-300 opacity-50 animate-pulse delay-75"><Sparkles size={20} /></div>

        {/* 1. Header Section */}
        <header className="pt-8 pb-4 text-center">
          <h1 className="text-4xl tracking-widest text-deep-text font-serif">WEATHER</h1>
        </header>

        {/* 2. City Selection Section */}
        <div className="px-8 mb-8 relative">
          <div className="relative group">
             <select 
              value={selectedCity.name}
              onChange={handleCityChange}
              className="w-full appearance-none bg-white border-2 border-pink-200 text-center py-3 rounded-xl text-lg font-bold text-gray-600 focus:outline-none focus:border-pink-400 transition-colors cursor-pointer hover:bg-pink-50"
            >
              {CITY_LIST.map(city => (
                <option key={city.name} value={city.name}>{city.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-pink-300 pointer-events-none" />
          </div>
          <p className="text-xs text-center text-gray-400 mt-2">請選擇城市</p>
        </div>

        {loading || !weather ? (
          <div className="h-64 flex items-center justify-center text-pink-400 animate-bounce">
            <Heart fill="currentColor" size={48} />
          </div>
        ) : (
          <div className="px-6 pb-24">
            
            {/* 3. Current Weather Info Section */}
            <div className="flex flex-row items-center justify-between mb-8">
              {/* Left: Icon Box (Gray/Pink box in wireframe) */}
              <div className="w-1/2 bg-gray-100/50 rounded-2xl aspect-square flex flex-col items-center justify-center border-2 border-white shadow-inner p-4">
                <WeatherIcon code={weather.weatherCode} className="w-16 h-16 md:w-20 md:h-20 mb-2 drop-shadow-md" />
                <span className="text-sm font-bold text-gray-500 font-serif text-center uppercase leading-tight">
                  {getWeatherDescription(weather.weatherCode)}
                </span>
              </div>

              {/* Right: City Name & Big Temp */}
              <div className="w-1/2 pl-6 flex flex-col justify-center relative">
                 <h2 className="text-xl font-bold font-serif mb-0 text-deep-text">{selectedCity.name}</h2>
                 <div className="relative">
                   <span className="text-8xl font-serif text-deep-text leading-none -ml-1">
                     {Math.round(weather.currentTemp)}
                   </span>
                   <span className="text-2xl font-serif absolute top-2 text-gray-400">°C</span>
                   <Heart className="absolute top-0 right-0 text-pink-400 w-5 h-5" />
                 </div>
              </div>
            </div>

            {/* Environmental Data (Humidity, Rain, Wind) */}
            <div className="flex justify-around bg-white/40 p-3 rounded-xl mb-6 shadow-sm border border-white">
                <div className="flex flex-col items-center">
                    <Droplets size={18} className="text-blue-400 mb-1" />
                    <span className="text-xs font-bold text-gray-600">{weather.humidity}%</span>
                    <span className="text-[10px] text-gray-400 uppercase">Humidity</span>
                </div>
                <div className="flex flex-col items-center">
                    <CloudRain size={18} className="text-indigo-400 mb-1" />
                    <span className="text-xs font-bold text-gray-600">{weather.precipitationProb}%</span>
                    <span className="text-[10px] text-gray-400 uppercase">Rain Prob.</span>
                </div>
                 <div className="flex flex-col items-center">
                    <Wind size={18} className="text-teal-400 mb-1" />
                    <span className="text-xs font-bold text-gray-600">{weather.windSpeed}km/h</span>
                    <span className="text-[10px] text-gray-400 uppercase">Wind</span>
                </div>
            </div>

            {/* 7-Day Forecast */}
            <ForecastStrip forecast={weather.daily} />

            {/* 4. City Image Section */}
            <div className="mt-8 mb-6 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-300 to-blue-300 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                     <img 
                      src={cityImageUrl} 
                      alt={selectedCity.name} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                    />
                     <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                         <h3 className="text-white font-serif text-4xl drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase tracking-widest">
                           {selectedCity.name}
                         </h3>
                     </div>
                </div>
            </div>

          </div>
        )}

        {/* 5. Sticky Bottom Button Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/90 to-transparent">
             <button 
              onClick={handleGetOutfit}
              disabled={loading || !weather}
              className="w-full py-4 bg-gray-800 text-white font-serif text-lg tracking-widest rounded-full shadow-lg hover:bg-gray-900 active:scale-95 transition-all flex items-center justify-center gap-2 group border-2 border-transparent hover:border-pink-300"
            >
              <Sparkles className="w-5 h-5 text-yellow-300 group-hover:animate-spin" />
              本日穿搭建議
            </button>
        </div>

        {/* Outfit Suggestion Modal/Overlay */}
        {showModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-6">
            <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm border-4 border-pink-100 relative animate-fade-in-up">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              
              <h3 className="text-xl font-serif text-center mb-4 flex items-center justify-center gap-2 text-pink-500">
                <Sparkles size={20} /> Outfit AI
              </h3>
              
              <div className="min-h-[100px] flex items-center justify-center">
                {isAiLoading ? (
                   <div className="flex flex-col items-center gap-2">
                     <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
                     <p className="text-xs text-gray-400 animate-pulse">Consulting the fashion stars...</p>
                   </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-700 font-medium leading-relaxed">{outfitText}</p>
                    <div className="mt-4 flex justify-center gap-2">
                       <span className="px-2 py-1 bg-pink-100 text-pink-600 text-xs rounded-md">#Cute</span>
                       <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-md">#OOTD</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
