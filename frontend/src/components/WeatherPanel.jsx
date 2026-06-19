import React from 'react';
import { Wind, Droplets, Thermometer } from 'lucide-react';
import { owmIconUrl } from '../utils/helpers';

function WeatherCard({ label, weather, accent }) {
  return (
    <div className="flex-1 bg-white/3 rounded-xl p-3 border border-white/5">
      <p className="text-xs text-slate-600 uppercase tracking-widest font-mono mb-2">{label}</p>
      <div className="flex items-center gap-2">
        {weather.icon && (
          <img
            src={owmIconUrl(weather.icon)}
            alt={weather.description}
            className="w-10 h-10 -ml-1"
          />
        )}
        <div>
          <p className="font-display font-700 text-xl leading-none" style={{ color: accent }}>
            {weather.temp_c}°
          </p>
          <p className="text-slate-400 text-xs mt-0.5">{weather.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Droplets size={11} className="text-blue-400" />
          {weather.humidity}%
        </span>
        <span className="flex items-center gap-1">
          <Wind size={11} className="text-slate-400" />
          {weather.wind_speed_mps} m/s
        </span>
      </div>
    </div>
  );
}

export default function WeatherPanel({ weather }) {
  if (!weather) return null;

  return (
    <div className="glass-card rounded-2xl p-4 animate-fade-up" style={{ animationDelay: '0.15s' }}>
      <div className="flex items-center gap-2 mb-3">
        <Thermometer size={15} className="text-amber-400" />
        <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Weather Along Route</p>
      </div>

      <div className="flex gap-2">
        <WeatherCard label="Start" weather={weather.start} accent="#00e5ff" />
        <WeatherCard label="Midpoint" weather={weather.midpoint} accent="#ffb800" />
        <WeatherCard label="End" weather={weather.end} accent="#00ff94" />
      </div>
    </div>
  );
}
