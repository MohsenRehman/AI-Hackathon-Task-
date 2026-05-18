import React from 'react';
import { AlertCircle } from 'lucide-react';

const FallbackUI = () => {
  return (
    <div className="p-4 bg-medical-amber-light border border-amber-300 rounded-xl flex items-start gap-3 mb-6">
      <AlertCircle className="h-5 w-5 text-medical-amber flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="text-sm font-bold text-slate-800">AI Service Offline (Fallback Mode Active)</h4>
        <p className="text-xs text-slate-600 mt-1">
          Our advanced AI engines are currently experiencing heavy traffic or maintenance. We have activated safe, generic medical recommendations. Please consult a licensed professional before taking actions.
        </p>
      </div>
    </div>
  );
};

export default FallbackUI;
