import { GoogleGenAI } from "@google/genai";
import { WeatherData } from "../types";

export const getOutfitSuggestion = async (
  cityName: string,
  weather: WeatherData
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found");
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are a fashion assistant with a "kawaii" and "trendy" personality.
      The user is in ${cityName}.
      Current Weather:
      - Temperature: ${weather.currentTemp}°C
      - Condition Code: ${weather.weatherCode}
      - Humidity: ${weather.humidity}%
      - Wind Speed: ${weather.windSpeed} km/h
      - Rain Probability: ${weather.precipitationProb}%

      Please provide a short, cute, and practical outfit suggestion for today (max 50 words). 
      Include specific clothing items (e.g., "wear a fluffy cardigan").
      Tone: Cheerful, helpful, like a best friend.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Wear something comfy and cute today! ✨";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oopsy! I couldn't check my fashion magazine right now. Just wear your favorite smile! :)";
  }
};
