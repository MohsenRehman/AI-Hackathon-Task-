import React from 'react';
import { ShieldCheck, AlertTriangle, Flame, ShieldAlert } from 'lucide-react';
import { cn } from '../../../utils/cn.js';

const RiskMeter = ({ riskLevel = 'low' }) => {
  const normalized = riskLevel?.toLowerCase();

  const configs = {
    low: {
      color: 'text-medical-green bg-medical-green-light border-emerald-200',
      icon: ShieldCheck,
      title: 'Low Risk',
      desc: 'Symptoms are mild and safe. Standard monitoring is recommended.',
    },
    moderate: {
      color: 'text-medical-amber bg-medical-amber-light border-amber-200',
      icon: AlertTriangle,
      title: 'Moderate Risk',
      desc: 'Consultation with a healthcare provider is recommended soon.',
    },
    high: {
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      icon: Flame,
      title: 'High Risk',
      desc: 'Urgent medical attention is highly recommended.',
    },
    critical: {
      color: 'text-medical-red bg-medical-red-light border-red-200',
      icon: ShieldAlert,
      title: 'Critical Risk',
      desc: 'Emergency care required immediately. Do not delay.',
    },
  };

  const current = configs[normalized] || configs.low;
  const Icon = current.icon;

  return (
    <div className={cn('p-4 border rounded-xl flex items-start gap-4', current.color)}>
      <div className="p-2 rounded-lg bg-white/80 shadow-sm">
        <Icon className="h-6 w-6 flex-shrink-0" />
      </div>
      <div>
        <h4 className="text-base font-bold font-display leading-none mb-1">
          {current.title}
        </h4>
        <p className="text-xs opacity-90 leading-relaxed">
          {current.desc}
        </p>
      </div>
    </div>
  );
};

export default RiskMeter;
