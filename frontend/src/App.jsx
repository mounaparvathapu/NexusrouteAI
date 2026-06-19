import React, { useState } from 'react';
import { Zap, Github, Info } from 'lucide-react';
import SearchPanel from './components/SearchPanel';
import MapView from './components/MapView';
import RouteCard from './components/RouteCard';
import WeatherPanel from './components/WeatherPanel';
import AIRecommendation from './components/AIRecommendation';
import LoadingState from './components/LoadingState';
import ErrorBanner from './components/ErrorBanner';
import { useRouteQuery } from './hooks/useRouteQuery';

export default function App() {
  const { data, loading, error, fetchRoute } = useRouteQuery();
  const [activeRoute, setActiveRoute] = useState('main');
  const [errorDismissed, setErrorDismissed] = useState(false);

  const handleSearch = (origin, destination) => {
    setErrorDismissed(false);
    setActiveRoute('main');
    fetchRoute(origin, destination);
  };

  // Auto-select recommended route when data loads
  React.useEffect(() => {
    if (data?.recommendation?.recommended_route) {
      setActiveRoute(data.recommendation.recommended_route);
    }
  }, [data]);

  const showError = error && !errorDismissed;

  return (
    <div className="flex flex-col h-screen bg-void overflow-hidden">
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-border glass-card z-10">
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500/20 to-green-500/20 border border-cyan-500/40 animate-pulse-glow" />
            <Zap size={16} className="absolute inset-0 m-auto text-cyan-400" />
          </div>
          <div>
            <h1 className="font-display font-800 text-white text-base leading-none tracking-tight">
              Nexus<span className="text-neon">Route</span>
              <span className="text-slate-500 font-300"> AI</span>
            </h1>
            <p className="text-xs text-slate-600 font-mono mt-0.5">Intelligent Route Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Legend */}
          {data && (
            <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-6 h-0.5 bg-cyan-400 rounded" style={{ boxShadow: '0 0 6px #00e5ff' }} />
                Main
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-6 h-0.5 rounded" style={{ background: '#00ff94', boxShadow: '0 0 6px #00ff94', borderTop: '2px dashed #00ff94' }} />
                Alt
              </span>
            </div>
          )}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-cyan-400 transition-colors"
            title="View on GitHub"
          >
            <Github size={17} />
          </a>
        </div>
      </header>

      {/* ── Main layout ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left sidebar ──────────────────────────────────────────────────── */}
        <aside className="w-80 flex-shrink-0 flex flex-col gap-3 p-4 overflow-y-auto border-r border-border">

          {/* Search */}
          <SearchPanel onSearch={handleSearch} loading={loading} />

          {/* Error */}
          {showError && (
            <ErrorBanner
              message={error}
              onDismiss={() => setErrorDismissed(true)}
            />
          )}

          {/* Loading */}
          {loading && <LoadingState />}

          {/* Results */}
          {data && !loading && (
            <>
              {/* Route comparison */}
              <div className="glass-card rounded-2xl p-4 animate-fade-up" style={{ animationDelay: '0.05s' }}>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-3 flex items-center gap-2">
                  <span className="w-4 h-px bg-border" />
                  Route Comparison
                  <span className="flex-1 h-px bg-border" />
                </p>
                <div className="space-y-2">
                  <RouteCard
                    route={data.main_route}
                    type="main"
                    isRecommended={data.recommendation.recommended_route === 'main'}
                    isActive={activeRoute === 'main'}
                    onClick={() => setActiveRoute('main')}
                  />
                  <RouteCard
                    route={data.alternative_route}
                    type="alternative"
                    isRecommended={data.recommendation.recommended_route === 'alternative'}
                    isActive={activeRoute === 'alternative'}
                    onClick={() => setActiveRoute('alternative')}
                  />
                </div>
              </div>

              {/* Weather */}
              <WeatherPanel weather={data.weather} />

              {/* AI */}
              <AIRecommendation recommendation={data.recommendation} />
            </>
          )}

          {/* Empty state hint */}
          {!data && !loading && !showError && (
            <div className="glass-card rounded-2xl p-5 text-center border-dashed">
              <Info size={20} className="mx-auto text-slate-700 mb-2" />
              <p className="text-xs text-slate-600">
                Enter an origin and destination above to see routes, weather, traffic, and AI recommendations.
              </p>
            </div>
          )}
        </aside>

        {/* ── Map ───────────────────────────────────────────────────────────── */}
        <main className="flex-1 relative">
          <MapView data={data} activeRoute={activeRoute} />

          {/* Loading overlay on map */}
          {loading && (
            <div className="absolute inset-0 bg-void/60 backdrop-blur-sm z-10 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full border-2 border-cyan-500/20 mx-auto animate-spin-slow"
                  style={{ borderTopColor: '#00e5ff' }}
                />
                <p className="text-cyan-400 font-mono text-xs mt-3 animate-pulse">
                  Computing routes…
                </p>
              </div>
            </div>
          )}

          {/* Active route floating badge */}
          {data && !loading && (
            <div className="absolute top-4 right-4 z-10 glass-card rounded-xl px-3 py-2 flex items-center gap-2 border border-border shadow-lg">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: activeRoute === 'main' ? '#00e5ff' : '#00ff94',
                  boxShadow: `0 0 8px ${activeRoute === 'main' ? '#00e5ff' : '#00ff94'}`,
                }}
              />
              <span className="text-xs font-mono text-slate-300">
                {activeRoute === 'main' ? 'Main Route' : 'Alternative Route'} active
              </span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
