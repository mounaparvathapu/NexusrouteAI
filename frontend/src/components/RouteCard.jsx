import React from 'react';
import { Clock, Route, Gauge, CheckCircle2 } from 'lucide-react';
import { formatDuration, trafficClass } from '../utils/helpers';

export default function RouteCard({ route, type, isRecommended, isActive, onClick }) {
  const isMain = type === 'main';
  const color  = isMain ? '#00e5ff' : '#00ff94';
  const label  = isMain ? 'Main Route' : 'Alternative Route';
  const dash   = isMain ? '' : 'border-dashed';

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left rounded-xl p-4 border transition-all duration-200
        ${isActive
          ? 'border-opacity-80 bg-white/5'
          : 'border-opacity-30 bg-transparent hover:bg-white/3'
        }
      `}
      style={{
        borderColor: isActive ? color : '#1a2f4a',
        boxShadow: isActive ? `0 0 20px ${color}22` : 'none',
      }}
    >
      {/* Route label row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${dash}`}
            style={{ background: color, boxShadow: `0 0 8px ${color}` }}
          />
          <span className="font-display font-600 text-sm" style={{ color }}>
            {label}
          </span>
        </div>
        {isRecommended && (
          <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2 py-0.5 rounded-full">
            <CheckCircle2 size={11} />
            AI Pick
          </span>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Distance */}
        <div className="bg-white/3 rounded-lg p-2.5 text-center">
          <Route size={13} className="mx-auto mb-1 text-slate-500" />
          <p className="text-white font-display font-600 text-sm leading-none">
            {route.distance_km}
          </p>
          <p className="text-slate-600 text-xs mt-0.5">km</p>
        </div>

        {/* Duration */}
        <div className="bg-white/3 rounded-lg p-2.5 text-center">
          <Clock size={13} className="mx-auto mb-1 text-slate-500" />
          <p className="text-white font-display font-600 text-sm leading-none">
            {formatDuration(route.duration_min)}
          </p>
          <p className="text-slate-600 text-xs mt-0.5">ETA</p>
        </div>

        {/* Traffic */}
        <div className="bg-white/3 rounded-lg p-2.5 text-center">
          <Gauge size={13} className="mx-auto mb-1 text-slate-500" />
          <p className={`font-display font-600 text-sm leading-none border rounded px-1 ${trafficClass(route.traffic)}`}>
            {route.traffic}
          </p>
          <p className="text-slate-600 text-xs mt-0.5">traffic</p>
        </div>
      </div>
    </button>
  );
}
