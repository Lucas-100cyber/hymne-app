
export default function Card({ children, onClick, className = "", variant = "" }) {
  const variantStyles = {
    songs:
      "cursor-pointer border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/20 transition duration-200 hover:border-emerald-400/40 hover:bg-slate-800/90",
  };

  const selectedVariant = variantStyles[variant] || "";

  return (
    <div onClick={onClick} className={`flex flex-col rounded-2xl ${className} ${selectedVariant}`.trim()}>
      {children}
    </div>
  );
}
