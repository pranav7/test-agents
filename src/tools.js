export async function getLocation() {
  console.log("getting location")
  return "Dublin, Ireland";
}

export async function getCurrentWeather() {
  const weather = {
    temperature: 2,
    unit: "Celsius",
    forecast: "snowy"
  };

  return JSON.stringify(weather);
}