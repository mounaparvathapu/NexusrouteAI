import React from 'react';

const STEPS = [
  'Geocoding cities…',
  'Fetching main route…',
  'Computing alternative route…',
  'Loading weather data…',
  'Running AI analysis…',
];

export default function LoadingState() {
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s + 1) % STEPS.length);
    }, 900);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-card rounded-2xl p-6 text-center animate-fade-up">
      {/* Spinner */}
      <div className="relative w-14 h-14 mx-auto mb-4">
        <div
          className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-spin-slow"
          style={{ borderTopColor: '#00e5ff' }}
        />
        <div
          className="absolute inset-2 rounded-full border-2 border-green-500/20"
          style={{
            borderTopColor: '#00ff94',
            animation: 'spin-slow 2s linear infinite reverse',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>
      </div>

      <p className="font-display font-600 text-white text-sm">Processing Route</p>
      <p className="text-xs text-cyan-400 mt-1 font-mono transition-all duration-300">
        {STEPS[step]}
      </p>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: i <= step ? '#00e5ff' : '#1a2f4a',
              boxShadow: i === step ? '0 0 8px #00e5ff' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
