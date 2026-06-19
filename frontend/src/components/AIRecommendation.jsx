import React from 'react';
import { Brain, Sparkles, CheckCircle2, BarChart3 } from 'lucide-react';

const CONFIDENCE_COLOR = { High: '#00ff94', Moderate: '#ffb800', Low: '#ff3d5a' };

export default function AIRecommendation({ recommendation }) {
  if (!recommendation) return null;

  const { recommended_route, scores, confidence, reasons, summary } = recommendation;
  const isMain = recommended_route === 'main';
  const accentColor = isMain ? '#00e5ff' : '#00ff94';
  const confColor = CONFIDENCE_COLOR[confidence] || '#00ff94';

  const mainScore = Math.max(0, Math.round(scores.main));
  const altScore  = Math.max(0, Math.round(scores.alternative));
  const maxScore  = Math.max(mainScore, altScore, 1);

  return (
    <div
      className="glass-card rounded-2xl p-5 ai-glow animate-fade-up"
      style={{ animationDelay: '0.25s', borderColor: accentColor + '44' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: accentColor + '18', border: `1px solid ${accentColor}44` }}
          >
            <Brain size={16} style={{ color: accentColor }} />
          </div>
          <div>
            <p className="font-display font-700 text-sm text-white">AI Recommendation</p>
            <p className="text-xs text-slate-500">Route intelligence engine</p>
          </div>
        </div>
        <span
          className="text-xs font-mono px-2 py-0.5 rounded-full border"
          style={{ color: confColor, borderColor: confColor + '44', background: confColor + '11' }}
        >
          {confidence} confidence
        </span>
      </div>

      {/* Winner badge */}
      <div
        className="rounded-xl p-3 mb-4 flex items-center gap-3"
        style={{ background: accentColor + '0f', border: `1px solid ${accentColor}33` }}
      >
        <CheckCircle2 size={20} style={{ color: accentColor, flexShrink: 0 }} />
        <div>
          <p className="font-display font-600 text-sm" style={{ color: accentColor }}>
            {isMain ? 'Main Route' : 'Alternative Route'} Recommended
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{summary}</p>
        </div>
      </div>

      {/* Score comparison bars */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 size={13} className="text-slate-500" />
          <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Route Scores</p>
        </div>

        {[
          { label: 'Main Route', score: mainScore, color: '#00e5ff' },
          { label: 'Alternative', score: altScore, color: '#00ff94' },
        ].map(({ label, score, color }) => (
          <div key={label} className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">{label}</span>
              <span className="font-mono" style={{ color }}>{score}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(score / maxScore) * 100}%`,
                  background: `linear-gradient(90deg, ${color}88, ${color})`,
                  boxShadow: `0 0 8px ${color}66`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Reasons */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={13} className="text-slate-500" />
          <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Key Factors</p>
        </div>
        <ul className="space-y-1">
          {reasons.map((r, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: accentColor }}
              />
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
