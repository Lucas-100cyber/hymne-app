import { useState } from "react";
import { Clock3, Heart, ListMusic, SlidersHorizontal } from "lucide-react";
import SearchBar from "./SearchBar";
import SettingsPanel from "./SettingsPanel";

export default function Header({
  query,
  onQueryChange,
  activeTab,
  onTabChange,
  favoriteCount,
  recentCount,
  playlistCount,
  onAddSong,
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const tabClass = (isActive) =>
    `flex min-w-0 items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm transition ${isActive ? "bg-white/10 text-white ring-1 ring-white/15" : "bg-gray-900 text-slate-300 hover:bg-gray-800 hover:text-white"}`;

  return (
    <>
      <section className="flex flex-col gap-5 bg-gray-950 p-4">
        <div className="flex gap-2">
          <button
            type="button"
            className="grid size-11 shrink-0 place-items-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"
            aria-label="Open profile and app settings"
            title="Profile and app settings"
            aria-haspopup="dialog"
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen(true)}
          >
            <SlidersHorizontal size={21} />
          </button>
          <SearchBar value={query} onChange={onQueryChange} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-white sm:grid-cols-4">
          <button type="button" className={tabClass(activeTab === "all")} onClick={() => onTabChange("all")} aria-pressed={activeTab === "all"}>
            <ListMusic size={18} /> All hymns
          </button>
          <button type="button" className={tabClass(activeTab === "favorites")} onClick={() => onTabChange("favorites")} aria-pressed={activeTab === "favorites"}>
            <Heart size={18} /> Favourites <span className="text-xs text-slate-400">{favoriteCount}</span>
          </button>
          <button type="button" className={tabClass(activeTab === "playlists")} onClick={() => onTabChange("playlists")} aria-pressed={activeTab === "playlists"}>
            <ListMusic size={18} /> Playlists <span className="text-xs text-slate-400">{playlistCount}</span>
          </button>
          <button type="button" className={tabClass(activeTab === "recent")} onClick={() => onTabChange("recent")} aria-pressed={activeTab === "recent"}>
            <Clock3 size={18} /> Recent <span className="text-xs text-slate-400">{recentCount}</span>
          </button>
        </div>
      </section>
      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} onAddSong={onAddSong} />}
    </>
  );
}