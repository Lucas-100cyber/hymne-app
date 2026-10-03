import { useState } from "react";
import Card from "./Card";
import { Link, useNavigate } from "react-router-dom";
import { ListMusic, Plus, Trash2, X } from "lucide-react";

export default function Container({
    query,
    activeTab,
    songs,
    favoriteIds,
    recentIds,
    playlists,
    onCreatePlaylist,
    onDeletePlaylist,
    onRemoveSongFromPlaylist,
}) {
    const navigate = useNavigate();
    const [playlistName, setPlaylistName] = useState("");
    const [playlistMessage, setPlaylistMessage] = useState("");
    const normalizedQuery = query.trim().toLocaleLowerCase();

    if (activeTab === "playlists") {
        function handleCreatePlaylist(event) {
            event.preventDefault();
            const created = onCreatePlaylist(playlistName);
            setPlaylistMessage(created ? `Created “${playlistName.trim()}”.` : "Enter a name that is not already in use.");
            if (created) setPlaylistName("");
        }

        const matchingPlaylists = playlists.filter((playlist) =>
            playlist.name.toLocaleLowerCase().includes(normalizedQuery)
        );

        return (
            <main className="min-h-screen bg-black px-4 py-6 text-white sm:px-8">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-6 flex items-center gap-3">
                        <ListMusic className="text-emerald-300" size={22} />
                        <div>
                            <h1 className="text-xl font-semibold">Your playlists</h1>
                            <p className="text-sm text-slate-400">Create collections of hymns for easy listening.</p>
                        </div>
                    </div>

                    <form className="mb-8 flex flex-col gap-3 sm:flex-row" onSubmit={handleCreatePlaylist}>
                        <label className="sr-only" htmlFor="playlist-name">Playlist name</label>
                        <input
                            id="playlist-name"
                            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            value={playlistName}
                            onChange={(event) => setPlaylistName(event.target.value)}
                            placeholder="Name your playlist"
                            maxLength={60}
                        />
                        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200" type="submit">
                            <Plus size={18} /> Create playlist
                        </button>
                    </form>
                    {playlistMessage && <p className="-mt-5 mb-6 text-sm text-emerald-200" role="status">{playlistMessage}</p>}

                    {matchingPlaylists.length ? (
                        <div className="space-y-8">
                            {matchingPlaylists.map((playlist) => {
                                const playlistSongs = playlist.songIds
                                    .map((songId) => songs.find((song) => song.id === songId))
                                    .filter((song) => song && (
                                        song.title.toLocaleLowerCase().includes(normalizedQuery) ||
                                        String(song.id).includes(normalizedQuery)
                                    ));

                                return (
                                    <section className="border-t border-white/10 pt-5" key={playlist.id}>
                                        <div className="mb-3 flex items-center justify-between gap-4">
                                            <div>
                                                <h2 className="font-semibold">{playlist.name}</h2>
                                                <p className="mt-1 text-xs text-slate-400">{playlist.songIds.length} {playlist.songIds.length === 1 ? "hymn" : "hymns"}</p>
                                            </div>
                                            <button
                                                type="button"
                                                className="rounded-md p-2 text-slate-400 transition hover:bg-rose-400/10 hover:text-rose-200"
                                                onClick={() => onDeletePlaylist(playlist.id)}
                                                aria-label={`Delete ${playlist.name}`}
                                                title="Delete playlist"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                        {playlistSongs.length ? (
                                            <div className="flex flex-col gap-2">
                                                {playlistSongs.map((song) => (
                                                    <Card className="flex-row items-center justify-between gap-3" key={song.id}>
                                                        <Link className="min-w-0 flex-1 py-1 hover:text-emerald-200" to={`/song/${song.id}`}>
                                                            {song.id}. {song.title}
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            className="rounded-md p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                                                            onClick={() => onRemoveSongFromPlaylist(playlist.id, song.id)}
                                                            aria-label={`Remove ${song.title} from ${playlist.name}`}
                                                            title="Remove hymn"
                                                        >
                                                            <X size={17} />
                                                        </button>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="rounded-lg border border-dashed border-white/10 px-4 py-5 text-sm text-slate-400">
                                                {playlist.songIds.length ? "No hymns match your search." : "This playlist is empty. Open a hymn and add it to this playlist."}
                                            </p>
                                        )}
                                    </section>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="py-10 text-center text-slate-400">
                            {playlists.length ? "No playlists match your search." : "No playlists yet. Create one to get started."}
                        </p>
                    )}
                </div>
            </main>
        );
    }

    const visibleSongs = activeTab === "favorites"
        ? songs.filter((song) => favoriteIds.includes(song.id))
        : activeTab === "recent"
            ? recentIds.map((id) => songs.find((song) => song.id === id)).filter(Boolean)
            : songs;
    const matchingSongs = visibleSongs.filter((song) =>
        song.title.toLocaleLowerCase().includes(normalizedQuery) ||
        String(song.id).includes(normalizedQuery)
    );
    const emptyMessage = activeTab === "favorites"
        ? "No favourite hymns yet. Open a hymn and tap Add to favourites."
        : activeTab === "recent"
            ? "Hymns you open will appear here."
            : `No hymns found for “${query}”.`;

    return(
        <>
        <div className="flex flex-col gap-5 p-4  min-h-full bg-black flex text-white">
            {matchingSongs.length > 0 ? matchingSongs.map((song) => (
                <Card variant="songs" key={song.id} onClick={() => navigate(`/song/${song.id}`)}>
                    {song.id}. {song.title}
                </Card>
            )) : <p className="py-8 text-center text-slate-400">{emptyMessage}</p>}
        </div>
        </>
    )
}