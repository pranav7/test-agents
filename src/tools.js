export async function getLocation() {
  console.log("[getLocation] getting location")
  return "Dublin, Ireland";
}

export async function getCurrentWeather({ location, unit = "celsius" }) {
  console.log("[getCurrentWeather] getting current weather", location, unit)

  const weather = {
    location,
    unit,
    temperature: 2,
    forecast: "snowy"
  };

  return JSON.stringify(weather);
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
