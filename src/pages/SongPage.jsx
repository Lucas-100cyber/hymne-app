import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Heart, ListPlus, Music2 } from "lucide-react";
import { useState } from "react";

export default function SongPage({ songs, favoriteIds, onToggleFavorite, playlists, onAddSongToPlaylist }) {
  const [playlistMessage, setPlaylistMessage] = useState("");
  const { id } = useParams();
  const song = songs.find((item) => item.id === Number(id));

  if (!song) {
    return (
      <main className="min-h-screen bg-[#101a17] px-6 py-8 text-stone-100 sm:px-10">
        <Link className="inline-flex items-center gap-2 text-sm text-emerald-200 hover:text-white" to="/">
          <ArrowLeft size={16} /> Back to songs
        </Link>
        <h1 className="mt-16 font-serif text-3xl">Song not found</h1>
      </main>
    );
  }

  const isFavorite = favoriteIds.includes(song.id);

  return (
    <main className="min-h-screen px-5 py-7 text-stone-100 sm:px-10 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link className="inline-flex items-center gap-2 text-sm text-emerald-200 transition hover:text-white" to="/">
            <ArrowLeft size={16} /> Back to songs
          </Link>
          <button
            type="button"
            onClick={() => onToggleFavorite(song.id)}
            aria-pressed={isFavorite}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${isFavorite ? "border-rose-300/30 bg-rose-400/10 text-rose-200 hover:bg-rose-400/15" : "border-white/15 bg-white/5 text-stone-100 hover:border-rose-300/40 hover:text-rose-200"}`}
          >
            <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
            {isFavorite ? "Added to favourites" : "Add to favourites"}
          </button>
        </div>

        <details className="group mt-5 rounded-lg border border-white/10 bg-white/[.03]">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm text-stone-200 marker:hidden hover:text-white">
            <ListPlus size={18} className="text-emerald-300" /> Add to playlist
          </summary>
          <div className="border-t border-white/10 p-3">
            {playlists.length ? (
              <div className="flex flex-wrap gap-2">
                {playlists.map((playlist) => {
                  const alreadyAdded = playlist.songIds.includes(song.id);
                  return (
                    <button
                      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${alreadyAdded ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200" : "border-white/10 bg-black/20 text-stone-200 hover:border-emerald-300/30 hover:text-emerald-100"}`}
                      key={playlist.id}
                      type="button"
                      onClick={() => {
                        const added = onAddSongToPlaylist(playlist.id, song.id);
                        setPlaylistMessage(added ? `Added to “${playlist.name}”.` : `Already in “${playlist.name}”.`);
                      }}
                      disabled={alreadyAdded}
                    >
                      {alreadyAdded && <Check size={15} />}
                      {playlist.name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                No playlists yet. <Link className="text-emerald-200 underline underline-offset-4" to="/">Create one from the Playlists tab.</Link>
              </p>
            )}
            {playlistMessage && <p className="mt-3 text-sm text-emerald-200" role="status">{playlistMessage}</p>}
          </div>
        </details>

        <header className="border-b border-white/10 pb-8 pt-14 sm:pt-20">
          <div className="flex items-center gap-3 text-emerald-300">
            <Music2 size={18} strokeWidth={1.8} />
            <p className="text-xs font-semibold uppercase tracking-[0.2em]">Hymn {String(song.id).padStart(2, "0")}</p>
          </div>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">{song.title}</h1>
          <div className="mt-7 h-1 w-14 bg-amber-300" />
        </header>

        <section aria-label="Lyrics" className="mt-8 rounded-lg border border-white/10 bg-black/20 px-5 py-7 shadow-xl shadow-black/10 sm:px-10 sm:py-10">
          <div className="max-w-2xl whitespace-pre-line text-lg leading-8 text-stone-100 sm:text-xl sm:leading-9" dangerouslySetInnerHTML={{ __html: song.content }} />
        </section>
      </div>
    </main>
  );
}