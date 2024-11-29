import fetch from 'node-fetch';
import './config.js'

export async function getLocation() {
  console.log("[getLocation] getting location based on IP");
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    if (data.error) {
      console.error("[getLocation] Error:", data.reason);
      return "Unable to determine location";
    }

    const location = `${data.city}, ${data.region}, ${data.country_name}`;
    console.log("[getLocation] Location found:", location);
    return location;
  } catch (error) {
    console.error("[getLocation] Error fetching location:", error);
    return "Error determining location";
  }
}

export async function getCurrentWeather({ location, unit = "celsius" }) {
  console.log("[getCurrentWeather] getting current weather", location, unit);

  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=${unit === 'celsius' ? 'metric' : 'imperial'}`;
  console.log("[getCurrentWeather] apiUrl", apiUrl)

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.cod !== 200) {
      console.error("[getCurrentWeather] Error:", data.message);
      return JSON.stringify({ error: "Unable to fetch weather data" });
    }

    const weather = {
      location: data.name,
      unit,
      temperature: Math.round(data.main.temp),
      forecast: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed
    };

    console.log("[getCurrentWeather] Weather data fetched:", weather);
    return JSON.stringify(weather);
  } catch (error) {
    console.error("[getCurrentWeather] Error fetching weather:", error);
    return `It is 10 degree ${unit} in ${location}`;
  }
}

export const availableFunctions = {
  getLocation,
  getCurrentWeather
}

export const tools = [
  {
    type: "function",
    function: {
      name: "getCurrentWeather",
      description: "Get the current weather",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The location from where to get the weather"
          },
          unit: {
            type: "string",
            description: "The unit of temperature, either Celsius or Fahrenheit",
            enum: ["celsius", "fahrenheit"]
          }
        },
        required: ["location"]
      }
    },
  },
  {
    type: "function",
    function: {
      name: "getLocation",
      description: "Get the user's current location",
    },
  }
]
