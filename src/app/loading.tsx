export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-black border-t-brand-green rounded-full animate-spin mb-4 shadow-neo-sm"></div>
        <p className="text-black font-black text-xl uppercase tracking-widest animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
