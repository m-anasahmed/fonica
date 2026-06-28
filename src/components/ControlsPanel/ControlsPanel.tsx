import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useStore } from "../../store";
import styles from "./ControlsPanel.module.css";

export default function ControlsPanel() {
  const { volume, setVolume, brightness, setBrightness } = useStore();
  const [volFeedback, setVolFeedback] = useState("");
  const [briFeedback, setBriFeedback] = useState("");

  const handleVolume = async (val: number) => {
    setVolume(val);
    try {
      await invoke("set_volume", { level: val });
      setVolFeedback(`VOL ${val}%`);
      setTimeout(() => setVolFeedback(""), 1500);
    } catch {
      setVolFeedback("USE SYS KEYS");
      setTimeout(() => setVolFeedback(""), 2000);
    }
  };

  const handleBrightness = async (val: number) => {
    setBrightness(val);
    try {
      await invoke("set_brightness", { level: val });
      setBriFeedback(`BRI ${val}%`);
      setTimeout(() => setBriFeedback(""), 1500);
    } catch {
      setBriFeedback("USE FN KEYS");
      setTimeout(() => setBriFeedback(""), 2000);
    }
  };

  const sliderFill = (val: number) =>
    `linear-gradient(to right, #0a3d52 ${val}%, rgba(0,0,0,0.15) ${val}%)`;

  return (
    <div className={styles.panel}>
      <div className={styles.title}>SYS CONTROLS</div>

      <div className={styles.control}>
        <div className={styles.controlHeader}>
          <span className={styles.controlLabel}>🔊 VOLUME</span>
          <span className={styles.controlValue}>
            {volFeedback || `${volume}%`}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={volume}
          className={styles.slider}
          style={{ background: sliderFill(volume) }}
          onChange={(e) => handleVolume(Number(e.target.value))}
        />
        <div className={styles.quickBtns}>
          {[0, 25, 50, 75, 100].map((v) => (
            <button key={v} className={styles.qBtn} onClick={() => handleVolume(v)}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.control}>
        <div className={styles.controlHeader}>
          <span className={styles.controlLabel}>☀️ BRIGHTNESS</span>
          <span className={styles.controlValue}>
            {briFeedback || `${brightness}%`}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={brightness}
          className={styles.slider}
          style={{ background: sliderFill(brightness) }}
          onChange={(e) => handleBrightness(Number(e.target.value))}
        />
        <div className={styles.quickBtns}>
          {[10, 30, 60, 80, 100].map((v) => (
            <button key={v} className={styles.qBtn} onClick={() => handleBrightness(v)}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.sysInfo}>
        <div className={styles.sysRow}>
          <span>PLATFORM</span>
          <span>WINDOWS</span>
        </div>
        <div className={styles.sysRow}>
          <span>STATUS</span>
          <span style={{ color: "#0a6e0a" }}>ONLINE ●</span>
        </div>
      </div>
    </div>
  );
}
