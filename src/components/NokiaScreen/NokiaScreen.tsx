import { useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useStore, type Panel } from "../../store";
import ClockPanel from "../ClockPanel/ClockPanel";
import MusicPanel from "../MusicPanel/MusicPanel";
import NotifPanel from "../NotifPanel/NotifPanel";
import ControlsPanel from "../ControlsPanel/ControlsPanel";
import styles from "./NokiaScreen.module.css";

const PANELS: { id: Panel; label: string; icon: string }[] = [
  { id: "clock", label: "CLOCK", icon: "⏰" },
  { id: "music", label: "MUSIC", icon: "♫" },
  { id: "notifications", label: "NOTIF", icon: "🔔" },
  { id: "controls", label: "SYS", icon: "⚙️" },
];

export default function NokiaScreen() {
  const { activePanel, setPanel, notifications } = useStore();
  const dragRef = useRef(false);
  const unread = notifications.filter((n) => !n.read).length;

  const handleMouseDown = async (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    dragRef.current = true;
    try {
      await invoke("drag_window");
    } catch {}
    dragRef.current = false;
  };

  const handleClose = async () => {
    try { await invoke("close_widget"); } catch {}
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.screen} onMouseDown={handleMouseDown}>
        {/* Scanlines overlay */}
        <div className={styles.scanlines} />

        {/* Status bar */}
        <div className={styles.statusBar} data-no-drag>
          <div className={styles.statusLeft}>
            <div className={styles.signal}>
              <span /><span /><span /><span />
            </div>
            <span className={styles.statusIcon}>✉</span>
          </div>
          <div className={styles.clock} id="statusClock">
            <LiveClock />
          </div>
          <div className={styles.statusRight}>
            <div className={styles.battery}>
              <span /><span /><span /><span />
              <div className={styles.batteryTip} />
            </div>
            <button className={styles.closeBtn} onClick={handleClose} data-no-drag>✕</button>
          </div>
        </div>

        {/* Panel content */}
        <div className={styles.content} data-no-drag>
          {activePanel === "clock" && <ClockPanel />}
          {activePanel === "music" && <MusicPanel />}
          {activePanel === "notifications" && <NotifPanel />}
          {activePanel === "controls" && <ControlsPanel />}
        </div>

        {/* Bottom nav */}
        <div className={styles.nav} data-no-drag>
          {PANELS.map((p) => (
            <button
              key={p.id}
              className={`${styles.navBtn} ${activePanel === p.id ? styles.navActive : ""}`}
              onClick={() => setPanel(p.id)}
            >
              <span className={styles.navIcon}>{p.icon}</span>
              {p.id === "notifications" && unread > 0 && (
                <span className={styles.navBadge}>{unread}</span>
              )}
              <span className={styles.navLabel}>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Softkey bar */}
        <div className={styles.softkeys}>
          <span>Menu</span>
          <span>Back</span>
        </div>
      </div>
    </div>
  );
}

function LiveClock() {
  const [, forceUpdate] = useStore((s) => [s.activePanel, s.setPanel]);
  void forceUpdate;
  const now = new Date();
  const h = now.getHours() % 12 || 12;
  const m = String(now.getMinutes()).padStart(2, "0");
  return <>{h}:{m}</>;
}
