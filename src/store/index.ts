import { create } from "zustand";
import type { SpotifyTrack } from "../lib/spotify";
import type { WeatherData } from "../lib/weather";

export type Panel = "clock" | "music" | "notifications" | "controls";

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: Date;
  read: boolean;
  icon: string;
}

interface WidgetStore {
  // Navigation
  activePanel: Panel;
  setPanel: (p: Panel) => void;

  // Spotify
  spotifyToken: string | null;
  setSpotifyToken: (t: string | null) => void;
  currentTrack: SpotifyTrack | null;
  setCurrentTrack: (t: SpotifyTrack | null) => void;

  // Weather
  weather: WeatherData | null;
  setWeather: (w: WeatherData) => void;

  // System
  volume: number;
  setVolume: (v: number) => void;
  brightness: number;
  setBrightness: (b: number) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id" | "time" | "read">) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

export const useStore = create<WidgetStore>((set) => ({
  activePanel: "clock",
  setPanel: (p) => set({ activePanel: p }),

  spotifyToken: null,
  setSpotifyToken: (t) => set({ spotifyToken: t }),
  currentTrack: null,
  setCurrentTrack: (t) => set({ currentTrack: t }),

  weather: null,
  setWeather: (w) => set({ weather: w }),

  volume: 50,
  setVolume: (v) => set({ volume: v }),
  brightness: 80,
  setBrightness: (b) => set({ brightness: b }),

  notifications: [
    {
      id: "1",
      title: "NokiaWidget",
      body: "System connected. All panels ready.",
      time: new Date(),
      read: false,
      icon: "📡",
    },
  ],
  addNotification: (n) =>
    set((s) => ({
      notifications: [
        { ...n, id: Date.now().toString(), time: new Date(), read: false },
        ...s.notifications,
      ].slice(0, 20),
    })),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),
  clearAll: () => set({ notifications: [] }),
}));
