import { useEffect, useState } from "react";
import Header from "./components/Header";
import Container from "./components/Container";
import SongPage from "./pages/SongPage";
import { Route, Routes, useLocation } from "react-router-dom";
import defaultSongs from "./data/songs";

const FAVORITES_STORAGE_KEY = "hymne-app:favorites";
const RECENTS_STORAGE_KEY = "hymne-app:recent";
const PLAYLISTS_STORAGE_KEY = "hymne-app:playlists";
const CUSTOM_SONGS_STORAGE_KEY = "hymne-app:custom-songs";

function readSongIds(key) {
  try {
    const storedIds = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(storedIds)
      ? [...new Set(storedIds.map(Number).filter(Number.isInteger))]
      : [];
  } catch {
    return [];
  }
}

function readPlaylists() {
  try {
    const storedPlaylists = JSON.parse(window.localStorage.getItem(PLAYLISTS_STORAGE_KEY) ?? "[]");
    if (!Array.isArray(storedPlaylists)) return [];

    return storedPlaylists
      .filter((playlist) => playlist && typeof playlist.id === "string" && typeof playlist.name === "string")
      .map((playlist) => ({
        ...playlist,
        songIds: Array.isArray(playlist.songIds)
          ? [...new Set(playlist.songIds.map(Number).filter(Number.isInteger))]
          : [],
      }));
  } catch {
    return [];
  }
}

function readCustomSongs() {
  try {
    const storedSongs = JSON.parse(window.localStorage.getItem(CUSTOM_SONGS_STORAGE_KEY) ?? "[]");
    if (!Array.isArray(storedSongs)) return [];

    const knownIds = new Set(defaultSongs.map((song) => song.id));
    return storedSongs.filter((song) => {
      if (!song || !Number.isInteger(song.id) || typeof song.title !== "string" || typeof song.content !== "string") {
        return false;
      }
      if (knownIds.has(song.id)) return false;
      knownIds.add(song.id);
      return true;
    });
  } catch {
    return [];
  }
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function App() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [favoriteIds, setFavoriteIds] = useState(() => readSongIds(FAVORITES_STORAGE_KEY));
  const [recentIds, setRecentIds] = useState(() => readSongIds(RECENTS_STORAGE_KEY));
  const [playlists, setPlaylists] = useState(readPlaylists);
  const [customSongs, setCustomSongs] = useState(readCustomSongs);
  const allSongs = [...defaultSongs, ...customSongs];
  const location = useLocation();

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    window.localStorage.setItem(RECENTS_STORAGE_KEY, JSON.stringify(recentIds));
  }, [recentIds]);

  useEffect(() => {
    window.localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    window.localStorage.setItem(CUSTOM_SONGS_STORAGE_KEY, JSON.stringify(customSongs));
  }, [customSongs]);

  useEffect(() => {
    const match = location.pathname.match(/^\/song\/(\d+)$/);
    if (!match) return;

    const songId = Number(match[1]);
    setRecentIds((ids) => [songId, ...ids.filter((id) => id !== songId)].slice(0, 20));
  }, [location.pathname]);

  function toggleFavorite(songId) {
    setFavoriteIds((ids) =>
      ids.includes(songId) ? ids.filter((id) => id !== songId) : [...ids, songId]
    );
  }

  function createPlaylist(name) {
    const normalizedName = name.trim();
    if (!normalizedName || playlists.some((playlist) => playlist.name.toLocaleLowerCase() === normalizedName.toLocaleLowerCase())) {
      return false;
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setPlaylists((items) => [...items, { id, name: normalizedName, songIds: [] }]);
    return true;
  }

  function deletePlaylist(playlistId) {
    setPlaylists((items) => items.filter((playlist) => playlist.id !== playlistId));
  }

  function addSongToPlaylist(playlistId, songId) {
    const playlist = playlists.find((item) => item.id === playlistId);
    if (!playlist || playlist.songIds.includes(songId)) return false;

    setPlaylists((items) => items.map((item) =>
      item.id === playlistId ? { ...item, songIds: [...item.songIds, songId] } : item
    ));
    return true;
  }

  function removeSongFromPlaylist(playlistId, songId) {
    setPlaylists((items) => items.map((item) =>
      item.id === playlistId
        ? { ...item, songIds: item.songIds.filter((id) => id !== songId) }
        : item
    ));
  }

  function addSong(title, lyrics) {
    const normalizedTitle = title.trim();
    const normalizedLyrics = lyrics.trim();
    if (!normalizedTitle || !normalizedLyrics) return false;

    const id = allSongs.reduce((largestId, song) => Math.max(largestId, song.id), 0) + 1;
    const content = `<div class="text-white text-lg leading-relaxed text-left">${escapeHtml(normalizedLyrics).replace(/\r?\n/g, "<br>")}</div>`;
    setCustomSongs((items) => [...items, { id, title: normalizedTitle, content }]);
    setActiveTab("all");
    setQuery("");
    return true;
  }

  return (
    <>
    <div className="bg-gray-900 min-h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header
                onAddSong={addSong}
                query={query}
                onQueryChange={setQuery}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                favoriteCount={favoriteIds.length}
                recentCount={recentIds.length}
                playlistCount={playlists.length}
              />
              <Container
                query={query}
                activeTab={activeTab}
                songs={allSongs}
                favoriteIds={favoriteIds}
                recentIds={recentIds}
                playlists={playlists}
                onCreatePlaylist={createPlaylist}
                onDeletePlaylist={deletePlaylist}
                onRemoveSongFromPlaylist={removeSongFromPlaylist}
              />
            </>
          }
        />
        <Route
          path="/song/:id"
          element={
            <SongPage
              songs={allSongs}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
              playlists={playlists}
              onAddSongToPlaylist={addSongToPlaylist}
            />
          }
        />
      </Routes>
    </div>
    </>
  )
}

export default App