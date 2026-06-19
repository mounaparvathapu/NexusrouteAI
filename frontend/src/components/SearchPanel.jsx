import React, { useState } from 'react';
import { MapPin, Navigation, Search, Loader2 } from 'lucide-react';

const POPULAR_ROUTES = [
  ['Hyderabad', 'Warangal'],
  ['Mumbai', 'Pune'],
  ['Bengaluru', 'Mysuru'],
  ['Delhi', 'Agra'],
  ['Chennai', 'Pondicherry'],
];

export default function SearchPanel({ onSearch, loading }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (origin.trim() && destination.trim()) {
      onSearch(origin.trim(), destination.trim());
    }
  };

  const handlePopular = (from, to) => {
    setOrigin(from);
    setDestination(to);
    onSearch(from, to);
  };

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
          <Navigation size={18} className="text-cyan-400" />
        </div>
        <div>
          <h2 className="font-display font-700 text-white text-base leading-tight">Route Planner</h2>
          <p className="text-xs text-slate-500 mt-0.5">Enter two cities to begin</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Origin */}
        <div className="relative">
          <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none" />
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Starting city…"
            className="nexus-input w-full pl-9 pr-4 py-3 rounded-xl text-sm font-body"
            required
          />
        </div>

        {/* Swap button */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-border" />
          <button
            type="button"
            onClick={handleSwap}
            className="text-slate-500 hover:text-cyan-400 transition-colors p-1"
            title="Swap cities"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5 3L2 6l3 3M11 13l3-3-3-3M2 6h12M14 10H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Destination */}
        <div className="relative">
          <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 pointer-events-none" />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destination city…"
            className="nexus-input w-full pl-9 pr-4 py-3 rounded-xl text-sm font-body"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !origin.trim() || !destination.trim()}
          className="nexus-btn w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 mt-1"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Analyzing Routes…</span>
            </>
          ) : (
            <>
              <Search size={16} />
              <span>Find Best Route</span>
            </>
          )}
        </button>
      </form>

      {/* Popular routes */}
      <div className="mt-5">
        <p className="text-xs text-slate-600 uppercase tracking-widest mb-2 font-mono">Quick Select</p>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_ROUTES.map(([from, to]) => (
            <button
              key={`${from}-${to}`}
              onClick={() => handlePopular(from, to)}
              disabled={loading}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/60 border border-border text-slate-400 hover:border-cyan-500/40 hover:text-cyan-400 transition-all disabled:opacity-40"
            >
              {from} → {to}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
