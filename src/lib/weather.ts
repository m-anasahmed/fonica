// Open-Meteo — completely free, no API key needed
// Default coords: Karachi, Pakistan
const LAT = 24.8607;
const LON = 67.0011;

export interface WeatherData {
  temp: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0:  { label: "Clear", icon: "☀️" },
  1:  { label: "Mostly Clear", icon: "🌤️" },
  2:  { label: "Partly Cloudy", icon: "⛅" },
  3:  { label: "Overcast", icon: "☁️" },
  45: { label: "Foggy", icon: "🌫️" },
  48: { label: "Icy Fog", icon: "🌫️" },
  51: { label: "Light Drizzle", icon: "🌦️" },
  61: { label: "Light Rain", icon: "🌧️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy Rain", icon: "🌧️" },
  71: { label: "Light Snow", icon: "🌨️" },
  80: { label: "Showers", icon: "🌦️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
};

export async function fetchWeather(): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh`;
  
  const res = await fetch(url);
  const data = await res.json();
  const cur = data.current;
  const wmo = WMO_CODES[cur.weather_code] ?? { label: "Unknown", icon: "🌡️" };

  return {
    temp: Math.round(cur.temperature_2m),
    feelsLike: Math.round(cur.apparent_temperature),
    condition: wmo.label,
    humidity: cur.relative_humidity_2m,
    windSpeed: Math.round(cur.wind_speed_10m),
    icon: wmo.icon,
  };
}
