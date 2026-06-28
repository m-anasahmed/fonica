import { useEffect, useRef } from "react";
import { useStore } from "../../store";
import { getCurrentTrack, playPause, skipNext, skipPrev } from "../../lib/spotify";
import { SPOTIFY_AUTH_URL } from "../../lib/spotify.config";
import { open } from "@tauri-apps/plugin-shell";
import styles from "./MusicPanel.module.css";

export default function MusicPanel() {
  const { spotifyToken, setSpotifyToken, currentTrack, setCurrentTrack } = useStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Handle OAuth callback token from URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("access_token");
      if (token) {
        setSpotifyToken(token);
        window.history.replaceState({}, "", "/");
      }
    }
  }, [setSpotifyToken]);

  useEffect(() => {
    if (!spotifyToken) return;
    const poll = () => getCurrentTrack(spotifyToken).then(setCurrentTrack).catch(console.error);
    poll();
    intervalRef.current = setInterval(poll, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [spotifyToken, setCurrentTrack]);

  const handleLogin = async () => {
    await open(SPOTIFY_AUTH_URL);
  };

  const handlePlayPause = async () => {
    if (!spotifyToken || !currentTrack) return;
    await playPause(spotifyToken, currentTrack.isPlaying);
  };

  const handleNext = async () => {
    if (!spotifyToken) return;
    await skipNext(spotifyToken);
    setTimeout(() => getCurrentTrack(spotifyToken!).then(setCurrentTrack), 500);
  };

  const handlePrev = async () => {
    if (!spotifyToken) return;
    await skipPrev(spotifyToken);
    setTimeout(() => getCurrentTrack(spotifyToken!).then(setCurrentTrack), 500);
  };

  const progress = currentTrack
    ? Math.round((currentTrack.progressMs / currentTrack.durationMs) * 100)
    : 0;

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  if (!spotifyToken) {
    return (
      <div className={styles.panel}>
        <div className={styles.spotifyLogo}>♫</div>
        <div className={styles.notConnected}>SPOTIFY</div>
        <div className={styles.subText}>NOT CONNECTED</div>
        <button className={styles.connectBtn} onClick={handleLogin}>
          CONNECT →
        </button>
        <div className={styles.hint}>Browser will open for login</div>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div className={styles.panel}>
        <div className={styles.spotifyLogo}>♫</div>
        <div className={styles.notConnected}>SPOTIFY</div>
        <div className={styles.subText}>NO TRACK PLAYING</div>
        <div className={styles.hint}>Play something on Spotify</div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      {currentTrack.albumArt && (
        <img className={styles.albumArt} src={currentTrack.albumArt} alt="album" />
      )}

      <div className={styles.trackName}>{currentTrack.name.toUpperCase()}</div>
      <div className={styles.artistName}>{currentTrack.artists.toUpperCase()}</div>
      <div className={styles.albumName}>{currentTrack.album.toUpperCase()}</div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
      <div className={styles.timeRow}>
        <span>{fmt(currentTrack.progressMs)}</span>
        <span>{fmt(currentTrack.durationMs)}</span>
      </div>

      <div className={styles.controls}>
        <button className={styles.ctrlBtn} onClick={handlePrev}>◄◄</button>
        <button className={styles.playBtn} onClick={handlePlayPause}>
          {currentTrack.isPlaying ? "▐▐" : "▶"}
        </button>
        <button className={styles.ctrlBtn} onClick={handleNext}>►►</button>
      </div>

      <div className={styles.device}>
        🔊 {currentTrack.deviceName.toUpperCase()}
      </div>
    </div>
  );
}
