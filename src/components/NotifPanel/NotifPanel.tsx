import { useStore } from "../../store";
import styles from "./NotifPanel.module.css";

export default function NotifPanel() {
  const { notifications, markAllRead, clearAll } = useStore();
  const unread = notifications.filter((n) => !n.read).length;

  const fmt = (d: Date) => {
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>INBOX</span>
        {unread > 0 && <span className={styles.badge}>{unread}</span>}
      </div>

      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={markAllRead}>MARK READ</button>
        <button className={styles.actionBtn} onClick={clearAll}>CLEAR ALL</button>
      </div>

      <div className={styles.list}>
        {notifications.length === 0 && (
          <div className={styles.empty}>NO NOTIFICATIONS</div>
        )}
        {notifications.map((n) => (
          <div key={n.id} className={`${styles.item} ${n.read ? styles.read : styles.unread}`}>
            <div className={styles.itemTop}>
              <span className={styles.itemIcon}>{n.icon}</span>
              <span className={styles.itemTitle}>{n.title.toUpperCase()}</span>
              <span className={styles.itemTime}>{fmt(new Date(n.time))}</span>
            </div>
            <div className={styles.itemBody}>{n.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
