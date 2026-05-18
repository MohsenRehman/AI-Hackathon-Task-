import React from 'react';
import { Stethoscope, CheckCircle2, FlaskConical, ShieldAlert } from 'lucide-react';
import RiskMeter from './RiskMeter.jsx';
import FallbackUI from './FallbackUI.jsx';

const DiagnosisResult = ({ diagnosisLog }) => {
  if (!diagnosisLog) return null;

  const { aiResponse, isFallback } = diagnosisLog;
  const { possibleConditions = [], riskLevel = 'low', suggestedTests = [], recommendations = [], disclaimer } = aiResponse || {};

  return (
    <div className="space-y-6">
      {isFallback && <FallbackUI />}

      {/* Risk Meter */}
      <RiskMeter riskLevel={riskLevel} />

      {/* Structured Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Possible Conditions */}
        <div className="card">
          <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
            <Stethoscope className="h-4 w-4 text-primary-500" />
            Possible Conditions
          </h4>
          <ul className="space-y-2.5">
            {possibleConditions.map((cond, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-semibold">
                <span className="h-5 w-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-[10px]">
                  {idx + 1}
                </span>
                {cond}
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested Diagnostic Tests */}
        <div className="card">
          <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
            <FlaskConical className="h-4 w-4 text-medical-blue" />
            Recommended Diagnostic Tests
          </h4>
          <ul className="space-y-2">
            {suggestedTests.map((test, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="h-4 w-4 text-medical-blue flex-shrink-0" />
                {test}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations & Action Plan */}
      <div className="card">
        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
          <CheckCircle2 className="h-4 w-4 text-medical-green" />
          Clinical Action Plan & Recommendations
        </h4>
        <ul className="space-y-2">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
              <span className="h-1.5 w-1.5 rounded-full bg-medical-green mt-1.5 flex-shrink-0"></span>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      {disclaimer && (
        <div className="flex items-start gap-2 p-3 bg-slate-50 border border-slate-100 rounded-lg text-[10px] text-slate-400 leading-relaxed">
          <ShieldAlert className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>{disclaimer}</span>
        </div>
      )}
    </div>
  );
};

export default DiagnosisResult;
