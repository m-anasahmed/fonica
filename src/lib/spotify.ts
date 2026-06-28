const BASE = "https://api.spotify.com/v1";

function headers(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export interface SpotifyTrack {
  name: string;
  artists: string;
  album: string;
  albumArt: string;
  durationMs: number;
  progressMs: number;
  isPlaying: boolean;
  deviceName: string;
}

export async function getCurrentTrack(token: string): Promise<SpotifyTrack | null> {
  const res = await fetch(`${BASE}/me/player/currently-playing`, {
    headers: headers(token),
  });
  if (res.status === 204 || !res.ok) return null;
  const data = await res.json();
  if (!data || !data.item) return null;
  return {
    name: data.item.name,
    artists: data.item.artists.map((a: { name: string }) => a.name).join(", "),
    album: data.item.album.name,
    albumArt: data.item.album.images?.[0]?.url ?? "",
    durationMs: data.item.duration_ms,
    progressMs: data.progress_ms ?? 0,
    isPlaying: data.is_playing,
    deviceName: data.device?.name ?? "Unknown",
  };
}

export async function playPause(token: string, isPlaying: boolean) {
  const endpoint = isPlaying ? "pause" : "play";
  await fetch(`${BASE}/me/player/${endpoint}`, {
    method: "PUT",
    headers: headers(token),
  });
}

export async function skipNext(token: string) {
  await fetch(`${BASE}/me/player/next`, {
    method: "POST",
    headers: headers(token),
  });
}

export async function skipPrev(token: string) {
  await fetch(`${BASE}/me/player/previous`, {
    method: "POST",
    headers: headers(token),
  });
}

export async function setSpotifyVolume(token: string, vol: number) {
  await fetch(`${BASE}/me/player/volume?volume_percent=${vol}`, {
    method: "PUT",
    headers: headers(token),
  });
}
