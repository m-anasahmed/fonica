// ─────────────────────────────────────────────
// PASTE YOUR SPOTIFY CLIENT ID BELOW
// Get it from: developer.spotify.com/dashboard
// ─────────────────────────────────────────────
export const SPOTIFY_CLIENT_ID = "YOUR_CLIENT_ID_HERE";

export const SPOTIFY_REDIRECT_URI = "http://localhost:1420/callback";

export const SPOTIFY_SCOPES = [
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
  "user-read-email",
  "user-read-private",
].join(" ");

export const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(SPOTIFY_SCOPES)}&show_dialog=true`;
