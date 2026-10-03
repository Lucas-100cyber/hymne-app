import { useEffect, useState } from "react";
import { BookOpenText, CircleUserRound, Info, Plus, X } from "lucide-react";

const PROFILE_NAME_KEY = "hymne-app:profile-name";
const panelTabs = [
  { id: "profile", label: "Profile", icon: CircleUserRound },
  { id: "about", label: "About the author", icon: Info },
  { id: "add-song", label: "Add a song", icon: Plus },
];

export default function SettingsPanel({ onClose, onAddSong }) {
  const [activePanel, setActivePanel] = useState("profile");
  const [profileName, setProfileName] = useState(() => window.localStorage.getItem(PROFILE_NAME_KEY) ?? "Hymn lover");
  const [savedProfile, setSavedProfile] = useState(false);
  const [songTitle, setSongTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [songMessage, setSongMessage] = useState("");

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  function saveProfile(event) {
    event.preventDefault();
    const name = profileName.trim();
    if (!name) return;
    window.localStorage.setItem(PROFILE_NAME_KEY, name);
    setProfileName(name);
    setSavedProfile(true);
  }

  function submitSong(event) {
    event.preventDefault();
    if (!songTitle.trim() || !lyrics.trim()) {
      setSongMessage("Add both a title and lyrics to continue.");
      return;
    }

    if (!onAddSong(songTitle, lyrics)) {
      setSongMessage("This song could not be added. Check the title and lyrics.");
      return;
    }

    setSongTitle("");
    setLyrics("");
    setSongMessage("Song added to your collection.");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-[7vh] backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="settings-title"
        aria-modal="true"
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-[#111a17] text-stone-100 shadow-2xl shadow-black/50"
        role="dialog"
      >
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Hymn</p>
            <h2 className="mt-1 text-lg font-semibold" id="settings-title">Nyimbo Za Chitsitsimutso</h2>
          </div>
          <button
            aria-label="Close panel"
            className="grid size-9 place-items-center rounded-md text-slate-400 transition hover:bg-white/10 hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </header>

        <div className="grid sm:min-h-[390px] sm:grid-cols-[180px_1fr]">
          <nav aria-label="Profile and app options" className="flex gap-1 overflow-x-auto border-b border-white/10 p-3 sm:flex-col sm:border-b-0 sm:border-r sm:p-4">
            {panelTabs.map(({ id, label, icon: Icon }) => (
              <button
                aria-selected={activePanel === id}
                className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm transition ${activePanel === id ? "bg-emerald-300/10 text-emerald-100" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
                key={id}
                onClick={() => setActivePanel(id)}
                role="tab"
                type="button"
              >
                <Icon size={17} /> {label}
              </button>
            ))}
          </nav>

          <div className="min-w-0 p-5 sm:p-6" role="tabpanel">
            {activePanel === "profile" && (
              <div>
                <div className="mb-6 flex items-center gap-4">
                  <div className="grid size-14 place-items-center rounded-full bg-emerald-300/15 font-serif text-xl text-emerald-200">
                    {(profileName.trim()[0] || "H").toLocaleUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{profileName || "Hymn lover"}</h3>
                    <p className="text-sm text-slate-400">Profile saved on this device</p>
                  </div>
                </div>
                <form className="space-y-4" onSubmit={saveProfile}>
                  <label className="block text-sm text-slate-300" htmlFor="profile-name">Display name</label>
                  <input
                    className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2.5 text-sm focus:border-emerald-300/60 focus:outline-none"
                    id="profile-name"
                    maxLength={40}
                    onChange={(event) => {
                      setProfileName(event.target.value);
                      setSavedProfile(false);
                    }}
                    value={profileName}
                  />
                  <button className="rounded-md bg-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200" type="submit">Save profile</button>
                  {savedProfile && <p className="text-sm text-emerald-200" role="status">Profile saved.</p>}
                </form>
              </div>
            )}

            {activePanel === "about" && (
              <article className="max-w-md">
                <BookOpenText className="mb-5 text-emerald-300" size={26} />
                <h3 className="font-serif text-2xl">About the author</h3>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                    The Application was created by Lucas, a passionate developer and God's servant. It is designed to provide users with an easy way to explore and enjoy hymns.
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Contributions you add are saved in your collection on this device.
                </p>
              </article>
            )}

            {activePanel === "add-song" && (
              <form className="space-y-4" onSubmit={submitSong}>
                <div>
                  <h3 className="font-serif text-2xl">Add a song</h3>
                  <p className="mt-1 text-sm text-slate-400">New hymns are saved in your local collection.</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-slate-300" htmlFor="song-title">Title</label>
                  <input
                    className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2.5 text-sm focus:border-emerald-300/60 focus:outline-none"
                    id="song-title"
                    maxLength={100}
                    onChange={(event) => setSongTitle(event.target.value)}
                    placeholder="Song title"
                    required
                    value={songTitle}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-slate-300" htmlFor="song-lyrics">Lyrics</label>
                  <textarea
                    className="min-h-40 w-full resize-y rounded-md border border-white/10 bg-black/20 px-3 py-2.5 text-sm leading-6 focus:border-emerald-300/60 focus:outline-none"
                    id="song-lyrics"
                    onChange={(event) => setLyrics(event.target.value)}
                    placeholder="Enter lyrics, one line per row"
                    required
                    value={lyrics}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button className="inline-flex items-center gap-2 rounded-md bg-emerald-300 px-4 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200" type="submit">
                    <Plus size={17} /> Add song
                  </button>
                  {songMessage && <p className="text-sm text-emerald-200" role="status">{songMessage}</p>}
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}