import { useEffect, useState } from "react";
import { useStore } from "../../store";
import type { WeatherData } from "../../lib/weather";
import { fetchWeather } from "../../lib/weather";
import styles from "./ClockPanel.module.css";

export default function ClockPanel() {
  const [time, setTime] = useState(new Date());
  const { weather, setWeather } = useStore();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetchWeather().then(setWeather).catch(console.error);
    const t = setInterval(() => fetchWeather().then(setWeather).catch(console.error), 10 * 60 * 1000);
    return () => clearInterval(t);
  }, [setWeather]);

  const h = String(time.getHours()).padStart(2, "0");
  const m = String(time.getMinutes()).padStart(2, "0");
  const s = String(time.getSeconds()).padStart(2, "0");
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

  return (
    <div className={styles.panel}>
      <div className={styles.timeRow}>
        <span className={styles.hm}>{h}:{m}</span>
        <span className={styles.sec}>{s}</span>
      </div>
      <div className={styles.dateRow}>
        {days[time.getDay()]} · {time.getDate()} {months[time.getMonth()]} {time.getFullYear()}
      </div>

      {weather ? (
        <div className={styles.weatherCard}>
          <div className={styles.weatherTop}>
            <span className={styles.weatherIcon}>{weather.icon}</span>
            <span className={styles.weatherTemp}>{weather.temp}°C</span>
          </div>
          <div className={styles.weatherLabel}>{weather.condition.toUpperCase()}</div>
          <div className={styles.weatherMeta}>
            <span>FEELS {weather.feelsLike}°</span>
            <span>HUM {weather.humidity}%</span>
            <span>WIND {weather.windSpeed}KM/H</span>
          </div>
        </div>
      ) : (
        <div className={styles.loading}>FETCHING WEATHER...</div>
      )}

      <div className={styles.city}>📍 KARACHI, PK</div>
    </div>
  );
}
