import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      <input
        className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by hymn title or number"
        aria-label="Search hymns by title or number"
      />
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />
    </div>
  );
}
