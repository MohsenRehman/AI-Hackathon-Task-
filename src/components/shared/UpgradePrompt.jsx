import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Award } from 'lucide-react';
import { usePlan } from '../../hooks/usePlan.js';

const UpgradePrompt = ({ feature }) => {
  const navigate = useNavigate();
  const { planName } = usePlan();

  const featureLabels = {
    aiEnabled: 'AI Symptom Analysis & Prescriptions Explanation',
    advancedAnalytics: 'Advanced Dashboard Analytics & Aggregations',
    exportReports: 'PDF Reports Exporting & Cloud Storage',
    multiDoctor: 'Multi-Doctor Coordination Tools',
  };

  const featureDesc = featureLabels[feature] || 'Premium SaaS Feature';

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 card text-center max-w-xl mx-auto mt-10">
      <div className="p-4 bg-medical-amber-light text-medical-amber rounded-full mb-6">
        <Award className="h-12 w-12" />
      </div>
      <h2 className="text-2xl font-bold font-display text-slate-900 mb-2">Upgrade Required</h2>
      <p className="text-slate-600 mb-6">
        The feature <span className="font-semibold text-slate-800">"{featureDesc}"</span> is only available on the **Pro** and **Enterprise** plans. 
        Your current plan is <span className="uppercase font-bold text-primary-500">{planName}</span>.
      </p>

      <div className="flex gap-4">
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          Go Back
        </button>
        <button className="btn-primary" onClick={() => navigate('/upgrade')}>
          Upgrade Plan
        </button>
      </div>
    </div>
  );
};

export default UpgradePrompt;
