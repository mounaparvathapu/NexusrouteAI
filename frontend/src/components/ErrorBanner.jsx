import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="rounded-xl p-4 border border-red-500/30 bg-red-500/10 animate-fade-up flex items-start gap-3">
      <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-display font-600 text-red-300">Error</p>
        <p className="text-xs text-red-400/80 mt-0.5">{message}</p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-500 hover:text-red-300 transition-colors">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
